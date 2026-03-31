import request from 'supertest';
import app from '../src/server/app';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /generate', () => {
    it('should generate PDF417 PNG', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'pdf417',
          text: 'Hello World',
          format: 'png',
          options: {
            scale: 2,
            eclevel: 3,
          },
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('image/png');
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should generate QR Code SVG', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'qrcode',
          text: 'https://example.com',
          format: 'svg',
          options: {
            scale: 3,
            eclevel: 'M',
          },
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('image/svg+xml');
      const svgText = response.text || response.body.toString();
      expect(svgText).toContain('<svg');
    });

    it('should generate Code 39 (VIN) PNG', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'code39',
          text: '1HGCM82633A004352',
          format: 'png',
          options: {
            scale: 2,
            mod43: true,
          },
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('image/png');
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should apply custom colors', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'qrcode',
          text: 'Color Test',
          format: 'png',
          options: {
            scale: 2,
            fgColor: '#FF0000',
            bgColor: '#0000FF',
          },
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('image/png');
    });

    it('should apply rotation', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'qrcode',
          text: 'Rotation Test',
          format: 'png',
          options: {
            rotation: 90,
          },
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('image/png');
    });

    it('should reject invalid barcode type', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'invalid',
          text: 'Test',
          format: 'png',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should reject empty text', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'qrcode',
          text: '',
          format: 'png',
        });

      expect(response.status).toBe(400);
    });

    it('should reject invalid format', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'qrcode',
          text: 'Test',
          format: 'jpg',
        });

      expect(response.status).toBe(400);
    });

    it('should reject invalid VIN', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'code39',
          text: 'INVALID',
          format: 'png',
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Validation failed');
    });

    it('should reject invalid color format', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'qrcode',
          text: 'Test',
          format: 'png',
          options: {
            fgColor: 'red',
          },
        });

      expect(response.status).toBe(400);
    });

    it('should reject invalid rotation', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'qrcode',
          text: 'Test',
          format: 'png',
          options: {
            rotation: 45,
          },
        });

      expect(response.status).toBe(400);
    });

    it('should use default options when not provided', async () => {
      const response = await request(app)
        .post('/generate')
        .send({
          type: 'qrcode',
          text: 'Default Options',
          format: 'png',
        });

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('image/png');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
