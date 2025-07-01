
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Mutator } from "@/hooks/useMutators";
import { ChampionPill } from "./ChampionPill";

interface MutatorCardProps {
  mutator: Mutator;
  onEdit: (mutator: Mutator) => void;
  onDelete: (id: string) => void;
}

const rarityColors = {
  Common: "border-green-500/50 bg-green-500/5",
  Rare: "border-blue-500/50 bg-blue-500/5", 
  Epic: "border-purple-500/50 bg-purple-500/5",
  Legendary: "border-yellow-500/50 bg-yellow-500/5"
};

const rarityTextColors = {
  Common: "text-green-400",
  Rare: "text-blue-400",
  Epic: "text-purple-400", 
  Legendary: "text-yellow-400"
};

export function MutatorCard({ mutator, onEdit, onDelete }: MutatorCardProps) {
  return (
    <Card className={`transition-all duration-200 hover:scale-105 ${rarityColors[mutator.rarity]}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className={`text-lg ${rarityTextColors[mutator.rarity]}`}>
              {mutator.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={rarityColors[mutator.rarity]}>
                {mutator.rarity}
              </Badge>
              {mutator.tag && (
                <Badge variant="outline" className="text-xs">
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
              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(mutator.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground">
          {mutator.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {mutator.goodChampions && (
          <div className="bg-green-500/5 p-3 rounded-lg border border-green-500/20">
            <h4 className="font-semibold text-green-400 mb-2 text-sm">Good Champions</h4>
            <div className="flex flex-wrap gap-1">
              {mutator.goodChampions.split(/[,;]/).map((champion, index) => (
                <ChampionPill key={index} championName={champion.trim()} type="good" />
              ))}
            </div>
          </div>
        )}
        
        {mutator.badChampions && (
          <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/20">
            <h4 className="font-semibold text-red-400 mb-2 text-sm">Avoid Champions</h4>
            <div className="flex flex-wrap gap-1">
              {mutator.badChampions.split(/[,;]/).map((champion, index) => (
                <ChampionPill key={index} championName={champion.trim()} type="bad" />
              ))}
            </div>
          </div>
        )}
        
        {mutator.strategy && (
          <div className="bg-purple-500/5 p-3 rounded-lg border border-purple-500/20">
            <h4 className="font-semibold text-purple-400 mb-2 text-sm">Strategy</h4>
            <p className="text-xs text-muted-foreground">{mutator.strategy}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
