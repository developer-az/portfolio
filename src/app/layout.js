import './globals.css';
import './theme-variables.scss';
import Providers from '@/components/Providers';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export const metadata = {
  title: 'Anthony Zhou - Software Engineer & Web Designer',
  description: 'Portfolio of Anthony Zhou, a software engineer and web designer specializing in creating innovative digital experiences.',
  keywords: 'Anthony Zhou, Software Engineer, Web Designer, Portfolio, React, JavaScript, Full Stack Developer',
  authors: [{ name: 'Anthony Zhou' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fa2104'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark-theme" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preload essential assets */}
        <link rel="preload" href="/fonts/AVGARDD_2.woff" as="font" type="font/woff" crossOrigin="anonymous" />
      </head>
      <body className="loading">
        <Providers>
          {children}
          <ThemeSwitcher />
        </Providers>
        
        {/* Initial theme script to prevent flashing */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              const savedTheme = localStorage.getItem('theme');
              // Default to dark theme if no preference is saved
              const theme = savedTheme || 'dark';
              document.documentElement.classList.add(\`\${theme}-theme\`);
            } catch (e) {
              // Fallback to dark theme if localStorage is unavailable
              document.documentElement.classList.add('dark-theme');
            }
          })();
        `}} />
      </body>
    </html>
  );
}