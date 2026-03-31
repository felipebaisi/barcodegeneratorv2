import { ValidationError } from './types';

/**
 * VIN validation per Code 39 spec
 * - Must be exactly 17 characters
 * - Uppercase alphanumeric only
 * - Excludes I, O, Q to avoid confusion with 1, 0
 * Reference: https://en.wikipedia.org/wiki/Vehicle_identification_number
 */
export function validateVin(vin: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!vin) {
    errors.push({ field: 'vin', message: 'VIN cannot be empty' });
    return errors;
  }

  if (vin.length !== 17) {
    errors.push({
      field: 'vin',
      message: `VIN must be exactly 17 characters (got ${vin.length})`,
    });
  }

  // Check for invalid characters (must be A-Z, 0-9, excluding I, O, Q)
  const validVinPattern = /^[A-HJ-NPR-Z0-9]+$/;
  if (!validVinPattern.test(vin)) {
    const invalidChars = vin
      .split('')
      .filter((c) => !/[A-HJ-NPR-Z0-9]/.test(c))
      .join(', ');
    errors.push({
      field: 'vin',
      message: `VIN contains invalid characters: ${invalidChars}. Valid characters are A-Z and 0-9, excluding I, O, Q.`,
    });
  }

  if (vin !== vin.toUpperCase()) {
    errors.push({
      field: 'vin',
      message: 'VIN must be uppercase',
    });
  }

  return errors;
}

/**
 * Validate barcode text is non-empty
 */
export function validateText(text: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!text || text.trim().length === 0) {
    errors.push({ field: 'text', message: 'Barcode text cannot be empty' });
  }

  return errors;
}

/**
 * Validate error correction level for PDF417 (0-8)
 */
export function validatePDF417ErrorLevel(level: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (level < 0 || level > 8) {
    errors.push({
      field: 'eclevel',
      message: 'PDF417 error correction level must be between 0 and 8',
    });
  }

  return errors;
}

/**
 * Validate QR error correction level (L, M, Q, H)
 */
export function validateQRErrorLevel(level: string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!['L', 'M', 'Q', 'H'].includes(level)) {
    errors.push({
      field: 'eclevel',
      message: "QR error correction level must be one of: 'L', 'M', 'Q', 'H'",
    });
  }

  return errors;
}

/**
 * Validate scale is positive
 */
export function validateScale(scale: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (scale <= 0 || !Number.isFinite(scale)) {
    errors.push({
      field: 'scale',
      message: 'Scale must be a positive number',
    });
  }

  return errors;
}
