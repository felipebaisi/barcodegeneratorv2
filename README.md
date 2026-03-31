# Node.js Barcode Generator

A production-ready Node.js application for generating **PDF417**, **Code 39 (VIN)**, and **QR Code** barcodes. Features both a CLI tool and a REST API, built with TypeScript, using the open-source [bwip-js](https://www.npmjs.com/package/bwip-js) library.

## 🚀 Features

- **Multiple symbologies**: PDF417, Code 39 (VIN), QR Code
- **Multiple output formats**: PNG and SVG
- **Web interface** with interactive form and live preview
- **CLI interface** with Commander.js
- **REST API** with Express
- **VIN validation** with proper Code 39 constraints (17 chars, excludes I/O/Q)
- **Configurable options**: scale, error correction, rotation, colors
- **Comprehensive validation** with Zod schemas
- **Full TypeScript** support
- **Docker** ready with multi-stage builds
- **Extensive tests** with Jest and Supertest
- **Structured logging** with Pino
- **Security headers** with Helmet

## 📦 Installation

### Prerequisites

- Node.js 18+ LTS
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Copy Environment File

```bash
cp .env.example .env
```

### Build TypeScript

```bash
npm run build
```

## 🌐 Web Interface Usage

The easiest way to generate barcodes is through the web interface.

### Start the Web Interface

```bash
npm start
```

Then open your browser to: **http://localhost:8080**

### Features

- **Interactive Form**: Select barcode type, enter text, configure options
- **Real-time Validation**: 
  - Character count with limits per barcode type
  - VIN validation (17 characters, excludes I/O/Q)
  - Auto-uppercase for VINs
- **Live Preview**: See generated barcode immediately
- **Download**: Save as PNG or SVG
- **Advanced Options**:
  - Scale (1-10)
  - Error correction levels
  - Rotation (0°, 90°, 180°, 270°)
  - Custom colors (foreground/background)
  - Mod 43 checksum for VINs

### Barcode Type Limits

| Type | Max Characters | Notes |
|------|----------------|-------|
| QR Code | 4,296 | General purpose 2D barcode |
| PDF417 | 1,850 | High-density for IDs, shipping |
| Code 39 (VIN) | 17 (exact) | VIN barcodes only |

## 🖥️ CLI Usage

### Basic Examples

**PDF417 PNG:**
```bash
npm run cli -- --type pdf417 --text "ABC123" --out out/pdf417.png --format png --scale 3 --eclevel 3
```

**VIN Code 39 SVG with Mod 43:**
```bash
npm run cli -- --type code39 --text "1HGCM82633A004352" --mod43 --out out/vin.svg --format svg --scale 2
```

**QR Code PNG:**
```bash
npm run cli -- --type qrcode --text "https://example.com" --out out/qr.png --format png --eclevel M
```

**With Custom Colors:**
```bash
npm run cli -- --type qrcode --text "Custom Colors" --out out/qr-colored.png --format png --fg-color "#FF0000" --bg-color "#FFFF00"
```

**With Rotation:**
```bash
npm run cli -- --type pdf417 --text "Rotated" --out out/rotated.svg --format svg --rotation 90
```

### After Building

Once built, you can use the binary directly:

```bash
node dist/cli/index.js --type qrcode --text "Hello" --out out/hello.png --format png
```

Or install globally:

```bash
npm link
barcode-gen --type qrcode --text "Hello" --out out/hello.png --format png
```

### CLI Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--type <type>` | `-t` | Barcode type: `pdf417`, `code39`, `qrcode` | **Required** |
| `--text <text>` | `-x` | Text to encode | **Required** |
| `--out <path>` | `-o` | Output file path | **Required** |
| `--format <format>` | `-f` | Output format: `png` or `svg` | `png` |
| `--scale <number>` | `-s` | Scale factor | `3` |
| `--eclevel <level>` | `-e` | Error correction (PDF417: 0-8, QR: L/M/Q/H) | PDF417: `2`, QR: `M` |
| `--mod43` | | Enable Mod 43 checksum for Code 39 | `false` |
| `--rotation <degrees>` | `-r` | Rotation: 0, 90, 180, 270 | `0` |
| `--fg-color <color>` | | Foreground hex color | `#000000` |
| `--bg-color <color>` | | Background hex color | `#FFFFFF` |
| `--include-text` | | Include human-readable text | `true` |

## 🌐 REST API Usage

### Start Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

Server runs on `http://localhost:8080` by default (configurable via `.env`).

### Endpoints

#### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-01-06T10:00:00.000Z"
}
```

#### `POST /generate`

Generate barcode image.

**Request Body:**
```json
{
  "type": "pdf417|code39|qrcode",
  "text": "payload",
  "format": "png|svg",
  "options": {
    "scale": 3,
    "eclevel": 2,
    "mod43": true,
    "rotation": 0,
    "fgColor": "#000000",
    "bgColor": "#FFFFFF"
  }
}
```

**Response:**
- Content-Type: `image/png` or `image/svg+xml`
- Body: Binary image data or SVG string

### API Examples with curl

**PDF417 SVG:**
```bash
curl -X POST http://localhost:8080/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"pdf417","text":"Hello World","format":"svg","options":{"scale":2,"eclevel":3}}' \
  > out/api-pdf417.svg
```

**QR Code PNG:**
```bash
curl -X POST http://localhost:8080/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"qrcode","text":"https://microsoft.com","format":"png","options":{"scale":3,"eclevel":"H"}}' \
  > out/api-qr.png
