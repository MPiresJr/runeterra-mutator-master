
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Star, Edit2, Save, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Champion } from "./Roster";

const RosterAlt1 = () => {
  const navigate = useNavigate();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [cardTitles, setCardTitles] = useState<{[key: string]: string}>({});
  const [cardDescriptions, setCardDescriptions] = useState<{[key: string]: string}>({});

  const regionColors = {
    "Ionia": "from-pink-500/30 to-pink-600/30 border-pink-500/50",
    "Demacia": "from-gray-300/30 to-gray-400/30 border-gray-300/50",
    "Freljord": "from-cyan-500/30 to-cyan-600/30 border-cyan-500/50",
    "Piltover": "from-yellow-500/30 to-yellow-600/30 border-yellow-500/50",
    "Shadow Isles": "from-green-800/30 to-green-900/30 border-green-800/50",
    "Targon": "from-purple-500/30 to-purple-600/30 border-purple-500/50",
    "Runeterra": "from-gray-500/30 to-gray-600/30 border-gray-500/50",
    "Noxus": "from-red-600/30 to-red-700/30 border-red-600/50",
    "Bilgewater": "from-orange-600/30 to-orange-700/30 border-orange-600/50",
    "Shurima": "from-yellow-600/30 to-yellow-700/30 border-yellow-600/50",
    "Bandle City": "from-green-500/30 to-green-600/30 border-green-500/50"
  };

  const regions = Object.keys(regionColors);

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

  const getChampionStars = (champion: Champion): number => {
    let stars = 0;
    for (let i = 1; i <= 6; i++) {
      if (champion[`Star_power_${i}`]) {
        stars = i;
      }
    }
    return stars;
  };

  const filteredChampions = champions.filter(champion => {
    const matchesSearch = champion.Champion_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "All" || 
                         champion.Region === selectedRegion || 
                         champion.Region_2 === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleChampionClick = (champion: Champion) => {
    navigate(`/champion/${champion.Champion_name}`, { state: { champion } });
  };

  const handleEditCard = (championName: string) => {
    setEditingCard(championName);
  };

  const handleSaveCard = (championName: string) => {
    setEditingCard(null);
  };

  const handleTitleChange = (championName: string, title: string) => {
    setCardTitles(prev => ({ ...prev, [championName]: title }));
  };

  const handleDescriptionChange = (championName: string, description: string) => {
    setCardDescriptions(prev => ({ ...prev, [championName]: description }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-none">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Champion Roster - Alt 1
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Glassmorphism Design with Floating Cards
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search champions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-400"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
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

        {/* Champions Grid - Glassmorphism Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredChampions.map((champion) => (
            <Card 
              key={champion.Champion_name}
              className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 hover:rotate-1 
                bg-gradient-to-br ${regionColors[champion.Region as keyof typeof regionColors]} 
                backdrop-blur-lg border-2 cursor-pointer animate-fade-in`}
              style={{ animationDelay: `${Math.random() * 0.5}s` }}
            >
              {/* Glassmorphism overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              
              <CardHeader className="relative z-10 pb-3">
                <div className="flex items-center justify-between mb-2">
                  {editingCard === champion.Champion_name ? (
                    <Input
                      value={cardTitles[champion.Champion_name] || champion.Champion_name}
                      onChange={(e) => handleTitleChange(champion.Champion_name, e.target.value)}
                      className="bg-white/20 border-white/30 text-white text-lg font-bold"
                    />
                  ) : (
                    <CardTitle className="text-white text-lg">
                      {cardTitles[champion.Champion_name] || champion.Champion_name}
                    </CardTitle>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => editingCard === champion.Champion_name ? 
                      handleSaveCard(champion.Champion_name) : 
                      handleEditCard(champion.Champion_name)
                    }
                    className="text-white/80 hover:text-white hover:bg-white/20"
                  >
                    {editingCard === champion.Champion_name ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge className={`${regionColors[champion.Region as keyof typeof regionColors]} text-white border-white/30`}>
                    {champion.Region}
                  </Badge>
                  {champion.Region_2 && (
                    <Badge className={`${regionColors[champion.Region_2 as keyof typeof regionColors]} text-white border-white/30`}>
                      {champion.Region_2}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                <div className="text-center">
                  <span className="text-white/90 font-medium">Level {champion.Champion_level}</span>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          champion[`Star_power_${star}`] 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Description</label>
                  {editingCard === champion.Champion_name ? (
                    <Textarea
                      value={cardDescriptions[champion.Champion_name] || ""}
                      onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                      placeholder="Add a description..."
                      className="bg-white/20 border-white/30 text-white placeholder-white/50 text-sm resize-none"
                      rows={2}
                    />
                  ) : (
                    <p className="text-white/70 text-sm min-h-[2.5rem] p-2 bg-white/10 rounded border border-white/20">
                      {cardDescriptions[champion.Champion_name] || "No description added"}
                    </p>
                  )}
                </div>

                {/* Container 1 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-blue-600/80 hover:bg-blue-700/80 text-white border-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 1A clicked')}}
                    >
                      Action 1A
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-purple-600/80 hover:bg-purple-700/80 text-white border-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 1B clicked')}}
                    >
                      Action 1B
                    </Button>
                  </div>
                </div>

                {/* Container 2 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-green-600/80 hover:bg-green-700/80 text-white border-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 2A clicked')}}
                    >
                      Action 2A
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-orange-600/80 hover:bg-orange-700/80 text-white border-0"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 2B clicked')}}
                    >
                      Action 2B
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  onClick={() => handleChampionClick(champion)}
                >
                  View Details
                </Button>
              </CardContent>
              
              {!champion.Unlocked && (
                <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded-full">
                  🔒 Locked
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredChampions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No champions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterAlt1;
