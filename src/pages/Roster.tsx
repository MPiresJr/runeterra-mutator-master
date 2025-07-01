
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Champion {
  Champion_name: string;
  Region: string;
  Region_2?: string;
  Champion_level: number;
  Unlocked?: boolean;
  Star_power_1?: boolean;
  Star_power_2?: boolean;
  Star_power_3?: boolean;
  Star_power_4?: boolean;
  Star_power_5?: boolean;
  Star_power_6?: boolean;
  Fragments?: number;
  [key: string]: any;
}

const Roster = () => {
  const navigate = useNavigate();
  const [champions, setChampions] = useState<Champion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);

  const regionColors = {
    "Ionia": "bg-pink-500/20 text-pink-300 border-pink-500/30",
    "Demacia": "bg-white/20 text-gray-200 border-white/30",
    "Freljord": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    "Piltover": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    "Shadow Isles": "bg-green-800/20 text-green-400 border-green-800/30",
    "Targon": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "Runeterra": "bg-gray-500/20 text-gray-300 border-gray-500/30",
    "Noxus": "bg-red-600/20 text-red-300 border-red-600/30",
    "Bilgewater": "bg-orange-600/20 text-orange-300 border-orange-600/30",
    "Shurima": "bg-yellow-600/20 text-yellow-400 border-yellow-600/30",
    "Bandle City": "bg-green-500/20 text-green-300 border-green-500/30"
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

  const handleStarToggle = (star: number) => {
    setSelectedStars(prev => {
      if (prev.includes(star)) {
        return prev.filter(s => s !== star);
      } else {
        return [...prev, star];
      }
    });
  };

  const filteredChampions = champions.filter(champion => {
    const matchesSearch = champion.Champion_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = selectedRegion === "All" || 
                         champion.Region === selectedRegion || 
                         champion.Region_2 === selectedRegion;
    
    const matchesLevel = selectedLevel === 0 || champion.Champion_level >= selectedLevel;
    
    const championStars = getChampionStars(champion);
    const matchesStars = selectedStars.length === 0 || selectedStars.includes(championStars);
    
    return matchesSearch && matchesRegion && matchesLevel && matchesStars;
  });

  const handleChampionClick = (champion: Champion) => {
    navigate(`/champion/${champion.Champion_name}`, { state: { champion } });
  };

  const renderStarMeter = () => {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-sm font-medium mr-2">Stars:</span>
        {[1, 2, 3, 4, 5, 6].map((star) => (
          <Button
            key={star}
            variant={selectedStars.includes(star) ? "default" : "outline"}
            size="sm"
            onClick={() => handleStarToggle(star)}
            className={`w-8 h-8 p-0 ${selectedStars.includes(star) ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
          >
            {star}
          </Button>
        ))}
        {selectedStars.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedStars([])}
            className="ml-2"
          >
            Clear
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Champion Roster
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your champion collection and track your progress
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search champions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Regions</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel.toString()} onValueChange={(value) => setSelectedLevel(parseInt(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Min Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Levels</SelectItem>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <SelectItem key={level} value={level.toString()}>Level {level}+</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="md:col-span-1">
            {renderStarMeter()}
          </div>
        </div>

        {/* Champions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredChampions.map((champion) => (
            <Card 
              key={champion.Champion_name}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                !champion.Unlocked 
                  ? "opacity-50 grayscale bg-gray-800/50" 
                  : regionColors[champion.Region as keyof typeof regionColors] || "bg-gray-500/20"
              }`}
              onClick={() => handleChampionClick(champion)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-center">{champion.Champion_name}</CardTitle>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge className={regionColors[champion.Region as keyof typeof regionColors]}>
                    {champion.Region}
                  </Badge>
                  {champion.Region_2 && (
                    <Badge className={regionColors[champion.Region_2 as keyof typeof regionColors]}>
                      {champion.Region_2}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Level {champion.Champion_level}</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          champion[`Star_power_${star}`] 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {champion.Fragments && (
                  <div className="text-xs text-muted-foreground">
                    Fragments: {champion.Fragments}
                  </div>
                )}
                {!champion.Unlocked && (
                  <div className="text-xs text-red-400 font-medium mt-1">
                    🔒 Locked
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChampions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No champions found matching your criteria.</p>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roster;
