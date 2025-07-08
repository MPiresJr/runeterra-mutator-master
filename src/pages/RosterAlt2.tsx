
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
    "Ionia": "bg-gradient-to-br from-gray-700 to-gray-800",
    "Demacia": "bg-gradient-to-br from-slate-600 to-slate-700",
    "Freljord": "bg-gradient-to-br from-blue-900 to-slate-800",
    "Piltover": "bg-gradient-to-br from-amber-900 to-yellow-900",
    "Shadow Isles": "bg-gradient-to-br from-emerald-900 to-green-900",
    "Targon": "bg-gradient-to-br from-purple-900 to-indigo-900",
    "Runeterra": "bg-gradient-to-br from-gray-800 to-gray-900",
    "Noxus": "bg-gradient-to-br from-red-900 to-red-800",
    "Bilgewater": "bg-gradient-to-br from-orange-900 to-red-900",
    "Shurima": "bg-gradient-to-br from-yellow-900 to-amber-900",
    "Bandle City": "bg-gradient-to-br from-green-800 to-green-900"
  };

  const regions = Object.keys(regionColors);

  // Champion background images (using placeholder images with dark/neutral tones)
  const getChampionBackgroundImage = (championName: string) => {
    const images = [
      'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=800&h=400&fit=crop', // grayscale building
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop', // foggy mountain
      'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=800&h=400&fit=crop', // desert sand
      'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=800&h=400&fit=crop', // brown deer landscape
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=400&fit=crop', // dark portrait
    ];
    // Use champion name to consistently assign same image
    const hash = championName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return images[hash % images.length];
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-none">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
              Champion Roster - Alt 2
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              Dark & Elegant Gaming Cards
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
              className="pl-10 bg-gray-800/70 backdrop-blur-sm border-gray-600/50 text-white placeholder-gray-400 focus:border-gray-400"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-gray-800/70 backdrop-blur-sm border-gray-600/50 text-white focus:border-gray-400">
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

        {/* Champions Grid - Dark Gaming Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChampions.map((champion, index) => (
            <Card 
              key={champion.Champion_name}
              className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 
                bg-gray-900/90 backdrop-blur-lg border-2 border-gray-700/50 hover:border-gray-500 
                hover:shadow-2xl hover:shadow-gray-700/25 cursor-pointer animate-fade-in`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                boxShadow: '0 0 20px rgba(75, 85, 99, 0.3)'
              }}
            >
              {/* Subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 via-slate-700/10 to-gray-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Subtle border animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600 via-slate-500 to-gray-600 opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
              
              <CardHeader 
                className="relative z-10 pb-3 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('${getChampionBackgroundImage(champion.Champion_name)}')`
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  {editingCard === champion.Champion_name ? (
                    <Input
                      value={cardTitles[champion.Champion_name] || champion.Champion_name}
                      onChange={(e) => handleTitleChange(champion.Champion_name, e.target.value)}
                      className="bg-gray-800/70 border-gray-500/50 text-gray-100 text-lg font-bold"
                    />
                  ) : (
                    <CardTitle className="text-gray-100 text-lg font-bold drop-shadow-lg">
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
                    className="text-gray-300 hover:text-gray-100 hover:bg-gray-600/30 border border-gray-500/50"
                  >
                    {editingCard === champion.Champion_name ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-gray-700/70 text-gray-200 border-gray-600/50 shadow-lg">
                    {champion.Region}
                  </Badge>
                  {champion.Region_2 && (
                    <Badge className="bg-slate-700/70 text-slate-200 border-slate-600/50 shadow-lg">
                      {champion.Region_2}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4 bg-gray-900/60">
                <div className="text-center bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-gray-200 font-bold">Level {champion.Champion_level}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 transition-all duration-200 ${
                          champion[`Star_power_${star}`] 
                            ? "fill-amber-400 text-amber-400 drop-shadow-lg" 
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Description
                  </label>
                  {editingCard === champion.Champion_name ? (
                    <Textarea
                      value={cardDescriptions[champion.Champion_name] || ""}
                      onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                      placeholder="Add a description..."
                      className="bg-gray-800/70 border-gray-600/50 text-gray-200 placeholder-gray-400 text-sm resize-none"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-300 text-sm min-h-[2.5rem] p-2 bg-gray-800/40 rounded border border-gray-600/30">
                      {cardDescriptions[champion.Champion_name] || "No description added"}
                    </p>
                  )}
                </div>

                {/* Container 1 */}
                <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-600/30">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-slate-700 to-gray-700 hover:from-slate-600 hover:to-gray-600 text-white border-0 shadow-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 1A clicked')}}
                    >
                      Combat
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-600 hover:to-slate-600 text-white border-0 shadow-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 1B clicked')}}
                    >
                      Skills
                    </Button>
                  </div>
                </div>

                {/* Container 2 */}
                <div className="bg-gray-800/40 rounded-lg p-3 border border-gray-600/30">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-emerald-800 to-green-800 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 2A clicked')}}
                    >
                      Upgrade
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-amber-800 to-orange-800 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 2B clicked')}}
                    >
                      Equip
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-slate-700 to-gray-700 hover:from-slate-600 hover:to-gray-600 text-white border-0 shadow-lg"
                  onClick={() => handleChampionClick(champion)}
                >
                  Enter Battle
                </Button>
              </CardContent>
              
              {!champion.Unlocked && (
                <div className="absolute top-2 right-2 bg-red-800 text-white text-xs px-2 py-1 rounded-full border border-red-700 shadow-lg">
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

export default RosterAlt2;
