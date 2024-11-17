import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "./components/navigation/nav-bar";
import { Footer } from "./components/footer";
import GoogleAnalytics from "./components/google-analytics";
import { AnalyticsProvider } from "./providers/analytics-provider";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
// import { AuthProvider } from "./context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://nutrition-label-maker.vercel.app/'),

  title: {
    default: 'FREE NUTRITION FACTS MAKER | Create FDA-compliant Labels',
    template: '%s | Nutrition Label Generator'
  },

  description: 'Generate FDA-compliant nutrition facts labels for US, EU, Indian, and Canadian standards. Free online tool for food manufacturers and nutritionists.',

  keywords: [
    'nutrition label generator',
    'nutrition facts label',
    'food labeling',
    'FDA nutrition label',
    'EU nutrition label',
    'nutrition declaration',
    'food packaging labels',
    'nutrition facts panel',
    'food manufacturer tools',
    'free nutrition label maker'
  ],

  authors: [{ name: 'Nutrition Label Maker' }],
  creator: 'Nutrition Label Maker',
  publisher: 'Nutrition Label Maker',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  verification: {
    google: '7nItEeuNSAIFL_unU4Ai5p-SGizDDaJU8XRYEKdtOgk',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nutrition-label-maker.vercel.app/',
    siteName: 'Nutrition Label Generator',
    title: 'Create Professional Nutrition Facts Labels Online',
    description: 'Generate FDA-compliant nutrition facts labels for US, EU, Indian, and Canadian standards. Free online tool for food manufacturers and nutritionists.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nutrition Label Generator Preview',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Create Professional Nutrition Facts Labels Online',
    description: 'Generate FDA-compliant nutrition facts labels for US, EU, Indian, and Canadian standards. Free online tool for food manufacturers and nutritionists.',
    images: ['/twitter-image.jpg'],
    creator: '@nutritionlabelmaker',
  },

  alternates: {
    canonical: 'https://nutrition-label-maker.vercel.app/',
  },

  manifest: '/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics GA_MEASUREMENT_ID={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {/* <AuthProvider> */}
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        }>

          <AnalyticsProvider>
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <main className="flex-1 pt-16">
                {children}
              </main>
              <Footer />
            </div>
          </AnalyticsProvider>
        </Suspense>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
