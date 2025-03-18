import './globals.css';
import './theme-variables.scss';
import Providers from '@/components/Providers';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export const metadata = {
  title: 'Anthony Zhou',
  description: 'Anthony Zhou Portfolio',
  // other metadata
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Providers>
        <body>
          {children}
          <ThemeSwitcher />
        </body>
      </Providers>
    </html>
  );
}