import { generatePng, generateSvg, generate } from '../src/lib/generator';
import { BarcodeOptions } from '../src/lib/types';

describe('generator', () => {
  describe('generatePng', () => {
    it('should generate PDF417 PNG', async () => {
      const options: BarcodeOptions = {
        type: 'pdf417',
        text: 'ABC123',
        format: 'png',
        scale: 2,
        eclevel: 2,
      };

      const buffer = await generatePng(options);
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      // Check PNG signature
      expect(buffer.toString('hex', 0, 8)).toBe('89504e470d0a1a0a');
    });

    it('should generate QR Code PNG', async () => {
      const options: BarcodeOptions = {
        type: 'qrcode',
        text: 'https://example.com',
        format: 'png',
        scale: 3,
        eclevel: 'M',
      };

      const buffer = await generatePng(options);
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
      expect(buffer.toString('hex', 0, 8)).toBe('89504e470d0a1a0a');
    });

    it('should generate Code 39 (VIN) PNG', async () => {
      const options: BarcodeOptions = {
        type: 'code39',
        text: '1HGCM82633A004352',
        format: 'png',
        scale: 2,
        mod43: true,
      };

      const buffer = await generatePng(options);
      expect(buffer).toBeInstanceOf(Buffer);
      expect(buffer.length).toBeGreaterThan(0);
    });



    it('should reject invalid VIN', async () => {
      const options: BarcodeOptions = {
        type: 'code39',
        text: 'INVALID', // Too short
        format: 'png',
        scale: 2,
      };

      await expect(generatePng(options)).rejects.toThrow(/Validation failed/);
    });

    it('should reject empty text', async () => {
      const options: BarcodeOptions = {
        type: 'qrcode',
        text: '',
        format: 'png',
        scale: 2,
      };

      await expect(generatePng(options)).rejects.toThrow(/cannot be empty/);
    });
  });

  describe('generateSvg', () => {
    it('should generate PDF417 SVG', async () => {
      const options: BarcodeOptions = {
        type: 'pdf417',
        text: 'SVG Test',
        format: 'svg',
        scale: 2,
      };

      const svg = await generateSvg(options);
      expect(typeof svg).toBe('string');
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    });

    it('should generate QR Code SVG', async () => {
      const options: BarcodeOptions = {
        type: 'qrcode',
        text: 'https://example.com',
        format: 'svg',
        scale: 2,
      };

      const svg = await generateSvg(options);
      expect(typeof svg).toBe('string');
      expect(svg).toContain('<svg');
    });

    it('should generate Code 39 SVG', async () => {
      const options: BarcodeOptions = {
        type: 'code39',
        text: '1HGCM82633A004352',
        format: 'svg',
        scale: 2,
      };

      const svg = await generateSvg(options);
      expect(typeof svg).toBe('string');
      expect(svg).toContain('<svg');
    });
  });

  describe('generate', () => {
    it('should generate PNG when format is png', async () => {
      const options: BarcodeOptions = {
        type: 'qrcode',
        text: 'Test',
        format: 'png',
        scale: 2,
      };

      const result = await generate(options);
      expect(result.format).toBe('png');
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.svg).toBeUndefined();
    });

    it('should generate SVG when format is svg', async () => {
      const options: BarcodeOptions = {
        type: 'qrcode',
        text: 'Test',
        format: 'svg',
        scale: 2,
      };

      const result = await generate(options);
      expect(result.format).toBe('svg');
      expect(result.svg).toBeDefined();
      expect(typeof result.svg).toBe('string');
      expect(result.buffer).toBeUndefined();
    });
  });
});
