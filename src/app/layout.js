import './globals.css';
import './theme-variables.scss';
import Providers from '@/components/Providers';

export const metadata = {
  title: 'Anthony Zhou - Software Engineer & Web Designer',
  description: 'Portfolio of Anthony Zhou, a software engineer and web designer specializing in creating innovative digital experiences.',
  keywords: 'Anthony Zhou, Software Engineer, Web Designer, Portfolio, React, JavaScript, Full Stack Developer',
  authors: [{ name: 'Anthony Zhou' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2d04fa'
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
        
        {/* Preload critical CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          .preload-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #121212;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.5s;
          }
          
          .preload-hidden {
            opacity: 0;
            pointer-events: none;
          }
          
          .preload-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.1);
            border-top-color: #2d04fa;
            border-radius: 50%;
            animation: spinner 1s linear infinite;
          }
          
          @keyframes spinner {
            to {transform: rotate(360deg);}
          }
        `}} />
      </head>
      <body className="loading">
        <div id="preload-overlay" className="preload-overlay">
          <div className="preload-spinner"></div>
        </div>
        
        <Providers>
          {children}
        </Providers>
        
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            // Always use dark theme
            document.documentElement.classList.add('dark-theme');
            
            // Handle preloader
            window.addEventListener('load', function() {
              const preloader = document.getElementById('preload-overlay');
              if (preloader) {
                setTimeout(function() {
                  preloader.classList.add('preload-hidden');
                  setTimeout(function() {
                    preloader.remove();
                  }, 500);
                }, 500);
              }
            });
          })();
        `}} />
      </body>
    </html>
  );
}