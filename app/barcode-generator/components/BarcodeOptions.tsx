'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BarcodeType } from '../../lib/barcode/constants';
import type { BarcodeOptions } from '../../lib/barcode/generators';

interface BarcodeOptionsProps {
  barcodeType: BarcodeType;
  options: BarcodeOptions;
  onOptionsChange: (options: Partial<BarcodeOptions>) => void;
}

const BarcodeOptions: React.FC<BarcodeOptionsProps> = ({
  barcodeType,
  options,
  onOptionsChange,
}) => {
  const handleScaleChange = (value: number[]) => {
    onOptionsChange({ scale: value[0] });
  };

  const handleHeightChange = (value: number[]) => {
    onOptionsChange({ height: value[0] });
  };

  const handleIncludeTextChange = (checked: boolean) => {
    onOptionsChange({ includeText: checked });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({ lineColor: e.target.value });
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({ background: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Scale */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="scale">Scale</Label>
          <span className="text-sm text-gray-500">{options.scale}x</span>
        </div>
        <Slider
          id="scale"
          min={1}
          max={10}
          step={1}
          value={[options.scale || 3]}
          onValueChange={handleScaleChange}
        />
      </div>

      {/* Height (only for 1D barcodes) */}
      {barcodeType !== 'qr-code' && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="height">Height</Label>
            <span className="text-sm text-gray-500">{options.height} units</span>
          </div>
          <Slider
            id="height"
            min={5}
            max={30}
            step={1}
            value={[options.height || 10]}
            onValueChange={handleHeightChange}
          />
        </div>
      )}

      {/* Include Text (only for 1D barcodes) */}
      {barcodeType !== 'qr-code' && (
        <div className="flex items-center justify-between">
          <Label htmlFor="include-text" className="cursor-pointer">
            Show Text
          </Label>
          <Switch
            id="include-text"
            checked={options.includeText !== false}
            onCheckedChange={handleIncludeTextChange}
          />
        </div>
      )}

      {/* Colors */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="line-color">Barcode Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="line-color"
              type="color"
              value={options.lineColor || '#000000'}
              onChange={handleColorChange}
              className="w-12 h-8 p-1"
            />
            <span className="text-sm text-gray-500">
              {options.lineColor || '#000000'}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="background-color">Background Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="background-color"
              type="color"
              value={options.background || '#FFFFFF'}
              onChange={handleBackgroundChange}
              className="w-12 h-8 p-1"
            />
            <span className="text-sm text-gray-500">
              {options.background || '#FFFFFF'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium mb-2">Barcode Settings</h4>
        <div className="text-xs text-gray-500 space-y-1">
          {barcodeType === 'upc-a' && (
            <>
              <p>• UPC-A requires exactly 12 digits</p>
              <p>• First digit is the number system</p>
              <p>• Last digit is the check digit (calculated automatically)</p>
            </>
          )}
          {barcodeType === 'ean-13' && (
            <>
              <p>• EAN-13 requires exactly 13 digits</p>
              <p>• First 2-3 digits are the country code</p>
              <p>• Last digit is the check digit (calculated automatically)</p>
            </>
          )}
          {barcodeType === 'qr-code' && (
            <>
              <p>• QR codes can contain text, URLs, or contact info</p>
              <p>• Larger scale improves readability</p>
              <p>• High contrast colors work best</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeOptions;
