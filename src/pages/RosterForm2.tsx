
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Trash2, Skull, Flame, Heart, Eye } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Champion } from "./Roster";

const RosterForm2 = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-950">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-none">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-100 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-purple-100 drop-shadow-2xl">
              Champion Forms - Layout 2
            </h1>
            <p className="text-purple-300 mt-2 text-lg">
              Horizontal Split Form Layout
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-4 h-4" />
            <Input
              placeholder="Search champions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/70 backdrop-blur-sm border-purple-800/50 text-purple-100 placeholder-purple-400 focus:border-purple-600 focus:ring-purple-600/20"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-black/70 backdrop-blur-sm border-purple-800/50 text-purple-100 focus:border-purple-600">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredChampions.map((champion, index) => (
            <Card 
              key={champion.Champion_name}
              className="group relative overflow-hidden transition-all duration-500 hover:scale-102 
                bg-black/90 backdrop-blur-lg border-2 border-purple-800/60 hover:border-purple-600 
                hover:shadow-2xl hover:shadow-purple-900/50 animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                boxShadow: '0 0 40px rgba(147, 51, 234, 0.2), inset 0 0 40px rgba(0, 0, 0, 0.8)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* Left Side - Form Fields */}
                <div className="p-6 bg-gradient-to-b from-purple-950/80 to-black/80 relative">
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(champion.Champion_name)}
                      className="text-purple-400 hover:text-purple-200 hover:bg-purple-900/30 border border-purple-700/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4 pt-8">
                    <div>
                      <label className="text-purple-300 text-sm font-medium mb-2 block">Champion Name</label>
                      <Input
                        value={editableNames[champion.Champion_name] || champion.Champion_name}
                        onChange={(e) => handleNameChange(champion.Champion_name, e.target.value)}
                        className="bg-black/60 border-purple-700/50 text-purple-100 placeholder-purple-400 focus:border-purple-500 focus:ring-purple-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-purple-300 text-sm font-medium mb-2 block">Description</label>
                      <Textarea
                        value={editableDescriptions[champion.Champion_name] || ""}
                        onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                        placeholder="Enter champion lore..."
                        className="bg-black/60 border-purple-700/50 text-purple-100 placeholder-purple-400 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Side - Button Groups */}
                <div className="p-6 bg-gradient-to-b from-black/80 to-purple-950/80 flex flex-col justify-center space-y-6">
                  {/* Dark Powers Container */}
                  <div className="bg-black/70 rounded-lg p-4 border border-purple-800/40 shadow-inner">
                    <h3 className="text-purple-300 text-sm font-medium mb-4 text-center">Dark Powers</h3>
                    <div className="flex justify-center gap-4">
                      <Button 
                        size="sm" 
                        className="w-[65px] h-[65px] rounded-full bg-gradient-to-br from-red-900 to-black hover:from-red-800 hover:to-gray-900 text-red-100 border border-red-700/50 shadow-lg shadow-red-900/50 flex flex-col items-center justify-center p-0"
                        onClick={(e) => {e.stopPropagation(); console.log('Death clicked')}}
                      >
                        <Skull className="w-5 h-5 mb-1" />
                        <span className="text-xs">Death</span>
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-[65px] h-[65px] rounded-full bg-gradient-to-br from-orange-900 to-black hover:from-orange-800 hover:to-gray-900 text-orange-100 border border-orange-700/50 shadow-lg shadow-orange-900/50 flex flex-col items-center justify-center p-0"
                        onClick={(e) => {e.stopPropagation(); console.log('Fire clicked')}}
                      >
                        <Flame className="w-5 h-5 mb-1" />
                        <span className="text-xs">Fire</span>
                      </Button>
                    </div>
                  </div>

                  {/* Forbidden Arts Container */}
                  <div className="bg-black/70 rounded-lg p-4 border border-purple-800/40 shadow-inner">
                    <h3 className="text-purple-300 text-sm font-medium mb-4 text-center">Forbidden Arts</h3>
                    <div className="flex justify-center gap-4">
                      <Button 
                        size="sm" 
                        className="w-[65px] h-[65px] rounded-full bg-gradient-to-br from-pink-900 to-black hover:from-pink-800 hover:to-gray-900 text-pink-100 border border-pink-700/50 shadow-lg shadow-pink-900/50 flex flex-col items-center justify-center p-0"
                        onClick={(e) => {e.stopPropagation(); console.log('Soul clicked')}}
                      >
                        <Heart className="w-5 h-5 mb-1" />
                        <span className="text-xs">Soul</span>
                      </Button>
                      <Button 
                        size="sm" 
                        className="w-[65px] h-[65px] rounded-full bg-gradient-to-br from-indigo-900 to-black hover:from-indigo-800 hover:to-gray-900 text-indigo-100 border border-indigo-700/50 shadow-lg shadow-indigo-900/50 flex flex-col items-center justify-center p-0"
                        onClick={(e) => {e.stopPropagation(); console.log('Vision clicked')}}
                      >
                        <Eye className="w-5 h-5 mb-1" />
                        <span className="text-xs">Vision</span>
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
            <p className="text-purple-400 text-lg">No champions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterForm2;