```

**VIN Code 39 PNG with Mod 43:**
```bash
curl -X POST http://localhost:8080/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"code39","text":"1HGCM82633A004352","format":"png","options":{"scale":2,"mod43":true}}' \
  > out/api-vin.png
```

**With Custom Colors:**
```bash
curl -X POST http://localhost:8080/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"qrcode","text":"Colored","format":"png","options":{"fgColor":"#0000FF","bgColor":"#FFFF00"}}' \
  > out/api-colored.png
```

**With Rotation:**
```bash
curl -X POST http://localhost:8080/generate \
  -H "Content-Type: application/json" \
  -d '{"type":"qrcode","text":"Rotated","format":"png","options":{"rotation":90}}' \
  > out/api-rotated.png
```

## 🧪 Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Tests include:
- **Unit tests** for validators (VIN validation, error levels, colors)
- **Unit tests** for generator (PNG/SVG generation for all types)
- **Integration tests** for REST API endpoints with Supertest

## 🐳 Docker

### Build and Run with Docker

**Build image:**
```bash
docker build -t barcode-generator .
```

**Run container:**
```bash
docker run -p 8080:8080 barcode-generator
```

### Using Docker Compose

**Start service:**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f
```

**Stop service:**
```bash
docker-compose down
```

**Rebuild after changes:**
```bash
docker-compose up -d --build
```

## ⚙️ Configuration

Configuration is managed via environment variables. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment mode | `development` |
| `DEFAULT_SCALE` | Default scale factor | `3` |
| `DEFAULT_FORMAT` | Default format | `png` |
| `DEFAULT_ECLEVEL_PDF417` | PDF417 error correction | `2` |
| `DEFAULT_ECLEVEL_QR` | QR error correction | `M` |
| `DEFAULT_ROTATION` | Default rotation | `0` |
| `DEFAULT_FG_COLOR` | Foreground color | `#000000` |
| `DEFAULT_BG_COLOR` | Background color | `#FFFFFF` |
| `LOG_LEVEL` | Logging level | `info` |
| `LOG_PRETTY` | Pretty print logs | `true` |

## 📐 Barcode Types & Options

### PDF417

- **Error Correction Levels**: 0-8 (higher = more redundancy)
- **Use cases**: Government IDs, shipping labels, inventory
- **Encoding capacity**: Up to 1,850 alphanumeric characters

### Code 39 (VIN)

- **Length**: Must be exactly 17 characters
- **Valid characters**: A-Z, 0-9 (excludes I, O, Q to avoid confusion)
- **Mod 43**: Optional checksum for enhanced validation
- **Use cases**: Vehicle identification numbers, asset tracking

### QR Code

- **Error Correction Levels**:
  - `L` (Low): 7% recovery
  - `M` (Medium): 15% recovery
  - `Q` (Quartile): 25% recovery
  - `H` (High): 30% recovery
- **Use cases**: URLs, contact cards, payment codes
- **Encoding capacity**: Up to 4,296 alphanumeric characters

## 🖨️ Printing Guidelines

### PNG Format

- Recommended for **raster printing** workflows
- Use **300-600 DPI** for professional printing
- Scale factor affects final resolution
- May pixelate when scaled beyond generation size

### SVG Format

- **Preferred for vector workflows** (laser engraving, professional printing)
- Infinite scalability without quality loss
- Smaller file sizes
- Compatible with Adobe Illustrator, Inkscape, etc.

### Quiet Zones

Barcodes include appropriate quiet zones (white space around barcode) automatically via bwip-js. This ensures proper scanner recognition.

## 🛠️ Development

### Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production server |
| `npm run dev` | Run development server with hot reload |
| `npm run cli` | Run CLI tool via ts-node |
| `npm test` | Run all tests with Jest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint TypeScript files |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |

### Project Structure

```
node-barcode-helper/
├── src/
│   ├── cli/
│   │   └── index.ts           # CLI implementation
│   ├── server/
│   │   ├── app.ts             # Express app setup
│   │   ├── routes.ts          # API routes
│   │   └── schemas.ts         # Zod validation schemas
│   ├── lib/
│   │   ├── generator.ts       # Barcode generation logic
│   │   ├── validators.ts      # Input validation
│   │   └── types.ts           # TypeScript types
│   ├── config/
│   │   └── env.ts             # Environment config
│   └── utils/
│       └── logger.ts          # Pino logger setup
├── public/
│   ├── index.html             # Web interface
│   ├── styles.css             # Web UI styles
│   └── app.js                 # Web UI JavaScript
├── tests/
│   ├── generator.spec.ts      # Generator unit tests
│   ├── validators.spec.ts     # Validator unit tests
│   └── api.spec.ts            # API integration tests
├── dist/                      # Compiled JavaScript (generated)
├── out/                       # Generated barcodes (gitignored)
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Docker Compose config
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 📚 References

- **bwip-js**: [npm](https://www.npmjs.com/package/bwip-js) | [Documentation](https://bwipp.terryburton.co.uk/)
- **Code 39 / VIN**: [Wikipedia](https://en.wikipedia.org/wiki/Code_39)
- **PDF417**: [Wikipedia](https://en.wikipedia.org/wiki/PDF417)
- **QR Code**: [Wikipedia](https://en.wikipedia.org/wiki/QR_code)

## 🤝 Contributing

Contributions are welcome! Please ensure:

1. All tests pass (`npm test`)
2. Code is properly formatted (`npm run format`)
3. Linting passes (`npm run lint`)
4. TypeScript compiles without errors (`npm run build`)

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with [bwip-js](https://github.com/metafloor/bwip-js) by Terry Burton and contributors
- Uses BWIPP (Barcode Writer in Pure PostScript)
