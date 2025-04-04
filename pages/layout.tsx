import localFont from 'next/font/local';  // Import localFont for loading custom fonts
import Header from '@/components/Header';  // Import Header component

// Cinzel Font
export const cinzel = localFont({
  src: '../public/fonts/Cinzel.ttf',  // Path to the Cinzel font file
  display: 'swap',  // Fallback font strategy
  weight: '400',  // Font weight
  style: 'normal',  // Normal font style
  variable: '--font-cinzel',  // Custom CSS variable for the font
});

// Playfair Display Font
export const playfairdisplay = localFont({
  src: '../public/fonts/PlayfairDisplay.ttf',  // Path to the Playfair Display font file
  display: 'swap',  // Fallback font strategy
  weight: '400',  // Font weight
  style: 'normal',  // Normal font style
  variable: '--font-playfairdisplay',  // Custom CSS variable for the font
});

// Layout Props
type LayoutProps = {
  children: React.ReactNode;  // Props to render children components inside Layout
  disableHeader?: boolean;  // Optional prop to disable the header
};

// Layout component export
export function Layout({ children, disableHeader }: LayoutProps) {
  return (
    <div className={`${cinzel.variable} ${playfairdisplay.variable}`}>  {/* Apply both font variables */}
      {/* Header will only be shown if disableHeader is not true */}
      {!disableHeader && <Header />}  {/* Conditional rendering of Header */}
      
      {children}  {/* Render children components */}
    </div>
  );
}

export default Layout;
