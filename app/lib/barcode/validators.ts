/**
 * Barcode validation utilities
 * 
 * This file contains functions for validating different barcode formats
 * and calculating check digits according to GS1 standards.
 * 
 * Includes validation for all barcode types in Phase 1, 2, and 3.
 */

/**
 * Validates a UPC-A barcode
 * UPC-A barcodes must be 11-12 digits
 * If 11 digits are provided, we can calculate the check digit
 */
export const validateUpcA = (code: string): boolean => {
  // Remove any spaces or dashes
  const cleanCode = code.replace(/[\s-]/g, '');
  
  // Check if the code is 11-12 digits
  if (!/^\d{11,12}$/.test(cleanCode)) {
    return false;
  }
  
  // If 12 digits, verify the check digit
  if (cleanCode.length === 12) {
    const codeWithoutCheck = cleanCode.slice(0, 11);
    const providedCheck = parseInt(cleanCode.slice(11), 10);
    const calculatedCheck = calculateUpcCheckDigit(codeWithoutCheck);
    
    return providedCheck === calculatedCheck;
  }
  
  // If 11 digits, it's valid (we'll calculate the check digit later)
  return true;
};

/**
 * Validates an EAN-13 barcode
 * EAN-13 barcodes must be 12-13 digits
 * If 12 digits are provided, we can calculate the check digit
 */
export const validateEan13 = (code: string): boolean => {
  // Remove any spaces or dashes
  const cleanCode = code.replace(/[\s-]/g, '');
  
  // Check if the code is 12-13 digits
  if (!/^\d{12,13}$/.test(cleanCode)) {
    return false;
  }
  
  // If 13 digits, verify the check digit
  if (cleanCode.length === 13) {
    const codeWithoutCheck = cleanCode.slice(0, 12);
    const providedCheck = parseInt(cleanCode.slice(12), 10);
    const calculatedCheck = calculateEanCheckDigit(codeWithoutCheck);
    
    return providedCheck === calculatedCheck;
  }
  
  // If 12 digits, it's valid (we'll calculate the check digit later)
  return true;
};

/**
 * Calculates the check digit for a UPC-A barcode
 * @param code 11-digit UPC code without check digit
 * @returns The check digit (0-9)
 */
export const calculateUpcCheckDigit = (code: string): number => {
  if (code.length !== 11 || !/^\d{11}$/.test(code)) {
    throw new Error('UPC-A code must be 11 digits');
  }
  
  const digits = code.split('').map(Number);
  
  // Step 1: Add digits in odd positions (1st, 3rd, 5th, etc.) and multiply by 3
  const oddSum = digits
    .filter((_, index) => index % 2 === 0)
    .reduce((sum, digit) => sum + digit, 0) * 3;
  
  // Step 2: Add digits in even positions (2nd, 4th, 6th, etc.)
  const evenSum = digits
    .filter((_, index) => index % 2 === 1)
    .reduce((sum, digit) => sum + digit, 0);
  
  // Step 3: Add the results from steps 1 and 2
  const totalSum = oddSum + evenSum;
  
  // Step 4: The check digit is the number that, when added to the sum, makes it a multiple of 10
  return (10 - (totalSum % 10)) % 10;
};

/**
 * Calculates the check digit for an EAN-13 barcode
 * @param code 12-digit EAN code without check digit
 * @returns The check digit (0-9)
 */
export const calculateEanCheckDigit = (code: string): number => {
  if (code.length !== 12 || !/^\d{12}$/.test(code)) {
    throw new Error('EAN-13 code must be 12 digits');
  }
  
  const digits = code.split('').map(Number);
  
  // Step 1: Add digits in even positions (2nd, 4th, 6th, etc.) and multiply by 3
  const evenSum = digits
    .filter((_, index) => index % 2 === 1)
    .reduce((sum, digit) => sum + digit, 0) * 3;
  
  // Step 2: Add digits in odd positions (1st, 3rd, 5th, etc.)
  const oddSum = digits
    .filter((_, index) => index % 2 === 0)
    .reduce((sum, digit) => sum + digit, 0);
  
  // Step 3: Add the results from steps 1 and 2
  const totalSum = oddSum + evenSum;
  
  // Step 4: The check digit is the number that, when added to the sum, makes it a multiple of 10
  return (10 - (totalSum % 10)) % 10;
};

