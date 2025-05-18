'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';
import { BarcodeType, getBarcodeTypeInfo } from '../../lib/barcode/constants';
import { BarcodeOptions } from '../../lib/barcode/generators';
import { calculateUpcCheckDigit, calculateEanCheckDigit } from '../../lib/barcode/validators';

interface BarcodeFormProps {
  barcodeType: BarcodeType;
  onDataChange: (data: string) => void;
  onOptionsChange: (options: Partial<BarcodeOptions>) => void;
}

const BarcodeForm: React.FC<BarcodeFormProps> = ({
  barcodeType,
  onDataChange,
  onOptionsChange,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const typeInfo = getBarcodeTypeInfo(barcodeType);

  // Reset form when barcode type changes
  useEffect(() => {
    setInputValue('');
    setFormattedValue('');
    setError(null);
    setInfo(null);
    onDataChange('');
  }, [barcodeType, onDataChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters for UPC and EAN codes
    let value = e.target.value;
    if (barcodeType === 'upc-a' || barcodeType === 'ean-13') {
      value = value.replace(/[^0-9]/g, '');
    }
    
    setInputValue(value);
    
    // Validate input
    if (value && !typeInfo.validator(value)) {
      setError(`Invalid format for ${typeInfo.name}. ${typeInfo.placeholderText}`);
      setInfo(null);
      setFormattedValue('');
      onDataChange('');
    } else {
      setError(null);
      
      // Format the value if a formatter exists
      if (value && typeInfo.formatter) {
        const formatted = typeInfo.formatter(value);
        setFormattedValue(formatted);
      } else {
        setFormattedValue('');
      }
      
      // Show check digit info for UPC-A and EAN-13
      if (value) {
        if (barcodeType === 'upc-a' && value.length === 11) {
          const checkDigit = calculateUpcCheckDigit(value);
          setInfo(`Check digit: ${checkDigit} (will be added automatically)`); 
        } else if (barcodeType === 'ean-13' && value.length === 12) {
          const checkDigit = calculateEanCheckDigit(value);
          setInfo(`Check digit: ${checkDigit} (will be added automatically)`);
        } else {
          setInfo(null);
        }
      } else {
        setInfo(null);
      }
      
      onDataChange(value);
    }
  };

  const handleGenerateExample = () => {
    setInputValue(typeInfo.example);
    setError(null);
    setInfo(null);
    
    // Format the example if a formatter exists
    if (typeInfo.formatter) {
      setFormattedValue(typeInfo.formatter(typeInfo.example));
    } else {
      setFormattedValue('');
    }
    
    onDataChange(typeInfo.example);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="barcode-data" className="text-sm font-medium">
          Enter {typeInfo.name} Data
        </label>
        <Input
          id="barcode-data"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={typeInfo.placeholderText}
          className="w-full"
        />
        
        {formattedValue && (
          <div className="text-sm text-gray-600 mt-1">
            Formatted: <span className="font-mono">{formattedValue}</span>
          </div>
        )}
        
        {info && (
          <Alert className="py-2 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs ml-2 text-blue-700">
              {info}
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs ml-2">
              {error}
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateExample}
          className="text-xs"
        >
          Use Example
        </Button>
        
        <div className="text-xs text-gray-500">
          {barcodeType === 'upc-a' && (
            <span>UPC-A requires 11-12 digits</span>
          )}
          {barcodeType === 'ean-13' && (
            <span>EAN-13 requires 12-13 digits</span>
          )}
          {barcodeType === 'qr-code' && (
            <span>Enter any text or URL</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeForm;
