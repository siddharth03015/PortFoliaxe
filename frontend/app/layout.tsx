import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'PortfolioGen — Create Your Professional Portfolio',
  description: 'Build a stunning developer portfolio in minutes. Sign up, fill in your details, and share your portfolio link with the world.',
  keywords: ['Portfolio Generator', 'Developer Portfolio', 'Create Portfolio', 'Resume Builder'],
  openGraph: {
    title: 'PortfolioGen — Create Your Professional Portfolio',
    description: 'Build a stunning developer portfolio in minutes.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <div className="noise-overlay" />
            <main>{children}</main>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'rgba(8, 15, 31, 0.9)',
                  color: '#f1f5f9',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  backdropFilter: 'blur(16px)',
                  borderRadius: '12px',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
