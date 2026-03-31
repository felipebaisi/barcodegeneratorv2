import bwipjs from 'bwip-js';
import { BarcodeOptions, GeneratorResult } from './types';
import {
  validateVin,
  validateText,
  validatePDF417ErrorLevel,
  validateQRErrorLevel,
  validateScale,
} from './validators';
import { logger } from '../utils/logger';

/**
 * Generate barcode as PNG buffer
 */
export async function generatePng(options: BarcodeOptions): Promise<Buffer> {
  validateOptions(options);

  const bwipOptions = buildBwipOptions(options);

  try {
    logger.info({ type: options.type, text: options.text }, 'Generating PNG barcode');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const png = await bwipjs.toBuffer(bwipOptions as any);
    return png as Buffer;
  } catch (error) {
    logger.error({ error, options: bwipOptions }, 'Failed to generate PNG barcode');
    throw new Error(`Failed to generate PNG barcode: ${(error as Error).message}`);
  }
}

/**
 * Generate barcode as SVG string
 */
export async function generateSvg(options: BarcodeOptions): Promise<string> {
  validateOptions(options);

  const bwipOptions = buildBwipOptions(options);

  try {
    logger.info({ type: options.type, text: options.text }, 'Generating SVG barcode');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svg = await bwipjs.toSVG(bwipOptions as any);
    return svg as string;
  } catch (error) {
    logger.error({ error, options: bwipOptions }, 'Failed to generate SVG barcode');
    throw new Error(`Failed to generate SVG barcode: ${(error as Error).message}`);
  }
}

/**
 * Generate barcode in requested format
 */
export async function generate(options: BarcodeOptions): Promise<GeneratorResult> {
  if (options.format === 'png') {
    const buffer = await generatePng(options);
    return { buffer, format: 'png' };
  } else {
    const svg = await generateSvg(options);
    return { svg, format: 'svg' };
  }
}

/**
 * Validate all options before generation
 */
function validateOptions(options: BarcodeOptions): void {
  const errors = [];

  // Validate text
  errors.push(...validateText(options.text));

  // VIN-specific validation for Code 39
  if (options.type === 'code39') {
    errors.push(...validateVin(options.text));
  }

  // Validate scale
  if (options.scale !== undefined) {
    errors.push(...validateScale(options.scale));
  }

  // Validate error correction level
  if (options.eclevel !== undefined) {
    if (options.type === 'pdf417' && typeof options.eclevel === 'number') {
      errors.push(...validatePDF417ErrorLevel(options.eclevel));
    } else if (options.type === 'qrcode' && typeof options.eclevel === 'string') {
      errors.push(...validateQRErrorLevel(options.eclevel));
    }
  }

  if (errors.length > 0) {
    const errorMessages = errors.map((e) => `${e.field}: ${e.message}`).join('; ');
    throw new Error(`Validation failed: ${errorMessages}`);
  }
}

/**
 * Build bwip-js options from our generic options
 */
function buildBwipOptions(options: BarcodeOptions): Record<string, unknown> {
  const bwipOptions: Record<string, unknown> = {
    bcid: options.type,
    text: options.text,
  };

  // Scale
  if (options.scale !== undefined) {
    bwipOptions.scale = options.scale;
  }

  // Type-specific options
  switch (options.type) {
    case 'pdf417':
      if (options.eclevel !== undefined && typeof options.eclevel === 'number') {
        bwipOptions.eclevel = options.eclevel;
      }
      bwipOptions.includetext = false;
      break;

    case 'code39':
      if (options.mod43) {
        bwipOptions.includecheck = true;
      }
      bwipOptions.includetext = options.includeText !== false; // Show VIN text by default
      break;

    case 'qrcode':
      if (options.eclevel && typeof options.eclevel === 'string') {
        bwipOptions.eclevel = options.eclevel;
      }
      bwipOptions.includetext = false;
      break;
  }

  return bwipOptions;
}
