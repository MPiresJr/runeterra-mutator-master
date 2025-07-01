
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Zap, Tag } from "lucide-react";
import { ChampionPill } from "./ChampionPill";
import { Mutator } from "@/hooks/useMutators";
import { useState } from "react";
import { TagEditDialog } from "./TagEditDialog";
import { useTags } from "@/hooks/useTags";

interface MutatorCardProps {
  mutator: Mutator;
  onEdit: (mutator: Mutator) => void;
  onDelete: (id: string) => void;
}

const parseChampions = (championsString: string) => {
  if (!championsString) return [];
  return championsString.split(/[,;]/).map(champion => champion.trim()).filter(Boolean);
};

const parseTags = (tagString: string) => {
  if (!tagString) return [];
  return tagString.split(/[,;]/).map(tag => tag.trim()).filter(Boolean);
};

export const MutatorCard = ({ mutator, onEdit, onDelete }: MutatorCardProps) => {
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const { getTagData, updateTag } = useTags();

  const tags = parseTags(mutator.tag || "");

  const handleTagClick = (tagName: string) => {
    setEditingTag(tagName);
  };

  const handleTagSave = (tagName: string, data: any) => {
    updateTag(tagName, data);
    setEditingTag(null);
  };

  // Combine mutator champions with tag champions
  const getAllGoodChampions = () => {
    const champions = new Set(parseChampions(mutator.goodChampions));
    
    tags.forEach(tag => {
      const tagData = getTagData(tag);
      if (tagData?.goodChampions) {
        parseChampions(tagData.goodChampions).forEach(c => champions.add(c));
      }
    });
    
    return Array.from(champions);
  };

  const getAllBadChampions = () => {
    const champions = new Set(parseChampions(mutator.badChampions));
    
    tags.forEach(tag => {
      const tagData = getTagData(tag);
      if (tagData?.badChampions) {
        parseChampions(tagData.badChampions).forEach(c => champions.add(c));
      }
    });
    
    return Array.from(champions);
  };

  return (
    <>
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
                {tags.map((tag, index) => (
                  <Badge 
                    key={index}
                    className="bg-gray-500/20 text-gray-300 border-gray-500/30 cursor-pointer hover:bg-gray-500/30"
                    onClick={() => handleTagClick(tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
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
              {getAllGoodChampions().map((champion, index) => (
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
              {getAllBadChampions().map((champion, index) => (
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

      {editingTag && (
        <TagEditDialog
          open={!!editingTag}
          onOpenChange={(open) => !open && setEditingTag(null)}
          tagName={editingTag}
          tagData={getTagData(editingTag)}
          onSave={handleTagSave}
        />
      )}
    </>
  );
};
