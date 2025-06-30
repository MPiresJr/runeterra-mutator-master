
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
import { Mutator } from "@/pages/MutatorsDatabase";

interface EditMutatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mutator: Mutator;
  onEdit: (mutator: Mutator) => void;
}

export function EditMutatorDialog({ open, onOpenChange, mutator, onEdit }: EditMutatorDialogProps) {
  const [name, setName] = useState("");
  const [rarity, setRarity] = useState<Mutator["rarity"]>("Common");
  const [description, setDescription] = useState("");
  const [goodChampions, setGoodChampions] = useState("");
  const [badChampions, setBadChampions] = useState("");
  const [strategy, setStrategy] = useState("");

  // Update form when mutator changes
  useEffect(() => {
    if (mutator) {
      setName(mutator.name);
      setRarity(mutator.rarity);
      setDescription(mutator.description);
      setGoodChampions(mutator.goodChampions);
      setBadChampions(mutator.badChampions);
      setStrategy(mutator.strategy);
    }
  }, [mutator]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      return;
    }

    onEdit({
      ...mutator,
      name: name.trim(),
      rarity,
      description: description.trim(),
      goodChampions: goodChampions.trim(),
      badChampions: badChampions.trim(),
      strategy: strategy.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Mutator</DialogTitle>
          <DialogDescription>
            Update the mutator's characteristics and strategies.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Mutator Name *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter mutator name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-rarity">Rarity</Label>
              <Select value={rarity} onValueChange={(value: Mutator["rarity"]) => setRarity(value)}>
                <SelectTrigger>
                  <SelectValue />
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
            <Label htmlFor="edit-description">Description *</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the mutator's effect"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-goodChampions">Recommended Champions</Label>
            <Input
              id="edit-goodChampions"
              value={goodChampions}
              onChange={(e) => setGoodChampions(e.target.value)}
              placeholder="Champions that work well with this mutator"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-badChampions">Champions to Avoid</Label>
            <Input
              id="edit-badChampions"
              value={badChampions}
              onChange={(e) => setBadChampions(e.target.value)}
              placeholder="Champions that don't work well with this mutator"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-strategy">Strategy</Label>
            <Textarea
              id="edit-strategy"
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update Mutator
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
