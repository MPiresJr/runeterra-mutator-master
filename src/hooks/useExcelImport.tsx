
import { useRef } from "react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { Mutator } from "./useMutators";

export const useExcelImport = (onImport: (mutators: Mutator[]) => void) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          const tag = row.Tag || row['Tag'] || "";

          // Validate rarity
          const validRarity = ["Common", "Rare", "Epic", "Legendary"].includes(rarity) ? rarity : "Common";

          console.log('Processing row:', {
            name,
            rarity: validRarity,
            description,
            goodChampions,
            badChampions,
            strategy,
            tag
          });

          return {
            id: `imported-${Date.now()}-${index}`,
            name: String(name),
            rarity: validRarity as "Common" | "Rare" | "Epic" | "Legendary",
            description: String(description),
            goodChampions: String(goodChampions),
            badChampions: String(badChampions),
            strategy: String(strategy),
            tag: String(tag)
          };
        });

        if (importedMutators.length > 0) {
          onImport(importedMutators);
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

  return {
    fileInputRef,
    handleExcelImport,
    handleImportClick
  };
};
