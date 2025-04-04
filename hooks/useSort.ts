import { useState, useMemo } from 'react';
import { Artwork } from '../utils/data';

// Custom hook for sorting pictures
export const useSort = (initialPictures: Artwork[]) => {
  // State for the selected sorting option, default is "Neueste"
  const [selectedOption, setSelectedOption] = useState<string>('Neueste');

  // List of available sorting options
  const sortOptions = ['Neueste', 'Preis aufsteigend', 'Preis absteigend']; // "Beliebtheit" removed

  // Use useMemo to memoize the sorted pictures list, only recomputing when `selectedOption` or `initialPictures` change
  const sortedPictures = useMemo(() => {
    const sorted = [...initialPictures]; // Create a copy of the pictures array before sorting
    switch (selectedOption) {
      case 'Neueste':
        // Sort by the most recent (newest)
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'Preis aufsteigend':
        // Sort by ascending price
        return sorted.sort((a, b) => a.price - b.price);
      case 'Preis absteigend':
        // Sort by descending price
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [selectedOption, initialPictures]); // Recalculate when `selectedOption` or `initialPictures` change

  // Function to handle changes in the sorting option
  const handleSortChange = (option: string) => {
    setSelectedOption(option); // Update the selected sort option
  };

  // Return the sorted pictures, current sort option, available sort options, and the function to handle sort changes
  return { selectedOption, sortOptions, pictures: sortedPictures, handleSortChange };
};
