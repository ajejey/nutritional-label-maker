// Define the barcode types we support
export type BarcodeType = 
  // Phase 1 types
  | 'upc-a'      // Standard retail barcode in the US
  | 'ean-13'     // International standard for retail products
  | 'qr-code'    // For consumer engagement and digital linking
  // Phase 2 types
  | 'gs1-128'    // For logistics with additional data
  | 'itf-14'     // For shipping cartons and cases
  | 'datamatrix' // For small packaging with limited space
  // Phase 3 types
  | 'upc-e'      // Condensed UPC for small packages
  | 'ean-8'      // Condensed EAN for small packages
  | 'gs1-databar'; // For variable weight products and coupons

// Barcode type information for the UI
export interface BarcodeTypeInfo {
  id: BarcodeType;
  name: string;
  description: string;
  category: 'retail' | 'logistics' | 'consumer';
  example: string; // Example data for this barcode type
  validator: (data: string) => boolean;
  formatter?: (data: string) => string;
  placeholderText: string;
}

import { 
  validateUpcA, validateEan13, formatUpcA, formatEan13,
  validateGs1128, validateItf14, validateDataMatrix,
  validateUpcE, validateEan8, validateGs1DataBar,
  formatItf14, formatEan8, formatUpcE
} from './validators';

// Validation function for QR Code
const validateQrCode = (data: string): boolean => {
  // QR Code can contain almost any text, but should not be empty
  return data.trim().length > 0;
};

// Barcode type definitions
export const barcodeTypes: BarcodeTypeInfo[] = [
  // Phase 1 - Retail Barcodes
  {
    id: 'upc-a',
    name: 'UPC-A',
    description: 'Standard retail barcode in the US',
    category: 'retail',
    example: '012345678905',
    validator: validateUpcA,
    formatter: formatUpcA,
    placeholderText: '12 digits (e.g., 012345678905)',
  },
  {
    id: 'ean-13',
    name: 'EAN-13',
    description: 'International standard for retail products',
    category: 'retail',
    example: '5901234123457',
    validator: validateEan13,
    formatter: formatEan13,
    placeholderText: '13 digits (e.g., 5901234123457)',
  },
  
  // Phase 3 - Small Package Retail Barcodes
  {
    id: 'upc-e',
    name: 'UPC-E',
    description: 'Condensed UPC for small packages',
    category: 'retail',
    example: '01234565',
    validator: validateUpcE,
    formatter: formatUpcE,
    placeholderText: '6-8 digits (e.g., 01234565)',
  },
  {
    id: 'ean-8',
    name: 'EAN-8',
    description: 'Condensed EAN for small packages',
    category: 'retail',
    example: '12345670',
    validator: validateEan8,
    formatter: formatEan8,
    placeholderText: '7-8 digits (e.g., 12345670)',
  },
  
  // Phase 2 - Logistics Barcodes
  {
    id: 'gs1-128',
    name: 'GS1-128',
    description: 'For logistics with additional data',
    category: 'logistics',
    example: '(01)00012345678905',
    validator: validateGs1128,
    placeholderText: 'Format: (01)GTIN-14 (e.g., (01)00012345678905)',
  },
  {
    id: 'itf-14',
    name: 'ITF-14',
    description: 'For shipping cartons and cases',
    category: 'logistics',
    example: '12345678901234',
    validator: validateItf14,
    formatter: formatItf14,
    placeholderText: '14 digits (e.g., 12345678901234)',
  },
  
  // Phase 3 - Variable Weight Products
  {
    id: 'gs1-databar',
    name: 'GS1 DataBar',
    description: 'For variable weight products',
    category: 'logistics',
    example: '(01)012345678905',
    validator: validateGs1DataBar,
    placeholderText: 'Format: (01)0 + 12 digits + check digit (e.g., (01)012345678905)',
  },
  
  // Phase 2 - 2D Codes
  {
    id: 'datamatrix',
    name: 'Data Matrix',
    description: 'For small packaging with limited space',
    category: 'consumer',
    example: 'DATAMATRIX-123456',
    validator: validateDataMatrix,
    placeholderText: 'Text or data (e.g., DATAMATRIX-123456)',
  },
  
  // Phase 1 - Consumer Engagement
  {
    id: 'qr-code',
    name: 'QR Code',
    description: 'For consumer engagement and digital linking',
    category: 'consumer',
    example: 'https://example.com/product-info',
    validator: validateQrCode,
    placeholderText: 'URL or text (e.g., https://example.com/product-info)',
  },
];

// Get barcode type info by ID
export const getBarcodeTypeInfo = (typeId: BarcodeType): BarcodeTypeInfo => {
  const typeInfo = barcodeTypes.find(type => type.id === typeId);
  if (!typeInfo) {
    throw new Error(`Barcode type ${typeId} not found`);
  }
  return typeInfo;
};
