
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Mutator } from "@/hooks/useMutators";
import { useTags } from "@/hooks/useTags";
import { TagEditDialog } from "./TagEditDialog";

interface AddMutatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (mutator: Omit<Mutator, "id">) => void;
}

export function AddMutatorDialog({ open, onOpenChange, onAdd }: AddMutatorDialogProps) {
  const [name, setName] = useState("");
  const [rarity, setRarity] = useState<Mutator["rarity"]>("Common");
  const [description, setDescription] = useState("");
  const [goodChampions, setGoodChampions] = useState("");
  const [badChampions, setBadChampions] = useState("");
  const [strategy, setStrategy] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState("");
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  const { tags, updateTag } = useTags();

  const filteredTags = Object.keys(tags).filter(tagName =>
    tagName.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      return;
    }

    onAdd({
      name: name.trim(),
      rarity,
      description: description.trim(),
      goodChampions: goodChampions.trim(),
      badChampions: badChampions.trim(),
      strategy: strategy.trim(),
      tag: selectedTags.join(', '),
    });

    // Reset form
    setName("");
    setRarity("Common");
    setDescription("");
    setGoodChampions("");
    setBadChampions("");
    setStrategy("");
    setSelectedTags([]);
    setTagSearch("");
    onOpenChange(false);
  };

  const handleTagSelect = (tagName: string) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags(prev => [...prev, tagName]);
    }
  };

  const handleTagRemove = (tagName: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tagName));
  };

  const handleNewTag = (tagName: string, data: any) => {
    updateTag(tagName, data);
    handleTagSelect(tagName);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Mutator</DialogTitle>
            <DialogDescription>
              Add a new mutator with its characteristics and strategies.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Mutator Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter mutator name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rarity">Rarity</Label>
                <Select value={rarity} onValueChange={(value: Mutator["rarity"]) => setRarity(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Common">Common</SelectItem>
                    <SelectItem value="Rare">Rare</SelectItem>
                    <SelectItem value="Epic">Epic</SelectItem>
                    <SelectItem value="Legendary">Legendary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the mutator's effect"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tag-search">Tags</Label>
              <Input
                id="tag-search"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="Search tags..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  type="button"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setIsTagDialogOpen(true)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Tag
                </Button>
                {filteredTags.map(tagName => (
                  <Badge
                    key={tagName}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-500/20"
                    onClick={() => handleTagSelect(tagName)}
                  >
                    {tagName}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm font-medium">Selected:</span>
                  {selectedTags.map(tagName => (
                    <Badge key={tagName} className="bg-blue-600">
                      {tagName}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => handleTagRemove(tagName)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="goodChampions">Recommended Champions</Label>
              <Input
                id="goodChampions"
                value={goodChampions}
                onChange={(e) => setGoodChampions(e.target.value)}
                placeholder="Champions that work well with this mutator"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badChampions">Champions to Avoid</Label>
              <Input
                id="badChampions"
                value={badChampions}
                onChange={(e) => setBadChampions(e.target.value)}
                placeholder="Champions that don't work well with this mutator"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Textarea
                id="strategy"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="Strategy to beat or work with this mutator"
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Add Mutator
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <TagEditDialog
        open={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        tagName=""
        onSave={handleNewTag}
      />
    </>
  );
}
