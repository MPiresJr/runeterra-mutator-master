
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface UnifiedData {
  mutators?: any[];
  roster?: any[];
  tags?: { [tagName: string]: { goodChampions: string; badChampions: string; } };
  [key: string]: any;
}

export const useUnifiedDatabase = () => {
  const [data, setData] = useState<UnifiedData>({});

  useEffect(() => {
    // Load all data from localStorage
    const savedData = localStorage.getItem('lorCompanionData');
    const savedMutators = localStorage.getItem('lorMutators');
    const savedTags = localStorage.getItem('lorTags');
    
    const unifiedData: UnifiedData = {};
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.assign(unifiedData, parsedData);
      } catch (error) {
        console.error('Error loading main data:', error);
      }
    }
    
    if (savedMutators) {
      try {
        unifiedData.mutators = JSON.parse(savedMutators);
      } catch (error) {
        console.error('Error loading mutators:', error);
      }
    }
    
    if (savedTags) {
      try {
        unifiedData.tags = JSON.parse(savedTags);
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    }
    
    setData(unifiedData);
  }, []);

  const clearAllData = () => {
    // Clear all localStorage data
    localStorage.removeItem('lorCompanionData');
    localStorage.removeItem('lorMutators');
    localStorage.removeItem('lorTags');
    
    setData({});
    toast.success("All data cleared successfully!");
    
    // Reload the page to reset all states
    window.location.reload();
  };

  const updateData = (key: string, value: any) => {
    const newData = { ...data, [key]: value };
    setData(newData);
    
    // Update localStorage
    localStorage.setItem('lorCompanionData', JSON.stringify(newData));
  };

  return {
    data,
    clearAllData,
    updateData
  };
};