/**
 * Formats a UPC-A barcode with proper spacing
 * Format: X-XXXXX-XXXXX-X
 */
export const formatUpcA = (code: string): string => {
  // Ensure we have a 12-digit code (add check digit if needed)
  let fullCode = code;
  if (code.length === 11) {
    const checkDigit = calculateUpcCheckDigit(code);
    fullCode = code + checkDigit;
  }
  
  // Format with dashes: X-XXXXX-XXXXX-X
  return `${fullCode.slice(0, 1)}-${fullCode.slice(1, 6)}-${fullCode.slice(6, 11)}-${fullCode.slice(11)}`;
};

/**
 * Formats an EAN-13 barcode with proper spacing
 * Format: XXX-XXXX-XXXX-X
 */
export const formatEan13 = (code: string): string => {
  // Ensure we have a 13-digit code (add check digit if needed)
  let fullCode = code;
  if (code.length === 12) {
    const checkDigit = calculateEanCheckDigit(code);
    fullCode = code + checkDigit;
  }
  
  // Format with dashes: XXX-XXXX-XXXX-X
  return `${fullCode.slice(0, 3)}-${fullCode.slice(3, 7)}-${fullCode.slice(7, 12)}-${fullCode.slice(12)}`;
};

// ===== PHASE 2 VALIDATORS =====

/**
 * Validates a GS1-128 barcode
 * GS1-128 is a flexible format that uses Application Identifiers (AIs)
 * This is a simplified validation that checks for proper format
 */
export const validateGs1128 = (code: string): boolean => {
  // GS1-128 should start with a valid Application Identifier in parentheses
  // Common AIs include (01) for GTIN, (10) for batch/lot, (17) for expiration date
  
  // Basic format check - must start with an AI in parentheses
  if (!/^\([0-9]{2}\)[0-9]+$/.test(code)) {
    return false;
  }
  
  // If it's an AI (01) for GTIN, validate the check digit
  if (code.startsWith('(01)')) {
    const gtin = code.substring(4); // Remove the (01) prefix
    
    // GTIN-14 must be 14 digits
    if (gtin.length !== 14) {
      return false;
    }
    
    // Validate the check digit
    const digits = gtin.slice(0, 13).split('').map(Number);
    const providedCheck = parseInt(gtin.slice(13), 10);
    
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    
    const calculatedCheck = (10 - (sum % 10)) % 10;
    return providedCheck === calculatedCheck;
  }
  
  // For other AIs, just check the basic format
  return true;
};

/**
 * Validates an ITF-14 barcode
 * ITF-14 is 14 digits, often used for shipping containers
 */
export const validateItf14 = (code: string): boolean => {
  // ITF-14 is always 14 digits
  if (!/^\d{14}$/.test(code)) {
    return false;
  }
  
  // Check digit validation (similar to EAN/UPC)
  const digits = code.slice(0, 13).split('').map(Number);
  const providedCheck = parseInt(code.slice(13), 10);
  
  // Weighted sum calculation
  let sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += digits[i] * (i % 2 === 0 ? 3 : 1);
  }
  
  const calculatedCheck = (10 - (sum % 10)) % 10;
  return providedCheck === calculatedCheck;
};

/**
 * Validates a Data Matrix barcode
 * Data Matrix can contain text or binary data
 * This is a simple validation that just checks for content
 */
