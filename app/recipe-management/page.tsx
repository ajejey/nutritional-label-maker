import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator, ChefHat, DollarSign, Scale } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

const RecipeManagement = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <ChefHat className="h-12 w-12 text-orange-500 mr-3" />
        <h1 className="text-4xl font-bold text-gray-800">Baker&apos;s Toolkit</h1>
      </div>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Professional baking tools for home bakers, cottage food entrepreneurs, and small bakeries
      </p>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-200" 
            // onClick={() => setActiveTab('scale')}
            >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-semibold">Recipe Scaler</CardTitle>
          <CardDescription>
            Scale recipes up or down with automatic ingredient recalculation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Double, triple, or halve recipes instantly</li>
            <li>• Prevents measurement errors</li>
            <li>• Perfect for large orders or small batches</li>
          </ul>
          <Link href="/recipe-management/recipe-scaler">
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
              Start Scaling
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-200" 
            // onClick={() => setActiveTab('convert')}
            >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
            <Scale className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl font-semibold">Unit Converter</CardTitle>
          <CardDescription>
            Convert between cups, grams, ounces, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Volume to weight conversions</li>
            <li>• Imperial and metric units</li>
            <li>• Ingredient-specific accuracy</li>
          </ul>
          <Link href="/recipe-management/unit-converter">
            <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Convert Units
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-200" 
            // onClick={() => setActiveTab('cost')}
            >
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
          <CardTitle className="text-xl font-semibold">Cost Calculator</CardTitle>
          <CardDescription>
            Calculate ingredient costs and suggested pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• Track ingredient costs</li>
            <li>• <span className="text-purple-600 font-medium">Import from saved recipes</span> <span className="bg-yellow-100 px-1 rounded text-xs">New!</span></li>
            <li>• Include labor and overhead</li>
            <li>• Profitable pricing suggestions</li>
          </ul>
          <Link href="/recipe-management/cost-calculator">
            <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
              Calculate Costs
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>

    <div className="mt-16 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Why Bakers Love These Tools</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="text-center">
          <div className="text-3xl mb-3">⏱️</div>
          <h3 className="font-semibold mb-2">Save Time</h3>
          <p className="text-gray-600 text-sm">No more manual calculations or conversion charts</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="font-semibold mb-2">Prevent Errors</h3>
          <p className="text-gray-600 text-sm">Accurate measurements every time</p>
        </div>
        <div className="text-center">
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold mb-2">Increase Profits</h3>
          <p className="text-gray-600 text-sm">Price your products correctly</p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default RecipeManagement