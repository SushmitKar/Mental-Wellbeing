import type { Metadata } from 'next';
import { ThemeProvider } from '@/providers/theme-provider';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'MindHub',
  description: 'Mental-Health Website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}