export const validateDataMatrix = (code: string): boolean => {
  // Data Matrix can contain almost any text, but should not be empty
  // and typically has a reasonable length
  return code.trim().length > 0 && code.length <= 2335;
};

// ===== PHASE 3 VALIDATORS =====

/**
 * Validates a UPC-E barcode
 * UPC-E is a compressed version of UPC-A for small packages
 */
export const validateUpcE = (code: string): boolean => {
  // UPC-E is 8 digits (including check digit)
  // Or 6 digits (without check digit and number system)
  return /^\d{6,8}$/.test(code);
};

/**
 * Validates an EAN-8 barcode
 * EAN-8 is a shortened version of EAN-13 for small packages
 */
export const validateEan8 = (code: string): boolean => {
  // EAN-8 is 8 digits (including check digit)
  // Or 7 digits (without check digit)
  if (!/^\d{7,8}$/.test(code)) {
    return false;
  }
  
  // If 8 digits, verify the check digit
  if (code.length === 8) {
    const digits = code.slice(0, 7).split('').map(Number);
    const providedCheck = parseInt(code.slice(7), 10);
    
    // Weighted sum calculation (similar to EAN-13)
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    
    const calculatedCheck = (10 - (sum % 10)) % 10;
    return providedCheck === calculatedCheck;
  }
  
  // If 7 digits, it's valid (we'll calculate the check digit later)
  return true;
};

/**
 * Validates a GS1 DataBar barcode
 * GS1 DataBar is used for variable weight products and coupons
 */
export const validateGs1DataBar = (code: string): boolean => {
  // GS1 DataBar Expanded requires a properly formatted GS1 AI string
  // The format should be (01)012345678905 where the last digit is a valid check digit
  
  // Basic format check - must start with an AI (01) in parentheses
  if (!/^\(01\)[0-9]{13}$/.test(code)) {
    return false;
  }
  
  // Extract the GTIN-13 (including the leading 0)
  const gtin = code.substring(4); // Remove the (01) prefix
  
  // Validate the check digit
  const digits = gtin.slice(0, 12).split('').map(Number);
  const providedCheck = parseInt(gtin.slice(12), 10);
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += digits[i] * (i % 2 === 0 ? 1 : 3);
  }
  
  const calculatedCheck = (10 - (sum % 10)) % 10;
  return providedCheck === calculatedCheck;
};

/**
 * Formats an ITF-14 barcode with proper spacing
 * Format: XX-XXXXX-XXXXX-X
 */
export const formatItf14 = (code: string): string => {
  // ITF-14 is always 14 digits
  return `${code.slice(0, 2)}-${code.slice(2, 7)}-${code.slice(7, 12)}-${code.slice(12)}`;
};

/**
 * Formats an EAN-8 barcode with proper spacing
 * Format: XXXX-XXXX
 */
export const formatEan8 = (code: string): string => {
  // Ensure we have an 8-digit code
  let fullCode = code;
  if (code.length === 7) {
    // Calculate check digit (similar to EAN-13)
    const digits = code.split('').map(Number);
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      sum += digits[i] * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    fullCode = code + checkDigit;
  }
  
  // Format with dash: XXXX-XXXX
  return `${fullCode.slice(0, 4)}-${fullCode.slice(4)}`;
};

/**
 * Formats a UPC-E barcode with proper spacing
 * Format: X-XXXXX-X
 */
export const formatUpcE = (code: string): string => {
  // UPC-E is 8 digits including number system and check digit
  // If we have 6 digits, add number system 0 and calculate check digit
  let fullCode = code;
  if (code.length === 6) {
    // This is a simplified conversion - actual UPC-E to UPC-A conversion is more complex
    // For now, we'll just add a 0 prefix and a placeholder check digit
    fullCode = '0' + code + '0';
  }
  
  // Format with dashes: X-XXXXX-X
  return `${fullCode.slice(0, 1)}-${fullCode.slice(1, 6)}-${fullCode.slice(6)}`;
};
