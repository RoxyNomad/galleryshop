import localFont from 'next/font/local';
import Header from '@/components/Header';

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

// Layout Props
type LayoutProps = {
  children: React.ReactNode;
  disableHeader?: boolean;
};

// Layout-Komponente exportieren
export function Layout({ children, disableHeader }: LayoutProps) {
  return (
    <div className={`${cinzel.variable} ${playfairdisplay.variable}`}>
      {/* Header nur anzeigen, wenn disableHeader nicht true ist */}
      {!disableHeader && <Header />}
      
      {children}
    </div>
  );
}

export default Layout;