import localFont from 'next/font/local';

// Cinzel Font
export const cinzel = localFont({
  src: '../public/fonts/Cinzel.ttf',
  display: 'swap',
  weight: '400',
  style: 'normal',
  variable: '--font-cinzel',
});

// Playfair Display Font
export const playfairdisplay = localFont({
  src: '../public/fonts/PlayfairDisplay.ttf',
  display: 'swap',
  weight: '400',
  style: 'normal',
  variable: '--font-playfairdisplay',
});

// Layout-Komponente exportieren
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cinzel.variable} ${playfairdisplay.variable}`}>
      {children}
    </div>
  );
}
