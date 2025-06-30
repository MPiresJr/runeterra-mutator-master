
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, Edit, Trash2, FileSpreadsheet } from "lucide-react";
import { AddMutatorDialog } from "@/components/mutators/AddMutatorDialog";
import { EditMutatorDialog } from "@/components/mutators/EditMutatorDialog";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

export interface Mutator {
  id: string;
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  description: string;
  goodChampions: string;
  badChampions: string;
  strategy: string;
}

const MutatorsDatabase = () => {
  // Clear existing mutators - starting with empty array
  const [mutators, setMutators] = useState<Mutator[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<string>("All");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMutator, setEditingMutator] = useState<Mutator | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const rarityColors = {
    Common: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    Rare: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Epic: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Legendary: "bg-orange-500/20 text-orange-300 border-orange-500/30"
  };

  const filteredMutators = mutators.filter(mutator => {
    const matchesSearch = mutator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mutator.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === "All" || mutator.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const handleAddMutator = (mutator: Omit<Mutator, "id">) => {
    const newMutator = {
      ...mutator,
      id: Date.now().toString()
    };
    setMutators(prev => [...prev, newMutator]);
    toast.success("Mutator added successfully!");
  };

  const handleEditMutator = (updatedMutator: Mutator) => {
    setMutators(prev => prev.map(m => m.id === updatedMutator.id ? updatedMutator : m));
    setEditingMutator(null);
    toast.success("Mutator updated successfully!");
  };

  const handleDeleteMutator = (id: string) => {
    setMutators(prev => prev.filter(m => m.id !== id));
    toast.success("Mutator deleted successfully!");
  };

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Look for a sheet named 'Mutators' or use the first sheet
        const sheetName = workbook.SheetNames.find(name => 
          name.toLowerCase().includes('mutator')
        ) || workbook.SheetNames[0];
        
        if (!sheetName) {
          toast.error("No suitable sheet found in the Excel file");
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Excel data:', jsonData);

        const importedMutators: Mutator[] = jsonData.map((row: any, index: number) => {
          // Use the correct column names as specified
          const name = row.Mutator_name || row['Mutator_name'] || `Imported Mutator ${index + 1}`;
          const rarity = row.Rarity || row['Rarity'] || "Common";
          const description = row.Mutator || row['Mutator'] || "";
          const goodChampions = row.Good_champions || row['Good_champions'] || "";
          const badChampions = row.Bad_champions || row['Bad_champions'] || "";
          const strategy = row.Strategy || row['Strategy'] || "";

          // Validate rarity
          const validRarity = ["Common", "Rare", "Epic", "Legendary"].includes(rarity) ? rarity : "Common";

          console.log('Processing row:', {
            name,
            rarity: validRarity,
            description,
            goodChampions,
            badChampions,
            strategy
          });

          return {
            id: `imported-${Date.now()}-${index}`,
            name: String(name),
            rarity: validRarity as "Common" | "Rare" | "Epic" | "Legendary",
            description: String(description),
            goodChampions: String(goodChampions),
            badChampions: String(badChampions),
            strategy: String(strategy)
          };
        });

        if (importedMutators.length > 0) {
          setMutators(prev => [...prev, ...importedMutators]);
          toast.success(`Successfully imported ${importedMutators.length} mutators!`);
        } else {
          toast.error("No valid mutator data found in the Excel file");
        }
      } catch (error) {
        console.error('Excel import error:', error);
        toast.error("Failed to import Excel file. Please check the file format.");
      }
    };

    reader.readAsArrayBuffer(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <div className="container mx-auto px-4 py-8">
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
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search mutators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            {["All", "Common", "Rare", "Epic", "Legendary"].map((rarity) => (
              <Button
                key={rarity}
                variant={selectedRarity === rarity ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRarity(rarity)}
                className={selectedRarity === rarity ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {rarity}
              </Button>
            ))}
          </div>

          <Button onClick={handleImportClick} className="bg-blue-600 hover:bg-blue-700">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Import Excel
          </Button>

          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Mutator
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleExcelImport}
          style={{ display: 'none' }}
        />

        {/* Mutators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMutators.map((mutator) => (
            <Card key={mutator.id} className="hover:bg-card/80 transition-all duration-200 border-purple-500/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{mutator.name}</CardTitle>
                    <Badge className={rarityColors[mutator.rarity]}>
                      {mutator.rarity}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingMutator(mutator)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMutator(mutator.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {mutator.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Good Champions</h4>
                  <p className="text-sm text-muted-foreground">{mutator.goodChampions}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Avoid Champions</h4>
                  <p className="text-sm text-muted-foreground">{mutator.badChampions}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-400 mb-1">Strategy</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mutator.strategy}</p>
                </div>
              </CardContent>
            </Card>
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
            onEdit={handleEditMutator}
          />
        )}
      </div>
    </div>
  );
};

export default MutatorsDatabase;
