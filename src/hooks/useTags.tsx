
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface TagData {
  goodChampions: string;
  badChampions: string;
}

export interface TagsDatabase {
  [tagName: string]: TagData;
}

export const useTags = () => {
  const [tags, setTags] = useState<TagsDatabase>({});

  useEffect(() => {
    const savedTags = localStorage.getItem('lorTags');
    if (savedTags) {
      try {
        setTags(JSON.parse(savedTags));
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lorTags', JSON.stringify(tags));
  }, [tags]);

  const updateTag = (tagName: string, data: TagData) => {
    setTags(prev => ({
      ...prev,
      [tagName]: data
    }));
    toast.success("Tag updated successfully!");
  };

  const getTagData = (tagName: string): TagData | undefined => {
    return tags[tagName];
  };

  return {
    tags,
    updateTag,
    getTagData
  };
};
