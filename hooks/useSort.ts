import { useState } from 'react';
import { Picture } from '../pages/fotografien/data'; // Importiere deinen Picture-Typ

export const useSort = (initialPictures: Picture[]) => {
  const [selectedOption, setSelectedOption] = useState<string>('Beliebtheit');
  const sortOptions = ['Beliebtheit', 'Neueste', 'Preis aufsteigend', 'Preis absteigend'];
  const [pictures, setPictures] = useState<Picture[]>(initialPictures);

  const handleSortChange = (option: string) => {
    setSelectedOption(option);

    const sortedPictures = [...pictures];
    switch (option) {
      case 'Beliebtheit':
        sortedPictures.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'Neueste':
        sortedPictures.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'Preis aufsteigend':
        sortedPictures.sort((a, b) => a.price - b.price);
        break;
      case 'Preis absteigend':
        sortedPictures.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setPictures(sortedPictures);
  };

  return { selectedOption, sortOptions, pictures, handleSortChange };
};
