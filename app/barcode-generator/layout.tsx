import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free Barcode Generator | UPC, EAN, GS1, QR Code Generator',
  description: 'Generate professional barcodes for any product or purpose. Create UPC-A, EAN-13, GS1-128, ITF-14, Data Matrix, QR codes and more. Download instantly in SVG, PNG formats.',
  keywords: [
    'barcode generator', 
    'UPC barcode generator', 
    'EAN-13 barcode maker', 
    'GS1-128 barcode creator',
    'QR code generator',
    'product barcodes',
    'retail barcodes',
    'food label barcodes',
    'Data Matrix barcode generator',
    'ITF-14 barcode maker',
    'GS1 DataBar generator',
    'barcode generator for packaging',
    'free barcode maker',
    'product traceability barcodes',
    'retail barcode generator',
    'logistics barcode creator',
    'variable weight product barcodes',
    'manufacturing barcodes',
    'grocery product barcode generator',
    'small package barcode maker'
  ],
  openGraph: {
    title: 'Free Barcode Generator | UPC, EAN, GS1, QR Code Generator',
    description: 'Generate professional barcodes for any product or purpose. Create UPC-A, EAN-13, GS1-128, ITF-14, Data Matrix, QR codes and more.',
    type: 'website',
    url: 'https://nutrition-label-maker.vercel.app/barcode-generator',
    images: [
      {
        url: 'https://nutrition-label-maker.vercel.app/images/barcode-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Barcode Generator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Barcode Generator | UPC, EAN, GS1, QR Code Generator',
    description: 'Generate professional barcodes for any product or purpose. Create UPC-A, EAN-13, GS1-128, ITF-14, Data Matrix, QR codes and more.',
    images: ['https://nutrition-label-maker.vercel.app/images/barcode-generator-twitter.jpg']
  },
  alternates: {
    canonical: 'https://nutrition-label-maker.vercel.app/barcode-generator'
  }
}

const BarcodeGeneratorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="barcode-generator-container">
      {children}
    </div>
  )
}

export default BarcodeGeneratorLayout