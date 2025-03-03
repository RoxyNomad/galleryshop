import { useState, useMemo } from 'react';
import { Artwork } from '../pages/photography/data';

export const useSort = (initialPictures: Artwork[]) => {
  const [selectedOption, setSelectedOption] = useState<string>('Neueste'); // Standard ist "Neueste"
  const sortOptions = ['Neueste', 'Preis aufsteigend', 'Preis absteigend']; // "Beliebtheit" entfernt

  // Verwende useMemo, um die sortierte Bilderliste zu berechnen
  const sortedPictures = useMemo(() => {
    const sorted = [...initialPictures]; // Kopiere die Bilderdaten, bevor du sortierst
    switch (selectedOption) {
      case 'Neueste':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'Preis aufsteigend':
        return sorted.sort((a, b) => a.price - b.price);
      case 'Preis absteigend':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [selectedOption, initialPictures]); // Nur neu berechnen, wenn `selectedOption` oder `initialPictures` sich ändern

  const handleSortChange = (option: string) => {
    setSelectedOption(option); // Setze die ausgewählte Sortieroption
  };

  return { selectedOption, sortOptions, pictures: sortedPictures, handleSortChange };
};
