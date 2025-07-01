
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
import { TagData } from "@/hooks/useTags";

interface TagEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tagName: string;
  tagData?: TagData;
  onSave: (tagName: string, data: TagData) => void;
}

export function TagEditDialog({ 
  open, 
  onOpenChange, 
  tagName, 
  tagData, 
  onSave 
}: TagEditDialogProps) {
  const [goodChampions, setGoodChampions] = useState("");
  const [badChampions, setBadChampions] = useState("");

  useEffect(() => {
    if (tagData) {
      setGoodChampions(tagData.goodChampions || "");
      setBadChampions(tagData.badChampions || "");
    }
  }, [tagData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave(tagName, {
      goodChampions: goodChampions.trim(),
      badChampions: badChampions.trim()
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Tag: {tagName}</DialogTitle>
          <DialogDescription>
            Set default champion recommendations for this tag.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tag-good-champions">Good Champions</Label>
            <Input
              id="tag-good-champions"
              value={goodChampions}
              onChange={(e) => setGoodChampions(e.target.value)}
              placeholder="Champions that work well with this tag (comma or semicolon separated)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-bad-champions">Bad Champions</Label>
            <Input
              id="tag-bad-champions"
              value={badChampions}
              onChange={(e) => setBadChampions(e.target.value)}
              placeholder="Champions to avoid with this tag (comma or semicolon separated)"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Tag Data
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
