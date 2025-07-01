
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileSpreadsheet } from "lucide-react";

interface MutatorControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onImportClick: () => void;
  onAddClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MutatorControls = ({
  searchTerm,
  onSearchChange,
  onImportClick,
  onAddClick,
  fileInputRef,
  onFileChange
}: MutatorControlsProps) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search mutators..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button onClick={onImportClick} className="bg-blue-600 hover:bg-blue-700">
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Import Excel
        </Button>

        <Button onClick={onAddClick} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Mutator
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={onFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
};
