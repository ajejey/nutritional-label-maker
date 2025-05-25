'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Heart, Check, Coffee, Award, Shield, Zap } from 'lucide-react';

export default function SupportPage() {
  const [amount, setAmount] = useState(25);
  
  const handleDonation = () => {
    window.open(`https://paypal.me/bubbletrends/${amount}USD`, '_blank');
  };
  
  const predefinedAmounts = [10, 15, 25, 50];
  
  return (
    <div className="container mx-auto px-4 py-24 max-w-5xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Support Compliant Label Creation</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your contribution helps us maintain and enhance our FDA-compliant nutrition label tools
          for food manufacturers worldwide.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <Card className="p-8 border-2 border-primary/20">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full inline-block mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Support Our Mission</h2>
                <p className="text-gray-600 mt-2">
                  Choose an amount to contribute
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {predefinedAmounts.map((presetAmount) => (
                  <Button
                    key={presetAmount}
                    variant={amount === presetAmount ? "default" : "outline"}
                    onClick={() => setAmount(presetAmount)}
                    className="h-14 text-lg"
                  >
                    ${presetAmount}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <div className="flex items-center">
                  <span className="bg-muted px-3 h-10 flex items-center border rounded-l-md">$</span>
                  <Input
                    type="number"
                    id="custom-amount"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    min="1"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleDonation} 
                className="w-full h-14 text-lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Contribute via PayPal
              </Button>
              
              <p className="text-sm text-gray-500 text-center">
                Your contribution is not tax-deductible but is greatly appreciated.
              </p>
            </div>
          </Card>
        </div>
        
        <div className="space-y-8">
          <h3 className="text-2xl font-bold">Your Support Makes a Difference</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Regulatory Compliance Updates</h4>
                <p className="text-gray-600">
                  Your contribution helps us stay current with changing FDA, EU, and international 
                  nutrition labeling regulations, ensuring your labels remain compliant.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Enhanced Features</h4>
                <p className="text-gray-600">
                  We're constantly adding new features like barcode generation, additional label formats, 
                  and ingredient analysis tools to streamline your product development process.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <Coffee className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Reliable Service</h4>
                <p className="text-gray-600">
                  Your support helps maintain our infrastructure, ensuring the tool is available 
                  when you need it for your critical product launches and packaging updates.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Industry-Leading Accuracy</h4>
                <p className="text-gray-600">
                  We invest in maintaining the most accurate nutrition calculation algorithms 
                  and up-to-date USDA database integrations for your product formulations.
                </p>
              </div>
            </div>
          </div>
          
          {/* <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
            <h4 className="font-semibold mb-2 flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              Trusted by Food Manufacturers
            </h4>
            <p className="text-gray-600">
              "This tool has saved our company thousands in regulatory consulting fees. 
              The nutrition labels are always accurate and compliant with the latest FDA guidelines."
            </p>
            <p className="text-sm text-gray-500 mt-2">— Sarah J., Product Development Manager</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
