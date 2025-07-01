
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Database, Calendar, FileSpreadsheet, Download, Upload, LogIn, UserPlus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { ClearDataButton } from "@/components/ClearDataButton";
import { useUnifiedDatabase } from "@/hooks/useUnifiedDatabase";

const Index = () => {
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

  const handleLogin = () => {
    toast.info("Login functionality coming soon! Please connect to Supabase for authentication.");
  };

  const handleRegister = () => {
    toast.info("Register functionality coming soon! Please connect to Supabase for authentication.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      <div className="max-w-[95vw] mx-auto px-4 py-12">
        {/* Header with Auth Buttons */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Legends of Runeterra
            </h1>
            <p className="text-xl text-muted-foreground mb-2">Companion App</p>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Master your matches and monthly challenges with comprehensive mutator strategies, 
              champion databases, and powerful tracking tools.
            </p>
          </div>
          
          <div className="flex gap-2 items-start">
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
        </div>

        {/* Import/Export Section */}
        <div className="mb-12">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-500/10 to-green-500/10 border-blue-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Excel Data Management</CardTitle>
              <CardDescription className="text-lg">
                Import your LoR data or export your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 justify-center">
              <Button onClick={handleImportClick} className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Import Excel
              </Button>
              <Button onClick={handleExportData} className="bg-green-600 hover:bg-green-700">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleExcelImport}
          style={{ display: 'none' }}
        />

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Link to="/mutators">
            <Card className="hover:bg-card/80 transition-all duration-300 border-purple-500/20 hover:border-purple-500/50 cursor-pointer h-full">
              <CardHeader className="text-center">
                <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <CardTitle className="text-2xl">Mutators</CardTitle>
                <CardDescription className="text-base">
                  Complete mutator database with strategies and champion recommendations for every encounter
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/roster">
            <Card className="hover:bg-card/80 transition-all duration-300 border-blue-500/20 hover:border-blue-500/50 cursor-pointer h-full">
              <CardHeader className="text-center">
                <Database className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <CardTitle className="text-2xl">Roster</CardTitle>
                <CardDescription className="text-base">
                  Manage your champion collection with detailed tracking and region-based filtering
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/monthly-challenge">
            <Card className="hover:bg-card/80 transition-all duration-300 border-orange-500/20 hover:border-orange-500/50 cursor-pointer h-full">
              <CardHeader className="text-center">
                <Calendar className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <CardTitle className="text-2xl">Monthly Challenge</CardTitle>
                <CardDescription className="text-base">
                  Track your progress in monthly challenges and optimize your strategies
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:bg-card/80 transition-colors border-purple-500/20">
            <CardHeader className="text-center">
              <FileSpreadsheet className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Excel Integration</CardTitle>
              <CardDescription>
                Seamlessly import and export your data with Excel compatibility
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:bg-card/80 transition-colors border-blue-500/20">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Smart Filtering</CardTitle>
              <CardDescription>
                Advanced filtering by region, level, and star power for precise management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:bg-card/80 transition-colors border-green-500/20">
            <CardHeader className="text-center">
              <Database className="w-12 h-12 text-blue-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Progress Tracking</CardTitle>
              <CardDescription>
                Keep track of your champion unlocks and progression levels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:bg-card/80 transition-colors border-orange-500/20">
            <CardHeader className="text-center">
              <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-2" />
              <CardTitle className="text-lg">Auto Save</CardTitle>
              <CardDescription>
                Automatic data persistence with every action you perform
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
