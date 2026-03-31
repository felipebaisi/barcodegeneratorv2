import { z } from 'zod';

// Zod schemas for request validation
export const GenerateRequestSchema = z.object({
  type: z.enum(['pdf417', 'code39', 'qrcode'], {
    errorMap: () => ({ message: 'Type must be one of: pdf417, code39, qrcode' }),
  }),
  text: z.string().min(1, 'Text cannot be empty'),
  format: z.enum(['png', 'svg'], {
    errorMap: () => ({ message: 'Format must be either png or svg' }),
  }),
  options: z
    .object({
      scale: z.number().positive().optional(),
      eclevel: z.union([z.number().int().min(0).max(8), z.enum(['L', 'M', 'Q', 'H'])]).optional(),
      mod43: z.boolean().optional(),
    })
    .optional(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
