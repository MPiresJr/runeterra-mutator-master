
import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Star, Sparkles, Zap, Crown, Trophy, Edit } from "lucide-react";
import { toast } from "sonner";
import { Champion as ChampionType } from "./Roster";

const Champion = () => {
  const { championName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [champion, setChampion] = useState<ChampionType | null>(location.state?.champion || null);
  const [isEditing, setIsEditing] = useState(false);
  const [layoutStyle, setLayoutStyle] = useState(0);

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

  useEffect(() => {
    if (!champion && championName) {
      const savedData = localStorage.getItem('lorCompanionData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.Roster) {
            const foundChampion = data.Roster.find((c: ChampionType) => c.Champion_name === championName);
            if (foundChampion) {
              setChampion(foundChampion);
            }
          }
        } catch (error) {
          console.error('Error loading champion data:', error);
        }
      }
    }
  }, [championName, champion]);

  const handleSave = () => {
    if (!champion) return;

    const savedData = localStorage.getItem('lorCompanionData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.Roster) {
          const updatedRoster = data.Roster.map((c: ChampionType) => 
            c.Champion_name === champion.Champion_name ? champion : c
          );
          data.Roster = updatedRoster;
          localStorage.setItem('lorCompanionData', JSON.stringify(data));
          toast.success("Champion updated successfully!");
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Error saving champion data:', error);
        toast.error("Failed to save champion data.");
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    if (!champion) return;
    setChampion({ ...champion, [field]: value });
  };

  if (!champion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Champion Not Found</h1>
            <Link to="/roster">
              <Button>Back to Roster</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const checkboxFields = [
    'Unlocked', 'Star_power_1', 'Star_power_2', 'Star_power_3', 
    'Star_power_4', 'Star_power_5', 'Star_power_6'
  ];

  const integerFields = ['Fragments', 'Champion_level'];
  const readOnlyFields = ['Champion_name', 'Region', 'Region_2'];

  // Get unique layout based on champion name
  const getLayoutForChampion = (name: string) => {
    const hash = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return hash % 6; // 6 different layouts
  };

  const currentLayout = getLayoutForChampion(champion.Champion_name);

  // Layout 0: Hexagonal Card Design
  if (currentLayout === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-background to-pink-900/20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Floating Header */}
          <div className="fixed top-4 left-4 z-50">
            <Link to="/roster">
              <Button variant="ghost" size="sm" className="bg-black/50 backdrop-blur-sm border border-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          {/* Hexagonal Champion Portrait */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                <Crown className="w-24 h-24 text-white" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {champion.Champion_name}
              </h1>
              <div className="flex justify-center gap-2 mt-4">
                <Badge className={`${regionColors[champion.Region as keyof typeof regionColors]} text-lg px-4 py-2`}>
                  {champion.Region}
                </Badge>
                {champion.Region_2 && (
                  <Badge className={`${regionColors[champion.Region_2 as keyof typeof regionColors]} text-lg px-4 py-2`}>
                    {champion.Region_2}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Hexagonal Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Power Level Hexagon */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-blue-500/30">
                <CardHeader className="text-center">
                  <Zap className="w-8 h-8 mx-auto text-yellow-400 mb-2" />
                  <CardTitle className="text-blue-300">Power Level</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">{champion.Champion_level}</div>
                    <Progress value={(champion.Champion_level / 40) * 100} className="h-3" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block text-blue-200">Fragments</label>
                    <Input 
                      type="number"
                      value={champion.Fragments || 0}
                      onChange={(e) => handleInputChange('Fragments', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      className="bg-blue-900/30 border-blue-500/50"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Star Powers Constellation */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border-purple-500/30 h-full">
                <CardHeader className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto text-purple-400 mb-2" />
                  <CardTitle className="text-purple-300">Star Constellation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6 place-items-center h-40">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <div key={star} className="flex flex-col items-center">
                        <Checkbox 
                          id={`star-${star}`}
                          checked={champion[`Star_power_${star}`] || false}
                          onCheckedChange={(checked) => handleInputChange(`Star_power_${star}`, checked)}
                          disabled={!isEditing}
                          className="w-6 h-6 mb-2"
                        />
                        <Star className={`w-8 h-8 ${champion[`Star_power_${star}`] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                        <span className="text-xs text-purple-200">{star}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mt-8">
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              size="lg"
              className={`${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"} px-8 py-4 text-lg`}
            >
              {isEditing ? (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Champion
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Layout 1: Dashboard Style with Tabs
  if (currentLayout === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-background to-slate-800">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between mb-8 p-4 bg-slate-800/50 rounded-xl backdrop-blur-sm border border-slate-600/30">
            <div className="flex items-center gap-4">
              <Link to="/roster">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Roster
                </Button>
              </Link>
              <div className="h-8 w-px bg-slate-600"></div>
              <h1 className="text-3xl font-bold text-white">{champion.Champion_name}</h1>
              <div className="flex gap-2">
                <Badge className={regionColors[champion.Region as keyof typeof regionColors]}>
                  {champion.Region}
                </Badge>
                {champion.Region_2 && (
                  <Badge className={regionColors[champion.Region_2 as keyof typeof regionColors]}>
                    {champion.Region_2}
                  </Badge>
                )}
              </div>
            </div>
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
            >
              {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="powers">Star Powers</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/30">
                  <CardHeader className="text-center">
                    <Trophy className="w-12 h-12 mx-auto text-blue-400 mb-2" />
                    <CardTitle className="text-blue-300">Level</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-5xl font-bold text-white mb-4">{champion.Champion_level}</div>
                    <Input 
                      type="number"
                      value={champion.Champion_level}
                      onChange={(e) => handleInputChange('Champion_level', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      className="text-center text-xl"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30">
                  <CardHeader className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto text-purple-400 mb-2" />
                    <CardTitle className="text-purple-300">Fragments</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-5xl font-bold text-white mb-4">{champion.Fragments || 0}</div>
                    <Input 
                      type="number"
                      value={champion.Fragments || 0}
                      onChange={(e) => handleInputChange('Fragments', parseInt(e.target.value) || 0)}
                      disabled={!isEditing}
                      className="text-center text-xl"
                    />
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-500/30">
                  <CardHeader className="text-center">
                    <Crown className="w-12 h-12 mx-auto text-green-400 mb-2" />
                    <CardTitle className="text-green-300">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-white mb-4">
                      {champion.Unlocked ? "Unlocked" : "Locked"}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Checkbox 
                        id="unlocked"
                        checked={champion.Unlocked || false}
                        onCheckedChange={(checked) => handleInputChange('Unlocked', checked)}
                        disabled={!isEditing}
                      />
                      <label htmlFor="unlocked" className="text-green-200">Unlocked</label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="powers">
              <Card className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border-yellow-500/30">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                    <CardTitle className="text-yellow-300 text-2xl">Star Powers</CardTitle>
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((star) => (
                      <div key={star} className="text-center">
                        <div className="mb-4">
                          <Star className={`w-16 h-16 mx-auto ${champion[`Star_power_${star}`] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <Checkbox 
                            id={`star-${star}`}
                            checked={champion[`Star_power_${star}`] || false}
                            onCheckedChange={(checked) => handleInputChange(`Star_power_${star}`, checked)}
                            disabled={!isEditing}
                          />
                          <label htmlFor={`star-${star}`} className="text-yellow-200 font-medium">
                            Star {star}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="additional">
              <Card>
                <CardHeader>
                  <CardTitle>Additional Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(champion)
                      .filter(key => 
                        !readOnlyFields.includes(key) && 
                        !checkboxFields.includes(key) && 
                        !integerFields.includes(key) &&
                        key !== 'Champion_name' &&
                        key !== 'Region' &&
                        key !== 'Region_2'
                      )
                      .map((key) => (
                        <div key={key} className="flex items-center space-x-2 p-3 bg-slate-800/30 rounded-lg">
                          <Checkbox 
                            id={key}
                            checked={champion[key] || false}
                            onCheckedChange={(checked) => handleInputChange(key, checked)}
                            disabled={!isEditing}
                          />
                          <label htmlFor={key} className="text-sm font-medium">
                            {key.replace(/_/g, ' ')}
                          </label>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Layout 2: Minimalist Timeline
  if (currentLayout === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Link to="/roster" className="inline-block mb-12">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          {/* Minimalist Header */}
          <div className="text-center mb-16">
            <div className="w-2 h-24 bg-gradient-to-b from-blue-400 to-purple-600 mx-auto mb-8"></div>
            <h1 className="text-7xl font-thin text-white mb-4 tracking-wide">{champion.Champion_name}</h1>
            <div className="flex justify-center gap-4">
              <span className={`px-6 py-2 rounded-full text-sm ${regionColors[champion.Region as keyof typeof regionColors]}`}>
                {champion.Region}
              </span>
              {champion.Region_2 && (
                <span className={`px-6 py-2 rounded-full text-sm ${regionColors[champion.Region_2 as keyof typeof regionColors]}`}>
                  {champion.Region_2}
                </span>
              )}
            </div>
          </div>

          {/* Timeline Layout */}
          <div className="space-y-12">
            {/* Level Node */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-8"></div>
              <div className="flex-1 flex items-center justify-between bg-gray-800/30 p-6 rounded-r-xl">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Champion Level</h3>
                  <p className="text-gray-400">Current progression level</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-400 mb-2">{champion.Champion_level}</div>
                  <Input 
                    type="number"
                    value={champion.Champion_level}
                    onChange={(e) => handleInputChange('Champion_level', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    className="w-24 text-center bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Fragments Node */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-8"></div>
              <div className="flex-1 flex items-center justify-between bg-gray-800/30 p-6 rounded-r-xl">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Fragments</h3>
                  <p className="text-gray-400">Collected fragments</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-purple-400 mb-2">{champion.Fragments || 0}</div>
                  <Input 
                    type="number"
                    value={champion.Fragments || 0}
                    onChange={(e) => handleInputChange('Fragments', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    className="w-24 text-center bg-gray-700 border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Star Powers Node */}
            <div className="flex items-start">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-8 mt-6"></div>
              <div className="flex-1 bg-gray-800/30 p-6 rounded-r-xl">
                <h3 className="text-xl font-semibold text-white mb-4">Star Powers</h3>
                <div className="grid grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((star) => (
                    <div key={star} className="text-center">
                      <Star className={`w-8 h-8 mx-auto mb-2 ${champion[`Star_power_${star}`] ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      <Checkbox 
                        id={`star-${star}`}
                        checked={champion[`Star_power_${star}`] || false}
                        onCheckedChange={(checked) => handleInputChange(`Star_power_${star}`, checked)}
                        disabled={!isEditing}
                        className="mx-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status Node */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-8"></div>
              <div className="flex-1 flex items-center justify-between bg-gray-800/30 p-6 rounded-r-xl">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Status</h3>
                  <p className="text-gray-400">Champion availability</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="unlocked"
                    checked={champion.Unlocked || false}
                    onCheckedChange={(checked) => handleInputChange('Unlocked', checked)}
                    disabled={!isEditing}
                  />
                  <label htmlFor="unlocked" className="text-green-400 font-medium">
                    {champion.Unlocked ? "Unlocked" : "Locked"}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="text-center mt-16">
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              size="lg"
              className={`${isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"} px-8 py-3`}
            >
              {isEditing ? (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Champion
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default layout for other cases (layouts 3-5)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/roster">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Roster
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {champion.Champion_name}
            </h1>
            <div className="flex gap-2 mt-2">
              <Badge className={regionColors[champion.Region as keyof typeof regionColors]}>
                {champion.Region}
              </Badge>
              {champion.Region_2 && (
                <Badge className={regionColors[champion.Region_2 as keyof typeof regionColors]}>
                  {champion.Region_2}
                </Badge>
              )}
            </div>
          </div>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              "Edit Champion"
            )}
          </Button>
        </div>

        {/* Champion Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Champion Name</label>
                <Input 
                  value={champion.Champion_name} 
                  disabled 
                  className="bg-gray-800/50" 
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Champion Level</label>
                <Input 
                  type="number"
                  value={champion.Champion_level}
                  onChange={(e) => handleInputChange('Champion_level', parseInt(e.target.value) || 0)}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Fragments</label>
                <Input 
                  type="number"
                  value={champion.Fragments || 0}
                  onChange={(e) => handleInputChange('Fragments', parseInt(e.target.value) || 0)}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>

          {/* Star Powers & Status */}
          <Card>
            <CardHeader>
              <CardTitle>Star Powers & Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="unlocked"
                  checked={champion.Unlocked || false}
                  onCheckedChange={(checked) => handleInputChange('Unlocked', checked)}
                  disabled={!isEditing}
                />
                <label htmlFor="unlocked" className="text-sm font-medium">
                  Unlocked
                </label>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium block">Star Powers</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((star) => (
                    <div key={star} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`star-${star}`}
                        checked={champion[`Star_power_${star}`] || false}
                        onCheckedChange={(checked) => handleInputChange(`Star_power_${star}`, checked)}
                        disabled={!isEditing}
                      />
                      <label htmlFor={`star-${star}`} className="text-sm flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {star}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Fields */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Additional Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.keys(champion)
                  .filter(key => 
                    !readOnlyFields.includes(key) && 
                    !checkboxFields.includes(key) && 
                    !integerFields.includes(key) &&
                    key !== 'Champion_name' &&
                    key !== 'Region' &&
                    key !== 'Region_2'
                  )
                  .map((key) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox 
                        id={key}
                        checked={champion[key] || false}
                        onCheckedChange={(checked) => handleInputChange(key, checked)}
                        disabled={!isEditing}
                      />
                      <label htmlFor={key} className="text-sm font-medium">
                        {key.replace(/_/g, ' ')}
                      </label>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Champion;
