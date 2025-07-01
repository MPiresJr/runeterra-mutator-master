import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTags } from "./useTags";

export interface Mutator {
  id: string;
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  description: string;
  goodChampions: string;
  badChampions: string;
  strategy: string;
  tag?: string;
}

export const useMutators = () => {
  const [mutators, setMutators] = useState<Mutator[]>([]);
  const { getTagData } = useTags();

  // Load mutators from localStorage on component mount
  useEffect(() => {
    const savedMutators = localStorage.getItem('lorMutators');
    if (savedMutators) {
      try {
        const parsedMutators = JSON.parse(savedMutators);
        setMutators(parsedMutators);
      } catch (error) {
        console.error('Error loading mutators:', error);
      }
    }
  }, []);

  // Save mutators to localStorage whenever mutators change
  useEffect(() => {
    localStorage.setItem('lorMutators', JSON.stringify(mutators));
    
    // Also update the main data store for export
    const savedData = localStorage.getItem('lorCompanionData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        const exportMutators = mutators.map((mutator: Mutator) => ({
          Mutator_name: mutator.name,
          Rarity: mutator.rarity,
          Mutator: mutator.description,
          Good_champions: mutator.goodChampions,
          Bad_champions: mutator.badChampions,
          Strategy: mutator.strategy,
          Mutator_tags: mutator.tag || ""
        }));
        data.Mutators = exportMutators;
        localStorage.setItem('lorCompanionData', JSON.stringify(data));
      } catch (error) {
        console.error('Error updating export data:', error);
      }
    }
  }, [mutators]);

  const handleAddMutator = (mutator: Omit<Mutator, "id">) => {
    const newMutator = {
      ...mutator,
      id: Date.now().toString()
    };
    
    // Parse tags separated by commas and semicolons
    const tags = mutator.tag ? mutator.tag.split(/[,;]/).map(t => t.trim()).filter(Boolean) : [];
    
    // Auto-populate champions based on tag data if tag is provided
    if (tags.length > 0) {
      const allGoodChampions = new Set<string>();
      const allBadChampions = new Set<string>();
      
      // Add existing champions from mutator
      if (mutator.goodChampions) {
        mutator.goodChampions.split(/[,;]/).forEach(c => allGoodChampions.add(c.trim()));
      }
      if (mutator.badChampions) {
        mutator.badChampions.split(/[,;]/).forEach(c => allBadChampions.add(c.trim()));
      }
      
      // Add champions from tag data
      tags.forEach(tag => {
        const tagData = getTagData(tag);
        if (tagData) {
          if (tagData.goodChampions) {
            tagData.goodChampions.split(/[,;]/).forEach(c => allGoodChampions.add(c.trim()));
          }
          if (tagData.badChampions) {
            tagData.badChampions.split(/[,;]/).forEach(c => allBadChampions.add(c.trim()));
          }
        }
      });
      
      newMutator.goodChampions = Array.from(allGoodChampions).join(', ');
      newMutator.badChampions = Array.from(allBadChampions).join(', ');
    }
    
    setMutators(prev => [...prev, newMutator]);
    toast.success("Mutator added successfully!");
  };

  const handleEditMutator = (updatedMutator: Mutator) => {
    setMutators(prev => prev.map(m => m.id === updatedMutator.id ? updatedMutator : m));
    toast.success("Mutator updated successfully!");
  };

  const handleDeleteMutator = (id: string) => {
    setMutators(prev => prev.filter(m => m.id !== id));
    toast.success("Mutator deleted successfully!");
  };

  const addImportedMutators = (importedMutators: Mutator[]) => {
    setMutators(prev => [...prev, ...importedMutators]);
  };

  return {
    mutators,
    handleAddMutator,
    handleEditMutator,
    handleDeleteMutator,
    addImportedMutators
  };
};
