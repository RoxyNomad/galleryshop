export const picturesData = [
  { id: 1, name: 'Bild 1', src: '/images/pic1.jpg', date: '2024-02-10', price: 20, popularity: 5, category: 'Landschaft' },
  { id: 2, name: 'Bild 2', src: '/images/pic2.jpg', date: '2024-02-08', price: 30, popularity: 7, category: 'Landschaft' },
  { id: 3, name: 'Bild 3', src: '/images/pic3.jpg', date: '2024-02-06', price: 25, popularity: 4, category: 'Landschaft' },
  { id: 4, name: 'Bild 4', src: '/images/pic4.jpg', date: '2024-02-05', price: 50, popularity: 8, category: 'Landschaft' },
  { id: 5, name: 'Bild 5', src: '/images/pic5.jpg', date: '2024-02-02', price: 15, popularity: 3, category: 'Porträts' },
  { id: 6, name: 'Bild 6', src: '/images/pic6.jpg', date: '2024-01-30', price: 40, popularity: 6, category: 'Porträts' },
  { id: 7, name: 'Bild 7', src: '/images/pic7.jpg', date: '2024-01-25', price: 10, popularity: 2, category: 'Porträts' },
  { id: 8, name: 'Bild 8', src: '/images/pic8.jpg', date: '2024-01-20', price: 60, popularity: 9, category: 'Porträts' },
  { id: 9, name: 'Bild 9', src: '/images/pic9.jpg', date: '2024-01-15', price: 35, popularity: 5, category: 'Street' },
  { id: 10, name: 'Bild 10', src: '/images/pic10.jpg', date: '2024-01-10', price: 55, popularity: 7, category: 'Street' },
  { id: 11, name: 'Bild 11', src: '/images/pic11.jpg', date: '2024-01-05', price: 45, popularity: 8, category: 'Street' },
  { id: 12, name: 'Bild 12', src: '/images/pic12.jpg', date: '2024-01-01', price: 20, popularity: 4, category: 'Street' },
  { id: 13, name: 'Bild 13', src: '/images/pic13.jpg', date: '2024-02-06', price: 25, popularity: 4, category: 'Landschaft' },
  { id: 14, name: 'Bild 14', src: '/images/pic14.jpg', date: '2024-02-05', price: 50, popularity: 8, category: 'Landschaft' },
  { id: 15, name: 'Bild 15', src: '/images/pic15.jpg', date: '2024-02-02', price: 15, popularity: 3, category: 'Landschaft' },
  { id: 16, name: 'Bild 16', src: '/images/pic16.jpg', date: '2024-01-30', price: 40, popularity: 6, category: 'Landschaft' }
];

// Define and export the Picture type
// Removed duplicate Picture type definition

export interface Picture {
  id: number;
  src: string;
	date: string;
  price: number;
  name: string;
	popularity: number;
	category: string;
}
