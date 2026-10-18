import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'N/VERSE — An Interactive Engineering Universe | Nikhil Singh',
  description:
    'Interactive 3D developer portfolio and engineering universe of Nikhil Singh — Computer Science Engineering student, full-stack developer, and software systems builder.',
  keywords: [
    'Nikhil Singh',
    'N/VERSE',
    'Portfolio',
    'Full Stack Developer',
    'Computer Science',
    'Three.js',
    'React',
    'Next.js',
    'Software Engineer'
  ],
  authors: [{ name: 'Nikhil Singh' }],
  creator: 'Nikhil Singh',
  openGraph: {
    title: 'N/VERSE — An Interactive Engineering Universe',
    description:
      'Cinematic 3D interactive engineering laboratory portfolio of Nikhil Singh. CODE. LEARN. BUILD. REPEAT.',
    url: 'https://n-verse.vercel.app',
    siteName: 'N/VERSE',
    type: 'website',
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'N/VERSE — An Interactive Engineering Universe',
    description: 'Cinematic 3D interactive portfolio of Nikhil Singh.'
  }
};

export const viewport: Viewport = {
  themeColor: '#05070b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#05070b] text-[#f8fafc] antialiased selection:bg-[#00f0ff]/20 selection:text-[#00f0ff] min-h-screen relative overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
