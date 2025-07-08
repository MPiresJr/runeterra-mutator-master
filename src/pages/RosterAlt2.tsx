
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Star, Edit2, Save, Zap, Shield } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Champion } from "./Roster";

const RosterAlt2 = () => {
  const navigate = useNavigate();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [cardTitles, setCardTitles] = useState<{[key: string]: string}>({});
  const [cardDescriptions, setCardDescriptions] = useState<{[key: string]: string}>({});

  const regionColors = {
    "Ionia": "bg-gradient-to-br from-pink-500 to-rose-600",
    "Demacia": "bg-gradient-to-br from-blue-400 to-blue-600",
    "Freljord": "bg-gradient-to-br from-cyan-400 to-blue-500",
    "Piltover": "bg-gradient-to-br from-yellow-400 to-orange-500",
    "Shadow Isles": "bg-gradient-to-br from-green-600 to-emerald-700",
    "Targon": "bg-gradient-to-br from-purple-500 to-violet-600",
    "Runeterra": "bg-gradient-to-br from-gray-400 to-gray-600",
    "Noxus": "bg-gradient-to-br from-red-500 to-red-700",
    "Bilgewater": "bg-gradient-to-br from-orange-500 to-red-600",
    "Shurima": "bg-gradient-to-br from-yellow-500 to-amber-600",
    "Bandle City": "bg-gradient-to-br from-green-400 to-green-600"
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-none">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
              Champion Roster - Alt 2
            </h1>
            <p className="text-white/80 mt-2 text-lg">
              Neon Gaming Cards with Holographic Effects
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
            <Input
              placeholder="Search champions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/50 backdrop-blur-sm border-purple-500/50 text-white placeholder-purple-300/70 focus:border-cyan-400"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-black/50 backdrop-blur-sm border-purple-500/50 text-white focus:border-cyan-400">
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

        {/* Champions Grid - Neon Gaming Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChampions.map((champion, index) => (
            <Card 
              key={champion.Champion_name}
              className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 
                bg-black/80 backdrop-blur-lg border-2 border-cyan-400/50 hover:border-cyan-300 
                hover:shadow-2xl hover:shadow-cyan-400/25 cursor-pointer animate-fade-in`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
              }}
            >
              {/* Holographic overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Neon border animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300"></div>
              
              <CardHeader className="relative z-10 pb-3 bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
                <div className="flex items-center justify-between mb-2">
                  {editingCard === champion.Champion_name ? (
                    <Input
                      value={cardTitles[champion.Champion_name] || champion.Champion_name}
                      onChange={(e) => handleTitleChange(champion.Champion_name, e.target.value)}
                      className="bg-black/50 border-cyan-400/50 text-cyan-100 text-lg font-bold"
                    />
                  ) : (
                    <CardTitle className="text-cyan-100 text-lg font-bold drop-shadow-lg">
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
                    className="text-cyan-300 hover:text-cyan-100 hover:bg-cyan-400/20 border border-cyan-400/50"
                  >
                    {editingCard === champion.Champion_name ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-cyan-400/20 text-cyan-100 border-cyan-400/50 shadow-lg">
                    {champion.Region}
                  </Badge>
                  {champion.Region_2 && (
                    <Badge className="bg-purple-400/20 text-purple-100 border-purple-400/50 shadow-lg">
                      {champion.Region_2}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 bg-black/40">
                <div className="text-center bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-cyan-100 font-bold">Level {champion.Champion_level}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 transition-all duration-200 ${
                          champion[`Star_power_${star}`] 
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-lg" 
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                  <label className="text-cyan-200 text-sm font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Description
                  </label>
                  {editingCard === champion.Champion_name ? (
                    <Textarea
                      value={cardDescriptions[champion.Champion_name] || ""}
                      onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                      placeholder="Add a description..."
                      className="bg-black/50 border-cyan-400/50 text-cyan-100 placeholder-cyan-300/50 text-sm resize-none"
                      rows={2}
                    />
                  ) : (
                    <p className="text-cyan-200/80 text-sm min-h-[2.5rem] p-2 bg-black/30 rounded border border-cyan-400/30">
                      {cardDescriptions[champion.Champion_name] || "No description added"}
                    </p>
                  )}
                </div>

                {/* Container 1 */}
                <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-3 border border-cyan-400/30">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 1A clicked')}}
                    >
                      Combat
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 shadow-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 1B clicked')}}
                    >
                      Skills
                    </Button>
                  </div>
                </div>

                {/* Container 2 */}
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3 border border-purple-400/30">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white border-0 shadow-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 2A clicked')}}
                    >
                      Upgrade
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white border-0 shadow-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 2B clicked')}}
                    >
                      Equip
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg"
                  onClick={() => handleChampionClick(champion)}
                >
                  Enter Battle
                </Button>
              </CardContent>
              
              {!champion.Unlocked && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full border border-red-400 shadow-lg">
                  🔒 Locked
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredChampions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/80 text-lg">No champions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterAlt2;
