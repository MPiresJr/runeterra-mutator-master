
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { ClearDataButton } from "@/components/ClearDataButton";
import { useUnifiedDatabase } from "@/hooks/useUnifiedDatabase";

export const GlobalHeader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { clearAllData } = useUnifiedDatabase();

  const handleExcelImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const allData: any = {};
        
        // Read all sheets
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          allData[sheetName] = jsonData;
        });

        // Process mutators if present
        const mutatorsSheet = workbook.SheetNames.find(name => 
          name.toLowerCase().includes('mutator')
        );
        
        if (mutatorsSheet && allData[mutatorsSheet]) {
          const mutatorsData = allData[mutatorsSheet].map((row: any, index: number) => {
            const name = String(row.Mutator_name || row['Mutator_name'] || `Imported Mutator ${index + 1}`);
            const rarity = String(row.Rarity || row['Rarity'] || "Common");
            const description = String(row.Mutator || row['Mutator'] || "");
            const goodChampions = String(row.Good_champions || row['Good_champions'] || "");
            const badChampions = String(row.Bad_champions || row['Bad_champions'] || "");
            const strategy = String(row.Strategy || row['Strategy'] || "");
            const tag = String(row.Mutator_tags || row['Mutator_tags'] || row.Tag || row['Tag'] || "");

            const validRarity = ["Common", "Rare", "Epic", "Legendary"].includes(rarity) ? rarity : "Common";

            return {
              id: `imported-${Date.now()}-${index}`,
              name,
              rarity: validRarity as "Common" | "Rare" | "Epic" | "Legendary",
              description,
              goodChampions,
              badChampions,
              strategy,
              tag
            };
          });

          localStorage.setItem('lorMutators', JSON.stringify(mutatorsData));
        }

        // Store all imported data
        localStorage.setItem('lorCompanionData', JSON.stringify(allData));
        toast.success(`Successfully imported data from ${workbook.SheetNames.length} sheets!`);
        
        // Reload to update all components
        window.location.reload();
      } catch (error) {
        console.error('Excel import error:', error);
        toast.error("Failed to import Excel file. Please check the file format.");
      }
    };

    reader.readAsArrayBuffer(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExportData = () => {
    const savedData = localStorage.getItem('lorCompanionData');
    const savedMutators = localStorage.getItem('lorMutators');
    const savedTags = localStorage.getItem('lorTags');
    
    if (!savedData && !savedMutators && !savedTags) {
      toast.error("No data to export. Please add some data first.");
      return;
    }

    try {
      const data = savedData ? JSON.parse(savedData) : {};
      
      // Include mutators data in export
      if (savedMutators) {
        const mutatorsData = JSON.parse(savedMutators);
        const exportMutators = mutatorsData.map((mutator: any) => ({
          Mutator_name: mutator.name,
          Rarity: mutator.rarity,
          Mutator: mutator.description,
          Good_champions: mutator.goodChampions,
          Bad_champions: mutator.badChampions,
          Strategy: mutator.strategy,
          Mutator_tags: mutator.tag || ""
        }));
        data.Mutators = exportMutators;
      }
      
      // Include tags data
      if (savedTags) {
        const tagsData = JSON.parse(savedTags);
        const exportTags = Object.entries(tagsData).map(([tagName, tagData]: [string, any]) => ({
          Tag_name: tagName,
          Good_champions: tagData.goodChampions || "",
          Bad_champions: tagData.badChampions || ""
        }));
        data.Tags = exportTags;
      }
      
      const workbook = XLSX.utils.book_new();

      Object.keys(data).forEach(sheetName => {
        const worksheet = XLSX.utils.json_to_sheet(data[sheetName]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      XLSX.writeFile(workbook, 'LoR_Companion_Export.xlsx');
      toast.success("Data exported successfully!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export data.");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50 pointer-events-none">
      <div className="flex gap-2 pointer-events-auto">
        <Button onClick={handleImportClick} className="bg-blue-600 hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Import
        </Button>
        <Button onClick={handleExportData} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
      
      <div className="flex gap-2 items-center pointer-events-auto">
        <ClearDataButton onClear={clearAllData} />
        <Button variant="outline" className="border-blue-500/50 hover:bg-blue-500/10" onClick={() => toast.info("Login functionality coming soon! Please connect to Supabase for authentication.")}>
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
        <Button variant="outline" className="border-green-500/50 hover:bg-green-500/10" onClick={() => toast.info("Register functionality coming soon! Please connect to Supabase for authentication.")}>
          <UserPlus className="w-4 h-4 mr-2" />
          Register
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleExcelImport}
        style={{ display: 'none' }}
      />
    </div>
  );
};
