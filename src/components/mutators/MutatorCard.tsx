
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Zap, Tag } from "lucide-react";
import { ChampionPill } from "./ChampionPill";
import { Mutator } from "@/hooks/useMutators";

interface MutatorCardProps {
  mutator: Mutator;
  onEdit: (mutator: Mutator) => void;
  onDelete: (id: string) => void;
}

const rarityColors = {
  Common: {
    title: "text-green-400",
    badge: "bg-green-500/20 text-green-300 border-green-500/30",
    border: "border-green-500/30"
  },
  Rare: {
    title: "text-blue-400", 
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    border: "border-blue-500/30"
  },
  Epic: {
    title: "text-purple-400",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30", 
    border: "border-purple-500/30"
  },
  Legendary: {
    title: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    border: "border-orange-500/30" 
  }
};

const parseChampions = (championsString: string) => {
  if (!championsString) return [];
  return championsString.split(/[,;]/).map(champion => champion.trim()).filter(Boolean);
};

export const MutatorCard = ({ mutator, onEdit, onDelete }: MutatorCardProps) => {
  return (
    <Card 
      className={`hover:bg-card/80 transition-all duration-200 hover:scale-[1.02] ${rarityColors[mutator.rarity].border} relative overflow-hidden`}
    >
      {/* Rarity indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${rarityColors[mutator.rarity].badge}`} />
      
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className={`w-4 h-4 ${rarityColors[mutator.rarity].title}`} />
              <CardTitle className={`text-lg ${rarityColors[mutator.rarity].title}`}>
                {mutator.name}
              </CardTitle>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge className={rarityColors[mutator.rarity].badge}>
                {mutator.rarity}
              </Badge>
              {mutator.tag && (
                <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                  <Tag className="w-3 h-3 mr-1" />
                  {mutator.tag}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(mutator)}
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 h-8 w-8 p-0"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(mutator.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-8 w-8 p-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-xs leading-relaxed mt-2 p-2 bg-muted/30 rounded-lg">
          {mutator.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-0">
        <div className="bg-green-500/5 p-3 rounded-lg border border-green-500/20">
          <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            Good Champions
          </h4>
          <div className="flex flex-wrap gap-1">
            {parseChampions(mutator.goodChampions).map((champion, index) => (
              <ChampionPill key={index} championName={champion} type="good" />
            ))}
          </div>
        </div>
        
        <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/20">
          <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            Avoid Champions
          </h4>
          <div className="flex flex-wrap gap-1">
            {parseChampions(mutator.badChampions).map((champion, index) => (
              <ChampionPill key={index} championName={champion} type="bad" />
            ))}
          </div>
        </div>
        
        <div className="bg-purple-500/5 p-3 rounded-lg border border-purple-500/20">
          <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
            Strategy
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{mutator.strategy}</p>
        </div>
      </CardContent>
    </Card>
  );
};
