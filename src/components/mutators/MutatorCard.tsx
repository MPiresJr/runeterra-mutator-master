
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Zap, Tag } from "lucide-react";
import { ChampionPill } from "./ChampionPill";
import { Mutator } from "@/hooks/useMutators";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface MutatorCardProps {
  mutator: Mutator;
  onEdit: (mutator: Mutator) => void;
  onDelete: (id: string) => void;
  onTagEdit?: (mutatorId: string, newTag: string) => void;
}

const parseChampions = (championsString: string) => {
  if (!championsString) return [];
  return championsString.split(/[,;]/).map(champion => champion.trim()).filter(Boolean);
};

export const MutatorCard = ({ mutator, onEdit, onDelete, onTagEdit }: MutatorCardProps) => {
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [tagValue, setTagValue] = useState(mutator.tag || "");

  const handleTagClick = () => {
    if (onTagEdit) {
      setIsEditingTag(true);
      setTagValue(mutator.tag || "");
    }
  };

  const handleTagSave = () => {
    if (onTagEdit) {
      onTagEdit(mutator.id, tagValue);
      setIsEditingTag(false);
    }
  };

  const handleTagCancel = () => {
    setIsEditingTag(false);
    setTagValue(mutator.tag || "");
  };

  return (
    <Card 
      className="hover:bg-card/80 transition-all duration-200 hover:scale-[1.02] border-purple-500/20 relative overflow-hidden"
    >
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <CardTitle className="text-lg text-purple-400">
                {mutator.name}
              </CardTitle>
            </div>
            <div className="flex gap-2 flex-wrap">
              {mutator.tag && (
                <div className="flex items-center">
                  {isEditingTag ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={tagValue}
                        onChange={(e) => setTagValue(e.target.value)}
                        className="h-6 text-xs px-2 w-24"
                        onKeyPress={(e) => e.key === 'Enter' && handleTagSave()}
                        onBlur={handleTagSave}
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleTagCancel}
                        className="h-6 w-6 p-0 text-xs"
                      >
                        ×
                      </Button>
                    </div>
                  ) : (
                    <Badge 
                      className="bg-gray-500/20 text-gray-300 border-gray-500/30 cursor-pointer hover:bg-gray-500/30"
                      onClick={handleTagClick}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {mutator.tag}
                    </Badge>
                  )}
                </div>
              )}
              {!mutator.tag && onTagEdit && (
                <Badge 
                  className="bg-gray-500/20 text-gray-300 border-gray-500/30 cursor-pointer hover:bg-gray-500/30 border-dashed"
                  onClick={() => {
                    setTagValue("");
                    setIsEditingTag(true);
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  Add Tag
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
