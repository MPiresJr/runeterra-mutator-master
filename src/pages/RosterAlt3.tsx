
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Star, Edit2, Save, Crown, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Champion } from "./Roster";

const RosterAlt3 = () => {
  const navigate = useNavigate();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [cardTitles, setCardTitles] = useState<{[key: string]: string}>({});
  const [cardDescriptions, setCardDescriptions] = useState<{[key: string]: string}>({});

  const regionColors = {
    "Ionia": "border-pink-300 shadow-pink-200/20",
    "Demacia": "border-blue-300 shadow-blue-200/20",
    "Freljord": "border-cyan-300 shadow-cyan-200/20",
    "Piltover": "border-yellow-300 shadow-yellow-200/20",
    "Shadow Isles": "border-green-300 shadow-green-200/20",
    "Targon": "border-purple-300 shadow-purple-200/20",
    "Runeterra": "border-gray-300 shadow-gray-200/20",
    "Noxus": "border-red-300 shadow-red-200/20",
    "Bilgewater": "border-orange-300 shadow-orange-200/20",
    "Shurima": "border-amber-300 shadow-amber-200/20",
    "Bandle City": "border-emerald-300 shadow-emerald-200/20"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20 max-w-none">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Champion Roster - Alt 3
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Elegant Light Theme with Soft Shadows
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
              className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm focus:border-orange-400 focus:ring-orange-400"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-sm focus:border-orange-400">
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

        {/* Champions Grid - Elegant Light Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChampions.map((champion, index) => (
            <Card 
              key={champion.Champion_name}
              className={`group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-2
                bg-white/90 backdrop-blur-sm border-2 ${regionColors[champion.Region as keyof typeof regionColors]} 
                hover:shadow-2xl cursor-pointer animate-fade-in rounded-2xl`}
              style={{ 
                animationDelay: `${index * 0.05}s`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-200 to-transparent rounded-bl-full opacity-50"></div>
              
              <CardHeader className="relative z-10 pb-3">
                <div className="flex items-center justify-between mb-3">
                  {editingCard === champion.Champion_name ? (
                    <Input
                      value={cardTitles[champion.Champion_name] || champion.Champion_name}
                      onChange={(e) => handleTitleChange(champion.Champion_name, e.target.value)}
                      className="bg-white border-orange-300 text-gray-800 text-lg font-bold focus:border-orange-400"
                    />
                  ) : (
                    <CardTitle className="text-gray-800 text-lg font-bold">
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
                    className="text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded-full"
                  >
                    {editingCard === champion.Champion_name ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 border-orange-200 shadow-sm">
                    {champion.Region}
                  </Badge>
                  {champion.Region_2 && (
                    <Badge className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-800 border-pink-200 shadow-sm">
                      {champion.Region_2}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-4">
                <div className="text-center bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Crown className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-800 font-bold text-lg">Level {champion.Champion_level}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 transition-all duration-200 ${
                          champion[`Star_power_${star}`] 
                            ? "fill-amber-400 text-amber-500 drop-shadow-sm" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" />
                    Description
                  </label>
                  {editingCard === champion.Champion_name ? (
                    <Textarea
                      value={cardDescriptions[champion.Champion_name] || ""}
                      onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                      placeholder="Add a description..."
                      className="bg-white border-orange-200 text-gray-800 placeholder-gray-400 text-sm resize-none focus:border-orange-400"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-600 text-sm min-h-[2.5rem] p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                      {cardDescriptions[champion.Champion_name] || "No description added"}
                    </p>
                  )}
                </div>

                {/* Container 1 */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 border border-orange-100 shadow-sm">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white border-0 shadow-md rounded-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 1A clicked')}}
                    >
                      Enhance
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white border-0 shadow-md rounded-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 1B clicked')}}
                    >
                      Train
                    </Button>
                  </div>
                </div>

                {/* Container 2 */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-100 shadow-sm">
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500 text-white border-0 shadow-md rounded-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 2A clicked')}}
                    >
                      Deploy
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white border-0 shadow-md rounded-lg"
                      onClick={(e) => {e.stopPropagation(); console.log('Button 2B clicked')}}
                    >
                      Collect
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg rounded-xl"
                  onClick={() => handleChampionClick(champion)}
                >
                  View Champion
                </Button>
              </CardContent>
              
              {!champion.Unlocked && (
                <div className="absolute top-4 right-4 bg-red-400 text-white text-xs px-2 py-1 rounded-full shadow-lg border border-red-300">
                  🔒 Locked
                </div>
              )}
            </Card>
          ))}
        </div>

        {filteredChampions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No champions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RosterAlt3;
