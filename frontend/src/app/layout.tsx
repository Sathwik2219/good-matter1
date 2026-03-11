import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata = {
  title: 'GoodMatter - Institutional-Grade Dealflow',
  description: 'A private community connecting exceptional founders with aligned investors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-secondary text-primary min-h-screen flex flex-col`}>
        {/* Placeholder Navbar will go here */}
        <main className="flex-grow pt-20">
          {children}
        </main>
        {/* Placeholder Footer will go here */}
      </body>
    </html>
  );
}
