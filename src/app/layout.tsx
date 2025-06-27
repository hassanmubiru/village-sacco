import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/providers';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#676FFF',
};

export const metadata: Metadata = {
  title: 'Village SACCO - Blockchain-Powered Cooperative',
  description: 'A transparent, secure, and democratic savings and credit cooperative organization powered by blockchain technology.',
  keywords: ['SACCO', 'blockchain', 'DeFi', 'cooperative', 'savings', 'loans', 'governance'],
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Village SACCO',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
  applicationName: 'Village SACCO',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Village SACCO',
    title: 'Village SACCO - Blockchain-Powered Cooperative',
    description: 'A transparent, secure, and democratic savings and credit cooperative organization powered by blockchain technology.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Village SACCO" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Village SACCO" />
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#676FFF" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <AuthProvider>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                {children}
              </div>
              <Toaster />
            </AuthProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}