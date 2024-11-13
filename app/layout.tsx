import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nutrition Label Generator | Create Custom Nutrition Facts Labels',
  description: 'Generate custom nutrition facts labels for US, EU, Indian, and Canadian standards. Free online tool for food manufacturers and nutritionists.',
  keywords: 'nutrition label, nutrition facts, food labeling, US nutrition label, EU nutrition label, Indian nutrition label, Canadian nutrition label',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
