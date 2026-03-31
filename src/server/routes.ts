import { Router, Request, Response, NextFunction } from 'express';
import { generate } from '../lib/generator';
import { BarcodeOptions } from '../lib/types';
import { GenerateRequestSchema } from './schemas';
import { logger } from '../utils/logger';
import { config } from '../config/env';

const router = Router();

/**
 * GET /health - Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /generate - Generate barcode
 */
router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = GenerateRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validationResult.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }

    const { type, text, format, options = {} } = validationResult.data;

    // Build barcode options with defaults
    const barcodeOptions: BarcodeOptions = {
      type,
      text,
      format,
      scale: options.scale ?? config.defaults.scale,
      eclevel:
        options.eclevel ??
        (type === 'pdf417' ? config.defaults.eclevelPdf417 : config.defaults.eclevelQr),
      mod43: options.mod43 ?? false,
    };

    logger.info({ type, format }, 'Generating barcode via API');

    // Generate barcode
    const result = await generate(barcodeOptions);

    // Set appropriate content type and send response
    if (result.format === 'png' && result.buffer) {
      res.setHeader('Content-Type', 'image/png');
      res.send(result.buffer);
    } else if (result.format === 'svg' && result.svg) {
      res.setHeader('Content-Type', 'image/svg+xml');
      res.send(result.svg);
    } else {
      throw new Error('Invalid generation result');
    }
  } catch (error) {
    next(error);
  }
});

export default router;
