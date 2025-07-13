import React from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FREE Recipe Management Tools for Professional Bakers',
  description: 'Free professional baking tools for recipe scaling, unit conversion, and cost calculation. Save time, prevent errors, and increase profits with our baker\'s toolkit.',
  keywords: 'recipe scaling calculator, bakery cost calculator, baking unit converter, recipe management tools, professional baking tools, recipe costing software, baker\'s percentage calculator, recipe import tool, food cost calculator',
  openGraph: {
    title: 'FREE Recipe Management Tools for Professional Bakers',
    description: 'Free professional baking tools for recipe scaling, unit conversion, and cost calculation. Save time, prevent errors, and increase profits with our baker\'s toolkit.',
    images: [
      {
        url: '/images/recipe-management-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Baker\'s Toolkit Recipe Management Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FREE Recipe Management Tools',
    description: 'Free professional baking tools for recipe scaling, unit conversion, and cost calculation with ingredient import.',
    images: ['/images/recipe-management-og.jpg'],
  },
}

const RecipeManagementLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}

export default RecipeManagementLayout