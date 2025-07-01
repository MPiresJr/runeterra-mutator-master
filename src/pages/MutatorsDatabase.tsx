
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { AddMutatorDialog } from "@/components/mutators/AddMutatorDialog";
import { EditMutatorDialog } from "@/components/mutators/EditMutatorDialog";
import { MutatorControls } from "@/components/mutators/MutatorControls";
import { MutatorCard } from "@/components/mutators/MutatorCard";
import { useMutators, Mutator } from "@/hooks/useMutators";
import { useExcelImport } from "@/hooks/useExcelImport";
import { GlobalHeader } from "@/components/GlobalHeader";

const MutatorsDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMutator, setEditingMutator] = useState<Mutator | null>(null);

  const {
    mutators,
    handleAddMutator,
    handleEditMutator,
    handleDeleteMutator,
    addImportedMutators
  } = useMutators();

  const {
    fileInputRef,
    handleExcelImport,
    handleImportClick
  } = useExcelImport(addImportedMutators);

  const filteredMutators = mutators.filter(mutator => {
    const matchesSearch = mutator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mutator.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (mutator.tag && mutator.tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const handleEditClick = (mutator: Mutator) => {
    setEditingMutator(mutator);
  };

  const handleEditComplete = (updatedMutator: Mutator) => {
    handleEditMutator(updatedMutator);
    setEditingMutator(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <GlobalHeader />
      <div className="max-w-[95vw] mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Mutators Database
            </h1>
            <p className="text-muted-foreground mt-2">
              Master every mutator with detailed strategies and champion recommendations
            </p>
          </div>
        </div>

        {/* Controls */}
        <MutatorControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onImportClick={handleImportClick}
          onAddClick={() => setIsAddDialogOpen(true)}
          fileInputRef={fileInputRef}
          onFileChange={handleExcelImport}
        />

        {/* Mutators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredMutators.map((mutator) => (
            <MutatorCard
              key={mutator.id}
              mutator={mutator}
              onEdit={handleEditClick}
              onDelete={handleDeleteMutator}
            />
          ))}
        </div>

        {filteredMutators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No mutators found matching your criteria.</p>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Dialogs */}
        <AddMutatorDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddMutator}
        />

        {editingMutator && (
          <EditMutatorDialog
            open={!!editingMutator}
            onOpenChange={(open) => !open && setEditingMutator(null)}
            mutator={editingMutator}
            onEdit={handleEditComplete}
          />
        )}
      </div>
    </div>
  );
};

export default MutatorsDatabase;
