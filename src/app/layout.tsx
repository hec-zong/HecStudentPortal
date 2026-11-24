import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['600', '700', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HEC E-Portal | Higher Education Commission Pakistan',
  description:
    'Enterprise Higher Education Commission Student & Administrative Portal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={orbitron.variable}>
      <body className="bg-background text-foreground min-h-screen font-sans antialiased selection:bg-[#13c2b6]/20 selection:text-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
