import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/providers';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Village SACCO - Blockchain-Powered Cooperative',
  description: 'A transparent, secure, and democratic savings and credit cooperative organization powered by blockchain technology.',
  keywords: ['SACCO', 'blockchain', 'DeFi', 'cooperative', 'savings', 'loans', 'governance'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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