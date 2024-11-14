import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "./components/navigation/nav-bar";
import { Footer } from "./components/footer";
import GoogleAnalytics from "./components/google-analytics";
import { AnalyticsProvider } from "./providers/analytics-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Nutrition Label Generator | Create Custom Nutrition Facts Labels',
  description: 'Generate custom nutrition facts labels for US, EU, Indian, and Canadian standards. Free online tool for food manufacturers and nutritionists.',
  keywords: 'nutrition label, nutrition facts, food labeling, US nutrition label, EU nutrition label, Indian nutrition label, Canadian nutrition label',
  verification: {
    google: '7nItEeuNSAIFL_unU4Ai5p-SGizDDaJU8XRYEKdtOgk',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        <AnalyticsProvider>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
