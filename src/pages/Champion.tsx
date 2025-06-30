
import { useState, useEffect } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Star } from "lucide-react";
import { toast } from "sonner";
import { Champion as ChampionType } from "./Roster";

const Champion = () => {
  const { championName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [champion, setChampion] = useState<ChampionType | null>(location.state?.champion || null);
  const [isEditing, setIsEditing] = useState(false);

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
