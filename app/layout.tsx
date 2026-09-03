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

const siteUrl = new URL('https://site-recipe.n3mooo.chatgpt.site');
const title = 'Site Recipe — Make a site plan worth building';
const description =
  'Turn a loose website idea into a clear, taste-aware brief for ChatGPT Sites.';

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Site Recipe',
    title,
    description,
    images: [
      {
        url: new URL('/og.jpg', siteUrl),
        width: 1200,
        height: 630,
        alt: 'A colorful Site Recipe card with the message Turn a loose idea into a site you can actually build.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [new URL('/og.jpg', siteUrl)],
  },
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
