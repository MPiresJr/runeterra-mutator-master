
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
  const [newTagName, setNewTagName] = useState("");
  const [goodChampions, setGoodChampions] = useState("");
  const [badChampions, setBadChampions] = useState("");

  useEffect(() => {
    if (tagData) {
      setGoodChampions(tagData.goodChampions || "");
      setBadChampions(tagData.badChampions || "");
    } else {
      setGoodChampions("");
      setBadChampions("");
    }
    setNewTagName(tagName);
  }, [tagData, tagName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalTagName = newTagName.trim() || tagName;
    if (!finalTagName) return;
    
    onSave(finalTagName, {
      goodChampions: goodChampions.trim(),
      badChampions: badChampions.trim()
    });
    
    setNewTagName("");
    setGoodChampions("");
    setBadChampions("");
    onOpenChange(false);
  };

  const isNewTag = !tagName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isNewTag ? "Add New Tag" : `Edit Tag: ${tagName}`}</DialogTitle>
          <DialogDescription>
            {isNewTag ? "Create a new tag with champion recommendations." : "Set default champion recommendations for this tag."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {isNewTag && (
            <div className="space-y-2">
              <Label htmlFor="tag-name">Tag Name *</Label>
              <Input
                id="tag-name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
                required
              />
            </div>
          )}

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
              {isNewTag ? "Add Tag" : "Save Tag Data"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
