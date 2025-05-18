'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { BarcodeType, barcodeTypes } from '../../lib/barcode/constants';
import { Barcode, QrCode, Package, Box, ShoppingBag } from 'lucide-react';

interface BarcodeTypesProps {
  selectedType: BarcodeType;
  onSelectType: (type: BarcodeType) => void;
}

const BarcodeTypes: React.FC<BarcodeTypesProps> = ({ 
  selectedType, 
  onSelectType 
}) => {
  // Group barcode types by category
  const retailBarcodes = barcodeTypes.filter(type => type.category === 'retail');
  const logisticsBarcodes = barcodeTypes.filter(type => type.category === 'logistics');
  const consumerBarcodes = barcodeTypes.filter(type => type.category === 'consumer');

  // Get icon based on barcode type
  const getBarcodeIcon = (type: BarcodeType) => {
    switch (type) {
      case 'qr-code':
      case 'datamatrix':
        return <QrCode className="w-6 h-6 text-primary" />;
      case 'gs1-128':
      case 'itf-14':
      case 'gs1-databar':
        return <Box className="w-6 h-6 text-primary" />;
      case 'upc-e':
      case 'ean-8':
        return <Package className="w-6 h-6 text-primary" />;
      default:
        return <Barcode className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Retail Barcodes</h3>
        <div className="grid grid-cols-2 gap-3">
          {retailBarcodes.map((type) => (
            <Card 
              key={type.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedType === type.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectType(type.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  {getBarcodeIcon(type.id)}
                </div>
                <h4 className="font-medium">{type.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Logistics & Shipping</h3>
        <div className="grid grid-cols-2 gap-3">
          {logisticsBarcodes.map((type) => (
            <Card 
              key={type.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedType === type.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectType(type.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  {getBarcodeIcon(type.id)}
                </div>
                <h4 className="font-medium">{type.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Consumer Engagement</h3>
        <div className="grid grid-cols-2 gap-3">
          {consumerBarcodes.map((type) => (
            <Card 
              key={type.id}
              className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedType === type.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectType(type.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  {getBarcodeIcon(type.id)}
                </div>
                <h4 className="font-medium">{type.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{type.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Which barcode should I use?</h4>
        <p className="text-sm text-blue-700">
          <strong>For retail products:</strong> Use UPC-A (US) or EAN-13 (international). For small packages, use UPC-E or EAN-8.<br/>
          <strong>For shipping & logistics:</strong> Use GS1-128 or ITF-14 for cartons and cases.<br/>
          <strong>For consumer engagement:</strong> Use QR Codes or Data Matrix to link to websites or provide additional information.
        </p>
      </div>
    </div>
  );
};

export default BarcodeTypes;
