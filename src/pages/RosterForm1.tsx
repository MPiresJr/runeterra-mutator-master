
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Trash2, Sword, Shield, Zap, Target, Lightning } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Champion } from "./Roster";

const RosterForm1 = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-none">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-red-300 hover:text-red-100 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-red-100 drop-shadow-2xl">
              Champion Forms - Layout 1
            </h1>
            <p className="text-red-300 mt-2 text-lg">
              Ominous Vertical Form Layout
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-4 h-4" />
            <Input
              placeholder="Search champions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/70 backdrop-blur-sm border-red-800/50 text-red-100 placeholder-red-400 focus:border-red-600 focus:ring-red-600/20"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-black/70 backdrop-blur-sm border-red-800/50 text-red-100 focus:border-red-600">
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
                bg-black/90 backdrop-blur-lg border-2 border-red-800/60 hover:border-red-600 
                hover:shadow-2xl hover:shadow-red-900/50 animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.15}s`,
                boxShadow: '0 0 30px rgba(220, 38, 38, 0.2), inset 0 0 30px rgba(0, 0, 0, 0.8)'
              }}
            >
              <CardHeader className="relative z-10 pb-4 bg-gradient-to-b from-red-950/80 to-black/80">
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(champion.Champion_name)}
                    className="text-red-400 hover:text-red-200 hover:bg-red-900/30 border border-red-700/50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4 pt-8">
                  <div>
                    <label className="text-red-300 text-sm font-medium mb-2 block">Name</label>
                    <Input
                      value={editableNames[champion.Champion_name] || champion.Champion_name}
                      onChange={(e) => handleNameChange(champion.Champion_name, e.target.value)}
                      className="bg-black/60 border-red-700/50 text-red-100 placeholder-red-400 focus:border-red-500 focus:ring-red-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-red-300 text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={editableDescriptions[champion.Champion_name] || ""}
                      onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                      placeholder="Add description..."
                      className="bg-black/60 border-red-700/50 text-red-100 placeholder-red-400 focus:border-red-500 focus:ring-red-500/20 resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6 bg-gradient-to-b from-black/80 to-red-950/80">
                {/* Combat Actions Container */}
                <div className="bg-black/60 rounded-lg p-4 border border-red-800/40 shadow-inner">
                  <h3 className="text-red-300 text-sm font-medium mb-3 text-center">Combat Actions</h3>
                  <div className="flex justify-center gap-4">
                    <Button 
                      size="sm" 
                      className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-red-100 border border-red-600/50 shadow-lg shadow-red-900/50 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Attack clicked')}}
                    >
                      <Sword className="w-4 h-4 mb-1" />
                      <span className="text-xs">Attack</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-gray-100 border border-gray-600/50 shadow-lg shadow-gray-900/50 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Defend clicked')}}
                    >
                      <Shield className="w-4 h-4 mb-1" />
                      <span className="text-xs">Defend</span>
                    </Button>
                  </div>
                </div>

                {/* Special Abilities Container */}
                <div className="bg-black/60 rounded-lg p-4 border border-red-800/40 shadow-inner">
                  <h3 className="text-red-300 text-sm font-medium mb-3 text-center">Special Abilities</h3>
                  <div className="flex justify-center gap-4">
                    <Button 
                      size="sm" 
                      className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 text-purple-100 border border-purple-600/50 shadow-lg shadow-purple-900/50 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Magic clicked')}}
                    >
                      <Zap className="w-4 h-4 mb-1" />
                      <span className="text-xs">Magic</span>
                    </Button>
                    <Button 
                      size="sm" 
                      className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-amber-900 to-orange-900 hover:from-amber-800 hover:to-orange-800 text-amber-100 border border-amber-600/50 shadow-lg shadow-amber-900/50 flex flex-col items-center justify-center p-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Focus clicked')}}
                    >
                      <Target className="w-4 h-4 mb-1" />
                      <span className="text-xs">Focus</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChampions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">No champions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterForm1;
