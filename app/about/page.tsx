import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About Nutrition Label Maker</h1>
      
      <section className="mb-12 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-blue-600">Our Mission</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          We aim to simplify nutrition label creation for food manufacturers, 
          businesses, and health-conscious individuals. Our tool provides 
          accurate, professional-grade nutrition labels that comply with 
          international food labeling standards.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-blue-600">Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">🌐 Multiple International Formats</h3>
            <p>
              Support for US FDA, EU, Canadian, Australian, and Indian 
              nutrition label standards.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">🔍 USDA Database Integration</h3>
            <p>
              Accurate nutrition calculations using comprehensive 
              USDA food nutrition database.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">⚡ Real-Time Calculations</h3>
            <p>
              Instant nutrition fact updates as you modify ingredients 
              or serving sizes.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">📋 Flexible Generation Methods</h3>
            <p>
              Create labels via ingredient builder or direct manual input.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-blue-600">Who We Serve</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">Food Manufacturers</h3>
            <p>Create compliant nutrition labels quickly and accurately.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Small Businesses</h3>
            <p>Professional labeling without complex software.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Health Professionals</h3>
            <p>Precise nutrition information for dietary planning.</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <Link 
          href="/ingredient-builder" 
          className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition-colors"
        >
          Start Creating Labels
        </Link>
      </section>
    </div>
  );
}
