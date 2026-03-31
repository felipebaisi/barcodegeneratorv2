#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { generate } from '../lib/generator';
import { BarcodeOptions, BarcodeType, OutputFormat, QRErrorLevel } from '../lib/types';
import { logger } from '../utils/logger';
import { config } from '../config/env';

const program = new Command();

program
  .name('barcode-gen')
  .description('Generate barcodes (PDF417, Code 39/VIN, QR) as PNG or SVG')
  .version('1.0.0');

program
  .requiredOption('-t, --type <type>', 'Barcode type: pdf417, code39, qrcode')
  .requiredOption('-x, --text <text>', 'Text to encode in the barcode')
  .requiredOption('-o, --out <path>', 'Output file path')
  .option('-f, --format <format>', 'Output format: png or svg', config.defaults.format)
  .option('-s, --scale <number>', 'Scale factor', String(config.defaults.scale))
  .option('-e, --eclevel <level>', 'Error correction level (PDF417: 0-8, QR: L/M/Q/H)')
  .option('--mod43', 'Enable Mod 43 checksum for Code 39 (VIN)', false)
  .option('--include-text', 'Include human-readable text below barcode', true)
  .action(async (options) => {
    try {
      // Validate type
      const type = options.type as BarcodeType;
      if (!['pdf417', 'code39', 'qrcode'].includes(type)) {
        logger.error('Invalid barcode type. Must be: pdf417, code39, or qrcode');
        process.exit(1);
      }

      // Validate format
      const format = options.format as OutputFormat;
      if (!['png', 'svg'].includes(format)) {
        logger.error('Invalid format. Must be: png or svg');
        process.exit(1);
      }

      // Parse numeric options
      const scale = parseInt(options.scale, 10);

      // Parse error correction level
      let eclevel: number | QRErrorLevel | undefined;
      if (options.eclevel) {
        if (type === 'pdf417') {
          eclevel = parseInt(options.eclevel, 10);
        } else if (type === 'qrcode') {
          eclevel = options.eclevel.toUpperCase() as QRErrorLevel;
        }
      } else {
        // Set defaults
        if (type === 'pdf417') {
          eclevel = config.defaults.eclevelPdf417;
        } else if (type === 'qrcode') {
          eclevel = config.defaults.eclevelQr;
        }
      }

      // Build options
      const barcodeOptions: BarcodeOptions = {
        type,
        text: options.text,
        format,
        scale,
        eclevel,
        mod43: options.mod43,
        includeText: options.includeText,
      };

      // Generate barcode
      const result = await generate(barcodeOptions);

      // Ensure output directory exists
      const outDir = path.dirname(options.out);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }

      // Write output file
      if (result.format === 'png' && result.buffer) {
        fs.writeFileSync(options.out, result.buffer);
      } else if (result.format === 'svg' && result.svg) {
        fs.writeFileSync(options.out, result.svg, 'utf-8');
      }

      logger.info(`Successfully generated ${type} barcode: ${options.out}`);
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Failed to generate barcode');
      console.error(`Error: ${(error as Error).message}`);
      process.exit(2);
    }
  });

program.parse();
