
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Trash2, Moon, Star, Wind, Lightning } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Champion } from "./Roster";

const RosterForm3 = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-blue-950">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-none">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-blue-300 hover:text-blue-100 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-blue-100 drop-shadow-2xl">
              Champion Forms - Layout 3
            </h1>
            <p className="text-blue-300 mt-2 text-lg">
              Centered Form with Floating Actions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <Input
              placeholder="Search champions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/70 backdrop-blur-sm border-blue-800/50 text-blue-100 placeholder-blue-400 focus:border-blue-600 focus:ring-blue-600/20"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-black/70 backdrop-blur-sm border-blue-800/50 text-blue-100 focus:border-blue-600">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChampions.map((champion, index) => (
            <Card 
              key={champion.Champion_name}
              className="group relative overflow-hidden transition-all duration-500 hover:scale-105 
                bg-black/95 backdrop-blur-lg border-2 border-blue-800/60 hover:border-blue-600 
                hover:shadow-2xl hover:shadow-blue-900/60 animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.12}s`,
                boxShadow: '0 0 50px rgba(59, 130, 246, 0.15), inset 0 0 50px rgba(0, 0, 0, 0.9)'
              }}
            >
              {/* Floating Delete Button */}
              <div className="absolute top-4 right-4 z-20">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(champion.Champion_name)}
                  className="text-blue-400 hover:text-blue-200 hover:bg-blue-900/30 border border-blue-700/50 rounded-full w-8 h-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <CardHeader className="relative z-10 pb-4 bg-gradient-to-b from-blue-950/90 to-black/90 text-center">
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-blue-300 text-sm font-medium mb-2 block">Name</label>
                    <Input
                      value={editableNames[champion.Champion_name] || champion.Champion_name}
                      onChange={(e) => handleNameChange(champion.Champion_name, e.target.value)}
                      className="bg-black/70 border-blue-700/50 text-blue-100 placeholder-blue-400 focus:border-blue-500 focus:ring-blue-500/20 text-center"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6 bg-gradient-to-b from-black/90 to-blue-950/90">
                <div>
                  <label className="text-blue-300 text-sm font-medium mb-2 block text-center">Description</label>
                  <Textarea
                    value={editableDescriptions[champion.Champion_name] || ""}
                    onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                    placeholder="Champion's dark secrets..."
                    className="bg-black/70 border-blue-700/50 text-blue-100 placeholder-blue-400 focus:border-blue-500 focus:ring-blue-500/20 resize-none text-center"
                    rows={3}
                  />
                </div>

                {/* Celestial Powers Container */}
                <div className="bg-black/80 rounded-xl p-5 border border-blue-800/40 shadow-inner relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-blue-900/20 rounded-xl"></div>
                  <h3 className="text-blue-300 text-sm font-medium mb-4 text-center relative z-10">Celestial Powers</h3>
                  <div className="flex justify-center gap-6 relative z-10">
                    <Button 
                      size="sm" 
                      className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-indigo-900 to-black hover:from-indigo-800 hover:to-gray-900 text-indigo-100 border border-indigo-600/50 shadow-xl shadow-indigo-900/60 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Moon clicked')}}
                    >
                      <Moon className="w-5 h-5 mb-1" />
                      <span className="text-xs">Moon</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-yellow-900 to-black hover:from-yellow-800 hover:to-gray-900 text-yellow-100 border border-yellow-600/50 shadow-xl shadow-yellow-900/60 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Star clicked')}}
                    >
                      <Star className="w-5 h-5 mb-1" />
                      <span className="text-xs">Star</span>
                    </Button>
                  </div>
                </div>

                {/* Elemental Forces Container */}
                <div className="bg-black/80 rounded-xl p-5 border border-blue-800/40 shadow-inner relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-transparent to-cyan-900/20 rounded-xl"></div>
                  <h3 className="text-blue-300 text-sm font-medium mb-4 text-center relative z-10">Elemental Forces</h3>
                  <div className="flex justify-center gap-6 relative z-10">
                    <Button 
                      size="sm" 
                      className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-cyan-900 to-black hover:from-cyan-800 hover:to-gray-900 text-cyan-100 border border-cyan-600/50 shadow-xl shadow-cyan-900/60 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Wind clicked')}}
                    >
                      <Wind className="w-5 h-5 mb-1" />
                      <span className="text-xs">Wind</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-[70px] h-[70px] rounded-full bg-gradient-to-br from-violet-900 to-black hover:from-violet-800 hover:to-gray-900 text-violet-100 border border-violet-600/50 shadow-xl shadow-violet-900/60 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Storm clicked')}}
                    >
                      <Lightning className="w-5 h-5 mb-1" />
                      <span className="text-xs">Storm</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChampions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-blue-400 text-lg">No champions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterForm3;
