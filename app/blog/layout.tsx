import React, { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import type { Metadata } from "next"

const metadata: Metadata = {
  title: {
    default: 'Food Label Blog | FREE Tips & Guides for Perfect Nutrition Labels',
    template: '%s | Nutrition Label Blog'
  },
  description: 'FREE guides, tips & tricks for creating perfect nutrition labels. Learn FDA compliance secrets, avoid costly mistakes, and make professional food labels instantly!',
  
  openGraph: {
    type: 'website',
    siteName: 'Nutrition Label Maker',
    title: 'Food Label Blog | FREE Tips & Guides for Perfect Nutrition Labels',
    description: 'FREE guides, tips & tricks for creating perfect nutrition labels. Learn FDA compliance secrets, avoid costly mistakes, and make professional food labels instantly!',
  },

  keywords: [
    'free nutrition label tips',
    'food labeling guide',
    'FDA compliance help',
    'nutrition facts tips',
    'food label requirements',
    'nutrition label tutorial',
    'food packaging guidelines',
    'free label maker guide',
    'nutrition facts examples',
    'food label regulations'
  ],
}

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      }>
        {children}
      </Suspense>
    </div>
  )
}

export { metadata }
export default layout