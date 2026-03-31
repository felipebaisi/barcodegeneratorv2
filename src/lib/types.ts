export type BarcodeType = 'pdf417' | 'code39' | 'qrcode';
export type OutputFormat = 'png' | 'svg';
export type QRErrorLevel = 'L' | 'M' | 'Q' | 'H';

export interface BarcodeOptions {
  type: BarcodeType;
  text: string;
  format: OutputFormat;
  scale?: number;
  eclevel?: number | QRErrorLevel;
  mod43?: boolean;
  includeText?: boolean;
}

export interface GeneratorResult {
  buffer?: Buffer;
  svg?: string;
  format: OutputFormat;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiGenerateRequest {
  type: BarcodeType;
  text: string;
  format: OutputFormat;
  options?: {
    scale?: number;
    eclevel?: number | QRErrorLevel;
    mod43?: boolean;
  };
}
