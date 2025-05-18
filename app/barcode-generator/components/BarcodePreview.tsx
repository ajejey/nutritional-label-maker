'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Copy, ZoomIn, ZoomOut } from 'lucide-react';
import { BarcodeType } from '../../lib/barcode/constants';
import { BarcodeOptions, convertToBwipOptions } from '../../lib/barcode/generators';
import type { BwipOptions } from 'bwip-js';

// We'll need to install bwip-js
// npm install bwip-js

interface BarcodePreviewProps {
  barcodeType: BarcodeType;
  barcodeData: string;
  options: BarcodeOptions;
}

const BarcodePreview: React.FC<BarcodePreviewProps> = ({
  barcodeType,
  barcodeData,
  options,
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Clean up URL objects when component unmounts or when generating new barcodes
  useEffect(() => {
    return () => {
      if (svgUrl) {
        URL.revokeObjectURL(svgUrl);
      }
    };
  }, [svgUrl]);

  useEffect(() => {
    const generateBarcode = async () => {
      // Don't try to generate if there's no data
      if (!barcodeData) {
        setSvgContent('');
        return;
      }

      setIsGenerating(true);
      setError(null);

      try {
        // We'll use dynamic import to load bwip-js only when needed
        const bwipjs = await import('bwip-js');
        
        // Convert our options to bwip-js format
        const bwipOptions = convertToBwipOptions(barcodeType, barcodeData, options);
        
        console.log('Generating barcode with options:', bwipOptions);
        
        // Generate SVG
        const svg = bwipjs.toSVG(bwipOptions as BwipOptions);
        setSvgContent(svg);
        
        // Create a blob URL for displaying the SVG
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        setSvgUrl(url);
        setError(null);
      } catch (err) {
        console.error('Error generating barcode:', err);
        
        // More descriptive error message based on barcode type
        if (barcodeType === 'qr-code') {
          setError('Failed to generate QR code. Please enter a valid URL or text.');
        } else if (barcodeType === 'upc-a') {
          setError('Failed to generate UPC-A barcode. Please enter exactly 11 or 12 digits.');
        } else if (barcodeType === 'ean-13') {
          setError('Failed to generate EAN-13 barcode. Please enter exactly 12 or 13 digits.');
        } else {
          setError('Failed to generate barcode. Please check your input data.');
        }
        
        setSvgContent('');
        setSvgUrl('');
      } finally {
        setIsGenerating(false);
      }
    };

    generateBarcode();
  }, [barcodeType, barcodeData, options]);

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `barcode-${barcodeType}-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = async () => {
    if (!svgContent) return;
    
    // Convert SVG to PNG
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const pngUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `barcode-${barcodeType}-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(pngUrl);
      }, 'image/png');
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  const handleCopyToClipboard = async () => {
    if (!svgContent) return;
    
    try {
      // For modern browsers
      if (navigator.clipboard && window.ClipboardItem) {
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
        const clipboardItem = new ClipboardItem({ 'image/svg+xml': svgBlob });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = svgContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      
      // Show success message (in a real app, you'd use a toast notification)
      alert('Barcode copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="bg-gray-50 border rounded-lg p-4 min-h-[200px]"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        {isGenerating ? (
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Generating barcode...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : !barcodeData ? (
          <div className="text-center text-gray-500">
            <p>Enter barcode data to generate a preview</p>
          </div>
        ) : svgUrl ? (
          <div className="max-w-full overflow-hidden transition-transform duration-200">
            <img src={svgUrl} alt={`${barcodeType} barcode`} className="max-w-full w-full" />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p>No barcode generated</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            disabled={!svgContent}
          >
            <ZoomOut className="h-4 w-4 mr-1" />
            Zoom Out
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            disabled={!svgContent}
          >
            <ZoomIn className="h-4 w-4 mr-1" />
            Zoom In
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyToClipboard}
            disabled={!svgContent}
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadSvg}
            disabled={!svgContent}
          >
            <Download className="h-4 w-4 mr-1" />
            SVG
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleDownloadPng}
            disabled={!svgContent}
          >
            <Download className="h-4 w-4 mr-1" />
            PNG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BarcodePreview;
