
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Search, Star, Edit2, Save, Zap, Shield, Sword, Target, TrendingUp, Wrench } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GlobalHeader } from "@/components/GlobalHeader";
import { Champion } from "./Roster";

const RosterAlt6 = () => {
  const navigate = useNavigate();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [cardTitles, setCardTitles] = useState<{[key: string]: string}>({});
  const [cardDescriptions, setCardDescriptions] = useState<{[key: string]: string}>({});

  const regions = ["Ionia", "Demacia", "Freljord", "Piltover", "Shadow Isles", "Targon", "Runeterra", "Noxus", "Bilgewater", "Shurima", "Bandle City"];

  const getChampionBackgroundImage = (championName: string) => {
    const images = [
      'https://images.unsplash.com/photo-1527576539890-dfa815648363?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&h=400&fit=crop',
    ];
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
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
              Champion Roster - Alt 6
            </h1>
            <p className="text-gray-300 mt-2 text-lg">
              Left Sidebar Level & Stats
            </p>
          </div>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChampions.map((champion, index) => (
            <Card 
              key={champion.Champion_name}
              className="group relative overflow-hidden transition-all duration-300 hover:scale-105 
                bg-gray-900/90 backdrop-blur-lg border-2 border-gray-700/50 hover:border-gray-500 
                hover:shadow-2xl hover:shadow-gray-700/25 cursor-pointer animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                boxShadow: '0 0 20px rgba(75, 85, 99, 0.3)'
              }}
            >
              <div className="flex">
                {/* Left Sidebar */}
                <div className="w-20 bg-gray-800/60 p-2 flex flex-col items-center justify-center space-y-2 border-r border-gray-600/50">
                  <div className="bg-gradient-to-b from-amber-600 to-orange-600 text-white px-2 py-1 rounded-full font-bold text-xs">
                    {champion.Champion_level}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <Star
                        key={star}
                        className={`w-2 h-2 transition-all duration-200 ${
                          champion[`Star_power_${star}`] 
                            ? "fill-amber-400 text-amber-400" 
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
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
                          className="bg-gray-800/70 border-gray-500/50 text-gray-100 text-sm font-bold"
                        />
                      ) : (
                        <CardTitle className="text-gray-100 text-sm font-bold drop-shadow-lg">
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
                        className="text-gray-300 hover:text-gray-100 hover:bg-gray-600/30 border border-gray-500/50 h-6 w-6 p-0"
                      >
                        {editingCard === champion.Champion_name ? <Save className="w-3 h-3" /> : <Edit2 className="w-3 h-3" />}
                      </Button>
                    </div>
                    
                    <div className="flex gap-1 flex-wrap">
                      <Badge className="bg-gray-700/70 text-gray-200 border-gray-600/50 shadow-lg text-xs px-1 py-0">
                        {champion.Region}
                      </Badge>
                      {champion.Region_2 && (
                        <Badge className="bg-slate-700/70 text-slate-200 border-slate-600/50 shadow-lg text-xs px-1 py-0">
                          {champion.Region_2}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="relative z-10 space-y-3 bg-gray-900/60 p-3">
                    {/* Compact Description */}
                    {editingCard === champion.Champion_name ? (
                      <Textarea
                        value={cardDescriptions[champion.Champion_name] || ""}
                        onChange={(e) => handleDescriptionChange(champion.Champion_name, e.target.value)}
                        placeholder="Add a description..."
                        className="bg-gray-800/70 border-gray-600/50 text-gray-200 placeholder-gray-400 text-xs resize-none"
                        rows={1}
                      />
                    ) : (
                      <p className="text-gray-300 text-xs bg-gray-800/40 rounded p-1 border border-gray-600/30 min-h-[1.5rem]">
                        {cardDescriptions[champion.Champion_name] || "No description"}
                      </p>
                    )}

                    {/* Circular Buttons in Grid */}
                    <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-600/30">
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          className="w-[75px] h-[75px] rounded-full bg-gradient-to-r from-slate-700 to-gray-700 hover:from-slate-600 hover:to-gray-600 text-white border-0 shadow-lg flex flex-col items-center justify-center p-0 mx-auto"
                          onClick={(e) => {e.stopPropagation(); console.log('Combat clicked')}}
                        >
                          <Sword className="w-4 h-4 mb-1" />
                          <span className="text-xs">Combat</span>
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-[75px] h-[75px] rounded-full bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-600 hover:to-slate-600 text-white border-0 shadow-lg flex flex-col items-center justify-center p-0 mx-auto"
                          onClick={(e) => {e.stopPropagation(); console.log('Skills clicked')}}
                        >
                          <Target className="w-4 h-4 mb-1" />
                          <span className="text-xs">Skills</span>
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-[75px] h-[75px] rounded-full bg-gradient-to-r from-emerald-800 to-green-800 hover:from-emerald-700 hover:to-green-700 text-white border-0 shadow-lg flex flex-col items-center justify-center p-0 mx-auto"
                          onClick={(e) => {e.stopPropagation(); console.log('Upgrade clicked')}}
                        >
                          <TrendingUp className="w-4 h-4 mb-1" />
                          <span className="text-xs">Upgrade</span>
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-[75px] h-[75px] rounded-full bg-gradient-to-r from-amber-800 to-orange-800 hover:from-amber-700 hover:to-orange-700 text-white border-0 shadow-lg flex flex-col items-center justify-center p-0 mx-auto"
                          onClick={(e) => {e.stopPropagation(); console.log('Equip clicked')}}
                        >
                          <Wrench className="w-4 h-4 mb-1" />
                          <span className="text-xs">Equip</span>
                        </Button>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-slate-700 to-gray-700 hover:from-slate-600 hover:to-gray-600 text-white border-0 shadow-lg text-xs h-8"
                      onClick={() => handleChampionClick(champion)}
                    >
                      Enter Battle
                    </Button>
                  </CardContent>
                </div>
              </div>
              
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

export default RosterAlt6;
