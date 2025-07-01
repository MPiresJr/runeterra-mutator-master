
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
  }, [mutators]);

  const handleAddMutator = (mutator: Omit<Mutator, "id">) => {
    const newMutator = {
      ...mutator,
      id: Date.now().toString()
    };
    
    // Auto-populate champions based on tag if tag is provided
    if (mutator.tag) {
      const taggedMutators = mutators.filter(m => m.tag === mutator.tag);
      if (taggedMutators.length > 0) {
        const allGoodChampions = new Set<string>();
        const allBadChampions = new Set<string>();
        
        taggedMutators.forEach(m => {
          if (m.goodChampions) {
            m.goodChampions.split(/[,;]/).forEach(c => allGoodChampions.add(c.trim()));
          }
          if (m.badChampions) {
            m.badChampions.split(/[,;]/).forEach(c => allBadChampions.add(c.trim()));
          }
        });
        
        newMutator.goodChampions = Array.from(allGoodChampions).join(', ');
        newMutator.badChampions = Array.from(allBadChampions).join(', ');
      }
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
