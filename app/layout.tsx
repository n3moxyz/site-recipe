import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';

const display = Bricolage_Grotesque({
  variable: '--font-display',
  subsets: ['latin'],
});

const body = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
});

const mono = Geist_Mono({
  variable: '--font-utility',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Site Recipe — Make a site plan worth building',
  description:
    'Turn a loose website idea into a clear, taste-aware brief for ChatGPT Sites.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        {children}
      </body>
    </html>
  );
}
