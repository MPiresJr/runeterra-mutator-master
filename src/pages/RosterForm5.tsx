
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Trash2, Crown, Sparkles, Mountain, Waves } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Champion } from "./Roster";

const RosterForm5 = () => {
  const navigate = useNavigate();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [editableNames, setEditableNames] = useState<{[key: string]: string}>({});
  const [editableDescriptions, setEditableDescriptions] = useState<{[key: string]: string}>({});

  const regions = ["Ionia", "Demacia", "Freljord", "Piltover", "Shadow Isles", "Targon", "Runeterra", "Noxus", "Bilgewater", "Shurima", "Bandle City"];

  useEffect(() => {
    const savedData = localStorage.getItem('lorCompanionData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.Roster) {
          setChampions(data.Roster);
        }
      } catch (error) {
        console.error('Error loading roster data:', error);
      }
    }
  }, []);

  const filteredChampions = champions.filter(champion => {
    const matchesSearch = champion.Champion_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "All" || 
                         champion.Region === selectedRegion || 
                         champion.Region_2 === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleNameChange = (championName: string, newName: string) => {
    setEditableNames(prev => ({ ...prev, [championName]: newName }));
  };

  const handleDescriptionChange = (championName: string, newDescription: string) => {
    setEditableDescriptions(prev => ({ ...prev, [championName]: newDescription }));
  };

  const handleDelete = (championName: string) => {
    setChampions(prev => prev.filter(c => c.Champion_name !== championName));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-black to-yellow-950">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-none">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-amber-300 hover:text-amber-100 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-amber-100 drop-shadow-2xl">
              Champion Forms - Layout 5
            </h1>
            <p className="text-amber-300 mt-2 text-lg">
              Stacked Form with Inline Actions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-4 h-4" />
            <Input
              placeholder="Search champions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/70 backdrop-blur-sm border-amber-800/50 text-amber-100 placeholder-amber-400 focus:border-amber-600 focus:ring-amber-600/20"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-black/70 backdrop-blur-sm border-amber-800/50 text-amber-100 focus:border-amber-600">
              <SelectValue placeholder="Filter by Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredChampions.map((champion, index) => (
            <Card 
              key={champion.Champion_name}
              className="group relative overflow-hidden transition-all duration-500 hover:scale-103 
                bg-black/95 backdrop-blur-lg border-2 border-amber-800/60 hover:border-amber-600 
                hover:shadow-2xl hover:shadow-amber-900/60 animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                boxShadow: '0 0 60px rgba(245, 158, 11, 0.2), inset 0 0 60px rgba(0, 0, 0, 0.9)'
              }}
            >
              <CardHeader className="relative z-10 pb-4 bg-gradient-to-b from-amber-950/90 to-black/90">
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(champion.Champion_name)}
                    className="text-amber-400 hover:text-amber-200 hover:bg-amber-900/30 border border-amber-700/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4 pt-8">
                  <div>
                    <label className="text-amber-300 text-sm font-medium mb-2 block">Champion Name</label>
                    <Input
                      value={editableNames[champion.Champion_name] || champion.Champion_name}
                      onChange={(e) => handleNameChange(champion.Champion_name, e.target.value)}
                      className="bg-black/70 border-amber-700/50 text-amber-100 placeholder-amber-400 focus:border-amber-500 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-amber-300 text-sm font-medium mb-2 block">Legacy Description</label>
                    <Textarea
                      value={editableDescriptions[champion.Champion_name] || ""}
                      onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                      placeholder="Ancient legends and forgotten lore..."
                      className="bg-black/70 border-amber-700/50 text-amber-100 placeholder-amber-400 focus:border-amber-500 focus:ring-amber-500/20 resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 bg-gradient-to-b from-black/90 to-amber-950/90">
                {/* Royal Powers - Horizontal Layout */}
                <div className="bg-black/80 rounded-lg p-4 border border-amber-800/40 shadow-inner">
                  <h3 className="text-amber-300 text-sm font-medium mb-3 text-center">Royal Powers</h3>
                  <div className="flex justify-center gap-6">
                    <Button 
                      size="sm" 
                      className="w-[75px] h-[75px] rounded-full bg-gradient-to-br from-yellow-900 to-black hover:from-yellow-800 hover:to-gray-900 text-yellow-100 border border-yellow-600/50 shadow-xl shadow-yellow-900/60 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Crown clicked')}}
                    >
                      <Crown className="w-5 h-5 mb-1" />
                      <span className="text-xs">Crown</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-[75px] h-[75px] rounded-full bg-gradient-to-br from-purple-900 to-black hover:from-purple-800 hover:to-gray-900 text-purple-100 border border-purple-600/50 shadow-xl shadow-purple-900/60 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Magic clicked')}}
                    >
                      <Sparkles className="w-5 h-5 mb-1" />
                      <span className="text-xs">Magic</span>
                    </Button>
                  </div>
                </div>

                {/* Elemental Mastery - Horizontal Layout */}
                <div className="bg-black/80 rounded-lg p-4 border border-amber-800/40 shadow-inner">
                  <h3 className="text-amber-300 text-sm font-medium mb-3 text-center">Elemental Mastery</h3>
                  <div className="flex justify-center gap-6">
                    <Button 
                      size="sm" 
                      className="w-[75px] h-[75px] rounded-full bg-gradient-to-br from-stone-900 to-black hover:from-stone-800 hover:to-gray-900 text-stone-100 border border-stone-600/50 shadow-xl shadow-stone-900/60 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Earth clicked')}}
                    >
                      <Mountain className="w-5 h-5 mb-1" />
                      <span className="text-xs">Earth</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-[75px] h-[75px] rounded-full bg-gradient-to-br from-blue-900 to-black hover:from-blue-800 hover:to-gray-900 text-blue-100 border border-blue-600/50 shadow-xl shadow-blue-900/60 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Water clicked')}}
                    >
                      <Waves className="w-5 h-5 mb-1" />
                      <span className="text-xs">Water</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChampions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-amber-400 text-lg">No champions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterForm5;
