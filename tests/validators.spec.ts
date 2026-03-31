import {
  validateVin,
  validateText,
  validatePDF417ErrorLevel,
  validateQRErrorLevel,
  validateScale,
} from '../src/lib/validators';

describe('validators', () => {
  describe('validateVin', () => {
    it('should accept valid VIN', () => {
      const validVin = '1HGCM82633A004352';
      const errors = validateVin(validVin);
      expect(errors).toHaveLength(0);
    });

    it('should reject VIN with wrong length', () => {
      const errors = validateVin('1HGCM826');
      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe('vin');
      expect(errors[0].message).toContain('17 characters');
    });

    it('should reject VIN with invalid characters (I, O, Q)', () => {
      const errors = validateVin('1HGCM82633A00435I');
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes('invalid characters'))).toBe(true);
    });

    it('should reject lowercase VIN', () => {
      const errors = validateVin('1hgcm82633a004352');
      expect(errors.some((e) => e.message.includes('uppercase'))).toBe(true);
    });

    it('should reject empty VIN', () => {
      const errors = validateVin('');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('cannot be empty');
    });

    it('should reject VIN with special characters', () => {
      const errors = validateVin('1HGCM82633A00435@');
      expect(errors.some((e) => e.message.includes('invalid characters'))).toBe(true);
    });
  });

  describe('validateText', () => {
    it('should accept non-empty text', () => {
      const errors = validateText('Hello World');
      expect(errors).toHaveLength(0);
    });

    it('should reject empty text', () => {
      const errors = validateText('');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('cannot be empty');
    });

    it('should reject whitespace-only text', () => {
      const errors = validateText('   ');
      expect(errors).toHaveLength(1);
    });
  });

  describe('validatePDF417ErrorLevel', () => {
    it('should accept valid levels (0-8)', () => {
      for (let i = 0; i <= 8; i++) {
        const errors = validatePDF417ErrorLevel(i);
        expect(errors).toHaveLength(0);
      }
    });

    it('should reject negative level', () => {
      const errors = validatePDF417ErrorLevel(-1);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('between 0 and 8');
    });

    it('should reject level > 8', () => {
      const errors = validatePDF417ErrorLevel(9);
      expect(errors).toHaveLength(1);
    });
  });

  describe('validateQRErrorLevel', () => {
    it('should accept valid levels (L, M, Q, H)', () => {
      ['L', 'M', 'Q', 'H'].forEach((level) => {
        const errors = validateQRErrorLevel(level);
        expect(errors).toHaveLength(0);
      });
    });

    it('should reject invalid level', () => {
      const errors = validateQRErrorLevel('X');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain("'L', 'M', 'Q', 'H'");
    });
  });

  describe('validateScale', () => {
    it('should accept positive numbers', () => {
      const errors = validateScale(2.5);
      expect(errors).toHaveLength(0);
    });

    it('should reject zero', () => {
      const errors = validateScale(0);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('positive');
    });

    it('should reject negative numbers', () => {
      const errors = validateScale(-1);
      expect(errors).toHaveLength(1);
    });

    it('should reject infinity', () => {
      const errors = validateScale(Infinity);
      expect(errors).toHaveLength(1);
    });
  });

});
