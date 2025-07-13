import Link from 'next/link';
import { ArrowRight, ChefHat, FileText, Globe, Sparkles, Barcode } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Create Professional{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Nutrition Labels
              </span>{' '}
              for Your Food Products
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Generate accurate, FDA-compliant nutrition labels for your recipes or products.
              Choose from multiple formats and download in high resolution.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Standard US</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Simplified US</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Linear US</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Tabular US</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Dual-Column US</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">Bilingual US</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">EU</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Canadian</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Indian</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Australian</span>
            </div>

            {/* CTA Cards */}
            <div className="grid md:grid-cols-2 gap-9 mb-8">
              <div className="group flex flex-col justify-between relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white shadow-lg">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-4">Ingredient Nutrition Builder</h2>
                  <p className="text-gray-600 mb-6">
                    Calculate nutrition facts from your ingredients using our USDA database.
                    Perfect for manufacturers and food businesses.
                  </p>
                </div>
                <Link href="/ingredient-builder">
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Build from Ingredients
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="group flex flex-col justify-between relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl text-white shadow-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-4">Direct Nutrition Generator</h2>
                  <p className="text-gray-600 mb-6">
                    Already have nutrition information? Generate labels directly by entering
                    your nutrition facts data.
                  </p>
                </div>
                <Link href="/generator">
                  <Button className="w-full bg-indigo-500 text-gray-50 group-hover:bg-indigo-600 transition-colors">
                    Create from Values
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="group flex flex-col justify-between relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white shadow-lg">
                    <Barcode className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-4">Barcode Generator</h2>
                  <p className="text-gray-600 mb-6">
                    Create FDA-compliant barcodes for your food products. Generate UPC-A, EAN-13, and QR codes for retail packaging.
                  </p>
                </div>
                <Link href="/barcode-generator">
                  <Button className="w-full bg-purple-500 text-gray-50 group-hover:bg-purple-600 transition-colors">
                    Generate Barcodes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="group flex flex-col justify-between relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white shadow-lg">
                    <ChefHat className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-4">Recipe Management</h2>
                  <p className="text-gray-600 mb-6">
                    Manage your recipes, scale ingredients, convert units, and calculate costs with our baker&apos;s toolkit.
                    <span className="bg-yellow-100 px-1 rounded text-xs ml-1">New!</span>
                  </p>
                </div>
                <Link href="/recipe-management">
                  <Button className="w-full bg-orange-500 text-gray-50 group-hover:bg-orange-600 transition-colors">
                    Manage Recipes
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Invoice Generator Card */}
            <div className="group flex flex-col justify-between relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl text-white shadow-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-4">Invoice Generator</h2>
                <p className="text-gray-600 mb-6">
                  Create professional invoices in minutes for free. Add your business details, client information, and line items to generate invoices
                </p>
              </div>
              <a href="https://invoicegeneratoronline.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-teal-500 text-gray-50 group-hover:bg-teal-600 transition-colors">
                  Create Invoice
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Globe className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Multiple Formats</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Generate labels in multiple US FDA formats (Standard, Simplified, Linear, Tabular,
                Dual-Column, Bilingual), plus EU, Canadian, Australian, and Indian formats.
                All 100% compliant with local regulations.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ChefHat className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">USDA Database</h3>
              </div>
              <p className="text-gray-600">
                Access comprehensive nutrition data from the USDA database for accurate
                ingredient-based calculations.
              </p>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Professional Quality</h3>
              </div>
              <p className="text-gray-600">
                Download high-resolution labels perfect for packaging, menus, or documentation.
                Print-ready quality guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Create Your Nutrition Label?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose the method that works best for you and start generating professional
            nutrition labels today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link href="/barcode-generator">
              <Button size="lg" className="min-w-[200px] bg-purple-500 hover:bg-purple-600">
                Generate Barcodes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/ingredient-builder">
              <Button size="lg" className="min-w-[200px]">
                Build from Ingredients
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/recipe-management">
              <Button size="lg" className="min-w-[200px] bg-orange-500 hover:bg-orange-600">
                Recipe Management
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/generator">
              <Button size="lg" variant="outline" className="min-w-[200px]">
                Direct Generator
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}