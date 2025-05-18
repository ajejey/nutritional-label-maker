import { BarcodeType } from './constants';
import { calculateUpcCheckDigit, calculateEanCheckDigit } from './validators';

// Interface for barcode generation options
export interface BarcodeOptions {
  scale?: number;
  height?: number;
  includeText?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  background?: string;
  lineColor?: string;
  width?: number;
  margin?: number;
  quietZone?: number;
}

// This function will map our app's barcode types to bwip-js bcid values
export const mapBarcodeTypeToLibrary = (type: BarcodeType): string => {
  switch (type) {
    case 'upc-a':
      return 'upca';
    case 'ean-13':
      return 'ean13';
    case 'qr-code':
      return 'qrcode';
    case 'gs1-128':
      return 'gs1-128';
    case 'itf-14':
      return 'interleaved2of5';
    case 'datamatrix':
      return 'datamatrix';
    case 'upc-e':
      return 'upce';
    case 'ean-8':
      return 'ean8';
    case 'gs1-databar':
      return 'databarexpanded';
    default:
      return type;
  }
};

// Add check digit to UPC-A if needed
export const addUpcCheckDigit = (code: string): string => {
  // For 11-digit UPC-A, calculate and add the check digit
  if (code.length === 11) {
    const checkDigit = calculateUpcCheckDigit(code);
    return code + checkDigit.toString();
  }
  
  // If already 12 digits, return as is
  return code;
};

// Add check digit to EAN-13 if needed
export const addEanCheckDigit = (code: string): string => {
  // For 12-digit EAN-13, calculate and add the check digit
  if (code.length === 12) {
    const checkDigit = calculateEanCheckDigit(code);
    return code + checkDigit.toString();
  }
  
  // If already 13 digits, return as is
  return code;
};

