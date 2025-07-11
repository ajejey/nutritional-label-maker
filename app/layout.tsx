import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script';
import "./globals.css";
import { NavBar } from "./components/navigation/nav-bar";
import { Footer } from "./components/footer";
import GoogleAnalytics from "./components/google-analytics";
import { AnalyticsProvider } from "./providers/analytics-provider";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { PostHogProvider } from "./providers";
import SuspendedPostHogPageView from "./components/posthog/page-view-component";
// import { AuthProvider } from "./context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://nutrition-label-maker.vercel.app/'),

  title: {
    default: '100% FREE Nutrition Label Maker | Create FDA Labels Instantly',
    template: '%s | Free Nutrition Label Generator'
  },

  description: 'Create FDA-compliant nutrition labels and barcodes completely FREE! No hidden costs, no signup required. Perfect for food manufacturers, small businesses & nutritionists. Generate UPC-A, EAN-13, QR codes, plus multiple nutrition label formats for US, EU, Indian, Canadian & Australian standards.',

  openGraph: {
    type: 'website',
    siteName: 'Nutrition Label Maker',
    title: '100% FREE Nutrition Label & Barcode Generator | Create FDA-Compliant Labels Instantly',
    description: 'Create FDA-compliant nutrition labels and barcodes completely FREE! Generate UPC-A, EAN-13, QR codes for retail packaging, plus multiple nutrition label formats for US, EU, Indian, Canadian & Australian standards.',
    locale: 'en_US',
    url: 'https://nutrition-label-maker.vercel.app/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nutrition Label Maker - Free Online Tool'
      },
    ],
  },

  keywords: [
    'free nutrition label maker',
    'FDA nutrition label generator',
    'free food label creator',
    'nutrition facts generator',
    'food labeling tool',
    'free label maker',
    'FDA compliant labels',
    'UPC barcode generator',
    'EAN-13 barcode maker',
    'QR code generator for food',
    'food product barcode creator',
    'retail barcode generator',
    'nutrition facts template',
    'food manufacturer tools',
    'small business label maker',
    'US linear nutrition label',
    'US tabular nutrition label',
    'simplified nutrition facts',
    'vertical condensed nutrition label',
    'dual column nutrition facts',
    'bilingual nutrition label',
    'FDA 2023 compliant labels',
    'multiple nutrition label formats'
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

  twitter: {
    card: 'summary_large_image',
    title: 'Create Professional Nutrition Facts Labels Online',
    description: 'Generate FDA-compliant nutrition facts labels in multiple US formats (Standard, Simplified, Linear, Tabular, Dual-Column, Bilingual), plus EU, Indian, Canadian, and Australian standards. Free online tool for food manufacturers and nutritionists.',
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
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nutrition Label Maker",
    "url": "https://nutrition-label-maker.vercel.app/",
    "logo": "https://nutrition-label-maker.vercel.app/favicon-32x32.png",
    "description": "Create FDA-compliant nutrition labels and barcodes completely FREE! No hidden costs, no signup required. Perfect for food manufacturers, small businesses & nutritionists.",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "ajejey@gmail.com"
    }
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <meta name="google-adsense-account" content="ca-pub-3613850686549619"/>
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3613850686549619" 
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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
            <PostHogProvider>
            <div className="flex flex-col min-h-screen">
              <NavBar />
              <SuspendedPostHogPageView />
              <main className="flex-1 pt-16">
                {children}
              </main>
              <Footer />
            </div>
            </PostHogProvider>
          </AnalyticsProvider>  
        </Suspense>
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
