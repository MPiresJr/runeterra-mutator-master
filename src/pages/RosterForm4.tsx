
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Trash2, Swords, Crosshair, Gauge, Wrench } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Champion } from "./Roster";

const RosterForm4 = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-black to-green-950">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-none">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-emerald-300 hover:text-emerald-100 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-emerald-100 drop-shadow-2xl">
              Champion Forms - Layout 4
            </h1>
            <p className="text-emerald-300 mt-2 text-lg">
              Tactical Form with Side Actions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-4 h-4" />
            <Input
              placeholder="Search champions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/70 backdrop-blur-sm border-emerald-800/50 text-emerald-100 placeholder-emerald-400 focus:border-emerald-600 focus:ring-emerald-600/20"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-black/70 backdrop-blur-sm border-emerald-800/50 text-emerald-100 focus:border-emerald-600">
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {filteredChampions.map((champion, index) => (
            <Card 
              key={champion.Champion_name}
              className="group relative overflow-hidden transition-all duration-500 hover:scale-102 
                bg-black/95 backdrop-blur-lg border-2 border-emerald-800/60 hover:border-emerald-600 
                hover:shadow-2xl hover:shadow-emerald-900/50 animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.08}s`,
                boxShadow: '0 0 45px rgba(16, 185, 129, 0.15), inset 0 0 45px rgba(0, 0, 0, 0.9)'
              }}
            >
              <div className="flex">
                {/* Main Form Section */}
                <div className="flex-1 p-6 bg-gradient-to-b from-emerald-950/80 to-black/80">
                  <div className="absolute top-4 right-4 z-20">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(champion.Champion_name)}
                      className="text-emerald-400 hover:text-emerald-200 hover:bg-emerald-900/30 border border-emerald-700/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-6 pt-8">
                    <div>
                      <label className="text-emerald-300 text-sm font-medium mb-2 block">Champion Name</label>
                      <Input
                        value={editableNames[champion.Champion_name] || champion.Champion_name}
                        onChange={(e) => handleNameChange(champion.Champion_name, e.target.value)}
                        className="bg-black/70 border-emerald-700/50 text-emerald-100 placeholder-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-emerald-300 text-sm font-medium mb-2 block">Tactical Notes</label>
                      <Textarea
                        value={editableDescriptions[champion.Champion_name] || ""}
                        onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                        placeholder="Strategic insights and combat notes..."
                        className="bg-black/70 border-emerald-700/50 text-emerald-100 placeholder-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20 resize-none"
                        rows={5}
                      />
                    </div>
                  </div>
                </div>

                {/* Side Action Panel */}
                <div className="w-48 p-4 bg-gradient-to-b from-black/90 to-emerald-950/90 flex flex-col justify-center space-y-6">
                  {/* Combat Tactics Container */}
                  <div className="bg-black/80 rounded-lg p-4 border border-emerald-800/40 shadow-inner">
                    <h3 className="text-emerald-300 text-sm font-medium mb-3 text-center">Combat</h3>
                    <div className="space-y-3">
                      <Button 
                        size="sm" 
                        className="w-[55px] h-[55px] rounded-full bg-gradient-to-br from-red-900 to-black hover:from-red-800 hover:to-gray-900 text-red-100 border border-red-600/50 shadow-lg shadow-red-900/50 flex flex-col items-center justify-center p-0 mx-auto"
                        onClick={(e) => {e.stopPropagation(); console.log('Melee clicked')}}
                      >
                        <Swords className="w-4 h-4 mb-1" />
                        <span className="text-xs">Melee</span>
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-[55px] h-[55px] rounded-full bg-gradient-to-br from-orange-900 to-black hover:from-orange-800 hover:to-gray-900 text-orange-100 border border-orange-600/50 shadow-lg shadow-orange-900/50 flex flex-col items-center justify-center p-0 mx-auto"
                        onClick={(e) => {e.stopPropagation(); console.log('Range clicked')}}
                      >
                        <Crosshair className="w-4 h-4 mb-1" />
                        <span className="text-xs">Range</span>
                      </Button>
                    </div>
                  </div>

                  {/* Support Systems Container */}
                  <div className="bg-black/80 rounded-lg p-4 border border-emerald-800/40 shadow-inner">
                    <h3 className="text-emerald-300 text-sm font-medium mb-3 text-center">Support</h3>
                    <div className="space-y-3">
                      <Button 
                        size="sm" 
                        className="w-[55px] h-[55px] rounded-full bg-gradient-to-br from-blue-900 to-black hover:from-blue-800 hover:to-gray-900 text-blue-100 border border-blue-600/50 shadow-lg shadow-blue-900/50 flex flex-col items-center justify-center p-0 mx-auto"
                        onClick={(e) => {e.stopPropagation(); console.log('Boost clicked')}}
                      >
                        <Gauge className="w-4 h-4 mb-1" />
                        <span className="text-xs">Boost</span>
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-[55px] h-[55px] rounded-full bg-gradient-to-br from-purple-900 to-black hover:from-purple-800 hover:to-gray-900 text-purple-100 border border-purple-600/50 shadow-lg shadow-purple-900/50 flex flex-col items-center justify-center p-0 mx-auto"
                        onClick={(e) => {e.stopPropagation(); console.log('Repair clicked')}}
                      >
                        <Wrench className="w-4 h-4 mb-1" />
                        <span className="text-xs">Repair</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredChampions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-emerald-400 text-lg">No champions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterForm4;