// Format barcode data based on type
export const formatBarcodeData = (type: BarcodeType, data: string): string => {
  // Clean the data (remove any non-digit characters for numeric barcodes)
  let cleanData = data;
  if (['upc-a', 'ean-13', 'itf-14', 'upc-e', 'ean-8', 'gs1-databar'].includes(type)) {
    cleanData = data.replace(/[^0-9]/g, '');
  }
  
  switch (type) {
    // Phase 1 barcodes
    case 'upc-a':
      return addUpcCheckDigit(cleanData);
    case 'ean-13':
      return addEanCheckDigit(cleanData);
    case 'qr-code':
      return cleanData;
      
    // Phase 2 barcodes
    case 'gs1-128':
      // GS1-128 requires a properly formatted GS1 AI string
      // The format should be (01)12345678901231 where the last digit is a valid check digit
      // If it doesn't already have parentheses for AIs, we'll add (01) as default
      if (!cleanData.startsWith('(')) {
        // For AI 01, we need 14 digits (including check digit)
        // If less than 13 digits, pad with zeros
        let gtin = cleanData;
        if (gtin.length < 13) {
          gtin = gtin.padStart(13, '0');
        }
        
        // Calculate check digit for GTIN
        if (gtin.length === 13) {
          const digits = gtin.split('').map(Number);
          let sum = 0;
          for (let i = 0; i < 13; i++) {
            sum += digits[i] * (i % 2 === 0 ? 1 : 3);
          }
          const checkDigit = (10 - (sum % 10)) % 10;
          gtin = gtin + checkDigit;
        }
        
        return `(01)${gtin}`;
      }
      return cleanData;
    case 'itf-14':
      // ITF-14 is 14 digits, if less we pad with zeros
      let itfData = cleanData;
      if (itfData.length < 13) {
        itfData = itfData.padStart(13, '0');
      }
      
      // If exactly 13 digits, calculate and append the check digit
      if (itfData.length === 13) {
        const digits = itfData.split('').map(Number);
        let sum = 0;
        for (let i = 0; i < 13; i++) {
          sum += digits[i] * (i % 2 === 0 ? 3 : 1);
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        itfData = itfData + checkDigit;
      }
      
      return itfData;
    case 'datamatrix':
      return cleanData;
      
    // Phase 3 barcodes
    case 'upc-e':
      // UPC-E is a compressed version of UPC-A
      // For simplicity, we'll just ensure it's the right length
      if (cleanData.length === 6) {
        return '0' + cleanData;
      }
      return cleanData;
    case 'ean-8':
      // EAN-8 is 8 digits, if 7 digits we calculate check digit
      if (cleanData.length === 7) {
        // Calculate check digit (similar to EAN-13)
        const digits = cleanData.split('').map(Number);
        let sum = 0;
        for (let i = 0; i < 7; i++) {
          sum += digits[i] * (i % 2 === 0 ? 1 : 3);
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        return cleanData + checkDigit;
      }
      return cleanData;
    case 'gs1-databar':
      // GS1 DataBar Expanded format
      // For DataBar Expanded, we need to use a shorter GTIN-12 format
      // The format should be (01)0GTIN-12 where the last digit is a valid check digit
      if (!cleanData.startsWith('(')) {
        // For AI 01, we need 12 digits (plus check digit)
        let gtin = cleanData;
        
        // Trim to 12 digits if longer
        if (gtin.length > 12) {
          gtin = gtin.slice(-12);
        }
        
        // Pad to 12 digits if shorter
        if (gtin.length < 12) {
          gtin = gtin.padStart(12, '0');
        }
        
        // Calculate check digit for GTIN-12
        const digits = gtin.split('').map(Number);
        let sum = 0;
        for (let i = 0; i < 12; i++) {
          sum += digits[i] * (i % 2 === 0 ? 1 : 3);
        }
        const checkDigit = (10 - (sum % 10)) % 10;
        
        // Format for DataBar Expanded: (01)0 + 12 digits + check digit
        return `(01)0${gtin}${checkDigit}`;
      }
      return cleanData;
    default:
      return cleanData;
  }
};

// Convert our options to bwip-js options
export const convertToBwipOptions = (
  type: BarcodeType, 
  data: string, 
  options: BarcodeOptions
) => {
  const bcid = mapBarcodeTypeToLibrary(type);
  const formattedData = formatBarcodeData(type, data);
  
  // Base options for all barcode types
  const bwipOptions: Record<string, any> = {
    bcid,
    text: formattedData,
    scale: options.scale || 3,
    height: options.height || 10,
    includetext: options.includeText !== false,
    textxalign: options.textAlign || 'center',
    backgroundcolor: options.background || 'FFFFFF',
    barcolor: options.lineColor || '000000',
  };
  
  // Add quiet zone (white space) around the barcode
  if (options.quietZone !== undefined) {
    bwipOptions.paddingwidth = options.quietZone;
    bwipOptions.paddingheight = options.quietZone;
  } else {
    // Default quiet zones based on type
    if (type === 'upc-a' || type === 'ean-13') {
      bwipOptions.paddingwidth = 10;
      bwipOptions.paddingheight = 0;
    } else if (type === 'qr-code') {
      bwipOptions.paddingwidth = 4;
      bwipOptions.paddingheight = 4;
    }
  }
  
  // Type-specific options
  if (type === 'qr-code' || type === 'datamatrix') {
    // For 2D codes, we'll use a completely different set of options
    // Clear all previous options and set only what's needed
    return {
      bcid: mapBarcodeTypeToLibrary(type),
      text: formattedData,
      scale: 5,
      includetext: false,
      backgroundcolor: options.background || 'FFFFFF',
      barcolor: options.lineColor || '000000',
    };
  }
  
  // Special handling for GS1-128
  if (type === 'gs1-128') {
    bwipOptions.includetext = options.includeText !== false;
    bwipOptions.textxalign = 'center';
    bwipOptions.textyoffset = 3;
    bwipOptions.height = options.height || 15;
  }
  
  // Special handling for ITF-14
  if (type === 'itf-14') {
    bwipOptions.includetext = options.includeText !== false;
    bwipOptions.textxalign = 'center';
    bwipOptions.height = options.height || 20;
    bwipOptions.bearerbars = true; // Add bearer bars for ITF-14
  }
  
  // Special handling for UPC-E and EAN-8 (smaller barcodes)
  if (type === 'upc-e' || type === 'ean-8') {
    bwipOptions.includetext = options.includeText !== false;
    bwipOptions.textxalign = 'center';
    bwipOptions.height = options.height || 12;
    bwipOptions.textsize = 10;
  }
  
  // Special handling for GS1 DataBar
  if (type === 'gs1-databar') {
    bwipOptions.includetext = options.includeText !== false;
    bwipOptions.textxalign = 'center';
    bwipOptions.height = options.height || 15;
  }
  
  return bwipOptions;
};
