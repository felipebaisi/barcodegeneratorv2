# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Choose Your Interface

#### Option A: Web Interface (Easiest)
```bash
npm start
```
Then open: **http://localhost:8080**

- Interactive form with validation
- Live preview
- Download PNG or SVG
- No command-line needed!

#### Option B: CLI
```bash
# Generate PDF417 barcode
node dist/cli/index.js --type pdf417 --text "ABC123" --out out/barcode.png --format png

# Generate VIN barcode
node dist/cli/index.js --type code39 --text "1HGCM82633A004352" --mod43 --out out/vin.svg --format svg

# Generate QR Code
node dist/cli/index.js --type qrcode --text "https://example.com" --out out/qr.png --format png --eclevel H
```

#### Option C: REST API
```bash
npm start
```

Then test with PowerShell:
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8080/health"

# Generate barcode
$body = @{
    type = "qrcode"
    text = "Hello World"
    format = "png"
    options = @{
        scale = 3
        eclevel = "M"
    }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8080/generate" -Method POST -Body $body -ContentType "application/json" -OutFile "out/api-qr.png"
```

## 🧪 Run Tests
```bash
npm test
```

## 🐳 Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📖 Full Documentation
See [README.md](README.md) for complete documentation.

## 🎯 Common Use Cases

### VIN Barcodes for Automotive
```bash
node dist/cli/index.js --type code39 --text "1HGCM82633A004352" --mod43 --out vin.svg --format svg --scale 3
```

### Shipping Labels (PDF417)
```bash
node dist/cli/index.js --type pdf417 --text "SHIP-12345-USA" --out label.png --format png --scale 4 --eclevel 5
```

### QR Codes for URLs
```bash
node dist/cli/index.js --type qrcode --text "https://your-site.com" --out qr.png --format png --eclevel H --scale 5
```

### Custom Colors
```bash
node dist/cli/index.js --type qrcode --text "Branded" --out branded.png --format png --fg-color "#0078D4" --bg-color "#FFFFFF"
```

## 🔧 Development Mode
```bash
# Start server with hot reload
npm run dev

# Run CLI without building
npm run cli -- --type qrcode --text "Test" --out test.png --format png

# Watch tests
npm run test:watch

# Format code
npm run format
```

## ⚠️ Troubleshooting

### TypeScript Errors
```bash
npm run build
```

### Test Failures
```bash
npm test -- --verbose
```

### Port Already in Use
Change PORT in `.env`:
```
PORT=3000
```

## 📦 Project Structure
```
BarcodeGenerator/
├── src/              # TypeScript source
├── dist/             # Compiled JavaScript
├── tests/            # Jest test files
├── out/              # Generated barcodes
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
└── README.md         # Full documentation
```
