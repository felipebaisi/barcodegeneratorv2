import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  defaults: {
    scale: parseInt(process.env.DEFAULT_SCALE || '3', 10),
    format: (process.env.DEFAULT_FORMAT || 'png') as 'png' | 'svg',
    eclevelPdf417: parseInt(process.env.DEFAULT_ECLEVEL_PDF417 || '2', 10),
    eclevelQr: (process.env.DEFAULT_ECLEVEL_QR || 'M') as 'L' | 'M' | 'Q' | 'H',
    rotation: parseInt(process.env.DEFAULT_ROTATION || '0', 10) as 0 | 90 | 180 | 270,
    fgColor: process.env.DEFAULT_FG_COLOR || '#000000',
    bgColor: process.env.DEFAULT_BG_COLOR || '#FFFFFF',
  },
};
