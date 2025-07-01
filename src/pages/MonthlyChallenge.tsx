import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, Trophy, Target, Star, Edit, Plus, Search } from "lucide-react";
import { ChampionPill } from "@/components/mutators/ChampionPill";
import { toast } from "sonner";
import { Champion } from "./Roster";
import { GlobalHeader } from "@/components/GlobalHeader";

interface MonthlyStage {
  Level: number;
  Stars: number;
  Boss?: string;
  Miniboss?: string;
  Mutator_1?: string;
  Mutator_2?: string;
  Mutator_3?: string;
  Mutator_4?: string;
}

interface ChampionCommit {
  stage: number;
  championName: string;
  victories: number;
  defeats: number;
  isCommitted: boolean;
}

const MonthlyChallenge = () => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [stageData, setStageData] = useState<MonthlyStage | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyStage[]>([]);
  const [championsData, setChampionsData] = useState<any[]>([]);
  const [mutatorsData, setMutatorsData] = useState<any[]>([]);
  const [commits, setCommits] = useState<ChampionCommit[]>([]);
  
  // Right side states
  const [champions, setChampions] = useState<Champion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<number>(0);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(null);

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
        if (data.Monthly) setMonthlyData(data.Monthly);
        if (data.Champions) setChampionsData(data.Champions);
        if (data.Mutators) setMutatorsData(data.Mutators);
        if (data.Roster) setChampions(data.Roster);
      } catch (error) {
        console.error('Error loading monthly challenge data:', error);
      }
    }

    // Load commits from localStorage
    const savedCommits = localStorage.getItem('monthlyCommits');
    if (savedCommits) {
      try {
        setCommits(JSON.parse(savedCommits));
      } catch (error) {
        console.error('Error loading commits:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('monthlyCommits', JSON.stringify(commits));
  }, [commits]);

  useEffect(() => {
    if (monthlyData.length > 0) {
      const stage = monthlyData.find(s => s.Level === selectedStage);
      setStageData(stage || null);
    }
  }, [selectedStage, monthlyData]);

  const getChampionStars = (champion: Champion): number => {
    let stars = 0;
    for (let i = 1; i <= 6; i++) {
      if (champion[`Star_power_${i}`]) {
        stars = i;
      }
    }
    return stars;
  };

  const getCommittedChampion = (stage: number): ChampionCommit | null => {
    return commits.find(c => c.stage === stage && c.isCommitted) || null;
  };

  const getChampionUsageCount = (championName: string): number => {
    return commits.filter(c => c.championName === championName && (c.victories > 0 || c.defeats > 0)).length;
  };

  const isChampionAvailable = (champion: Champion): boolean => {
    const usageCount = getChampionUsageCount(champion.Champion_name);
    return usageCount < 3;
  };

  const filteredChampions = champions.filter(champion => {
    if (!isChampionAvailable(champion)) return false;
    
    const matchesSearch = champion.Champion_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "All" || 
                         champion.Region === selectedRegion || 
                         champion.Region_2 === selectedRegion;
    const matchesLevel = selectedLevel === 0 || champion.Champion_level >= selectedLevel;
    const championStars = getChampionStars(champion);
    const matchesStars = selectedStars.length === 0 || selectedStars.includes(championStars);
    
    return matchesSearch && matchesRegion && matchesLevel && matchesStars;
  });

  const handleStageChange = (value: string) => {
    setSelectedStage(parseInt(value));
    setSelectedChampion(null);
  };

  const handleCommitChampion = () => {
    if (!selectedChampion) return;
    
    const existingCommit = getCommittedChampion(selectedStage);
    if (existingCommit) {
      toast.error("A champion is already committed to this stage!");
      return;
    }

    const newCommit: ChampionCommit = {
      stage: selectedStage,
      championName: selectedChampion.Champion_name,
      victories: 0,
      defeats: 0,
      isCommitted: true
    };

    setCommits(prev => [...prev, newCommit]);
    toast.success(`${selectedChampion.Champion_name} committed to Stage ${selectedStage}!`);
  };

  const handleVictory = () => {
    const commit = getCommittedChampion(selectedStage);
    if (!commit) return;

    setCommits(prev => prev.map(c => 
      c.stage === selectedStage && c.championName === commit.championName
        ? { ...c, victories: c.victories + 1 }
        : c
    ));
    toast.success("Victory recorded!");
  };

  const handleDefeat = () => {
    const commit = getCommittedChampion(selectedStage);
    if (!commit) return;

    setCommits(prev => prev.map(c => 
      c.stage === selectedStage && c.championName === commit.championName
        ? { ...c, defeats: c.defeats + 1, isCommitted: false }
        : c
    ));
    toast.success("Defeat recorded. Champion removed from stage.");
  };

  const handleClear = () => {
    const commit = getCommittedChampion(selectedStage);
    if (!commit) return;

    // Only remove the committed state, keep the usage count
    setCommits(prev => prev.map(c => 
      c.stage === selectedStage && c.championName === commit.championName
        ? { ...c, isCommitted: false }
        : c
    ));
    toast.success("Champion cleared from stage.");
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

  const findMutatorInfo = (mutatorName: string) => {
    return mutatorsData.find(m => m.Mutator_name === mutatorName);
  };

  const findChampionInfo = (championName: string) => {
    return championsData.find(c => c.Champion_name === championName);
  };

  const renderMutatorCard = (mutatorName: string, isMiniboss = false) => {
    const mutatorInfo = findMutatorInfo(mutatorName);
    const championInfo = findChampionInfo(mutatorName);
    
    if (!mutatorInfo && !championInfo) {
      return (
        <Card key={mutatorName} className="border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-yellow-400">{mutatorName}</CardTitle>
            <CardDescription>No information found</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create New {isMiniboss ? "Champion" : "Mutator"}
            </Button>
          </CardContent>
        </Card>
      );
    }

    const info = mutatorInfo || championInfo;
    
    return (
      <Card key={mutatorName} className="border-purple-500/30">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg text-purple-400">{mutatorName}</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
              <Edit className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>{info.Mutator || info.description || "No description available"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {info.Good_champions && (
            <div className="bg-green-500/5 p-3 rounded-lg border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-2 text-sm">Good Champions</h4>
              <div className="flex flex-wrap gap-1">
                {info.Good_champions.split(/[,;]/).map((champion: string, index: number) => (
                  <ChampionPill key={index} championName={champion.trim()} type="good" />
                ))}
              </div>
            </div>
          )}
          
          {info.Bad_champions && (
            <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/20">
              <h4 className="font-semibold text-red-400 mb-2 text-sm">Avoid Champions</h4>
              <div className="flex flex-wrap gap-1">
                {info.Bad_champions.split(/[,;]/).map((champion: string, index: number) => (
                  <ChampionPill key={index} championName={champion.trim()} type="bad" />
                ))}
              </div>
            </div>
          )}
          
          {info.Strategy && (
            <div className="bg-purple-500/5 p-3 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-2 text-sm">Strategy</h4>
              <p className="text-xs text-muted-foreground">{info.Strategy}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const committedChampion = getCommittedChampion(selectedStage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-950/20">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Monthly Challenge
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your progress and optimize your monthly challenge strategies
            </p>
          </div>
        </div>

        {/* Two Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Stage Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stage Selection</CardTitle>
                <CardDescription>Select a stage from 1 to 70</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedStage.toString()} onValueChange={handleStageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 70 }, (_, i) => i + 1).map((stage) => (
                      <SelectItem key={stage} value={stage.toString()}>
                        Stage {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {stageData && (
              <div className="space-y-4">
                {/* Boss and Miniboss side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stageData.Boss && renderMutatorCard(stageData.Boss, false)}
                  {stageData.Miniboss && renderMutatorCard(stageData.Miniboss, true)}
                </div>

                {/* Mutators in up to 4 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[stageData.Mutator_1, stageData.Mutator_2, stageData.Mutator_3, stageData.Mutator_4]
                    .filter(Boolean)
                    .map((mutator, index) => renderMutatorCard(mutator!, false))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Champion Selection and Commitment */}
          <div className="space-y-6">
            {/* Champion Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Champion Selection</CardTitle>
                <CardDescription>Choose a champion for Stage {selectedStage}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters side by side */}
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-xs font-medium mr-1">Stars:</span>
                    {[0, 1, 2, 3, 4, 5, 6].map((star) => (
                      <Button
                        key={star}
                        variant={selectedStars.includes(star) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStarToggle(star)}
                        className={`w-6 h-6 p-0 text-xs ${selectedStars.includes(star) ? "bg-yellow-600 hover:bg-yellow-700" : ""}`}
                      >
                        {star === 0 ? (
                          <Star className="w-3 h-3 text-gray-600" />
                        ) : (
                          star
                        )}
                      </Button>
                    ))}
                    {selectedStars.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStars([])}
                        className="ml-1 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>

                {/* Champion List */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredChampions.map((champion) => (
                    <Card 
                      key={champion.Champion_name}
                      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                        selectedChampion?.Champion_name === champion.Champion_name 
                          ? "ring-2 ring-blue-500" 
                          : ""
                      } ${
                        !champion.Unlocked 
                          ? "opacity-50 grayscale" 
                          : regionColors[champion.Region as keyof typeof regionColors] || "bg-gray-500/20"
                      }`}
                      onClick={() => setSelectedChampion(champion)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">{champion.Champion_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Level {champion.Champion_level} • Used {getChampionUsageCount(champion.Champion_name)}/3
                            </p>
                          </div>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {selectedChampion && !committedChampion && (
                  <Button onClick={handleCommitChampion} className="w-full bg-green-600 hover:bg-green-700">
                    Commit {selectedChampion.Champion_name} to Stage {selectedStage}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Committed Champion Actions */}
            {committedChampion && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Committed Champion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <h3 className="font-semibold text-lg">{committedChampion.championName}</h3>
                    <p className="text-sm text-muted-foreground">
                      Victories: {committedChampion.victories} | Defeats: {committedChampion.defeats}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleVictory} className="flex-1 bg-green-600 hover:bg-green-700">
                      Victory
                    </Button>
                    <Button onClick={handleDefeat} className="flex-1 bg-red-600 hover:bg-red-700">
                      Defeat
                    </Button>
                    <Button onClick={handleClear} variant="outline" className="flex-1">
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyChallenge;
