# Steganography Test for Zing Web

This implementation provides a complete LSB (Least Significant Bit) steganography system for PNG images in Next.js, allowing you to embed and extract hidden messages.

## ✅ Implementation Status

All components have been successfully implemented and tested:

1. ✅ **Core Library** (`src/lib/stego.ts`)
   - UTF-8 aware encode/decode functions
   - LSB steganography algorithm
   - Header with magic string + version + message length
   - Capacity calculation
   - PNG validation

2. ✅ **API Routes**
   - `POST /api/stego/embed` - Embed message into image
   - `POST /api/stego/extract` - Extract message from image

3. ✅ **UI** (`src/app/page.tsx`)
   - Upload original image form
   - Embed message interface
   - Download embedded image
   - Extract message from uploaded image
   - Real-time feedback and error handling

4. ✅ **Test Suite** (`scripts/test-stego.js`)
   - 9 comprehensive tests
   - UTF-8 and emoji support validated
   - Capacity limits tested
   - Message integrity verified

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd zing-web
npm install
```

### 2. Run Backend Tests
```bash
node scripts/test-stego.js
```

Expected output:
```
🧪 Starting Steganography Tests
...
✅ All Tests Passed!
```

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing Workflow

### Complete End-to-End Test:

1. **Prepare a test PNG image**
   - Any PNG image will work (e.g., screenshot, downloaded image)
   - Smaller images = less capacity, larger images = more capacity

2. **Embed a message:**
   - Open http://localhost:3000
   - In the "Embed Message" section:
     - Upload your PNG image
     - Type a secret message (supports emojis! 🔐)
     - Click "Embed Message"
     - Download the resulting image

3. **Extract the message:**
   - In the "Extract Message" section:
     - Upload the downloaded embedded image
     - Click "Extract Message"
     - The original message will be displayed

4. **Verify integrity:**
   - The extracted message should match exactly what you embedded
   - Works with UTF-8 characters and emojis

### Automated Tests

The test script (`scripts/test-stego.js`) validates:

- ✅ PNG creation and validation
- ✅ Capacity calculation
- ✅ Message embedding
- ✅ Message extraction
- ✅ UTF-8 encoding (including emojis)
- ✅ Long message handling (80% capacity)
- ✅ Capacity limit enforcement
- ✅ Error handling for non-embedded images

Test images are saved to: `public/test/`

## 📐 Technical Details

### Algorithm: LSB Steganography

- **Method:** Modifies the Least Significant Bit of each RGB color channel
- **Capacity:** ~3 bits per pixel (1 per RGB channel, alpha skipped)
- **Format:** PNG only (lossless compression preserves exact bits)
- **Encoding:** UTF-8 with proper multi-byte character support

### Message Format

```
[HEADER][MESSAGE]
```

**Header Structure:**
```
ZING_STEGO|v1|len:<byte_length>|
```

- Magic string: `ZING_STEGO` (for validation)
- Version: `v1` (for future compatibility)
- Length: Byte length of UTF-8 encoded message
- Delimiter: `|` (pipe character)

### Example Capacity

| Image Size | Pixels | Capacity (bytes) | Capacity (chars) |
|-----------|--------|------------------|------------------|
| 100x100   | 10,000 | ~3,725          | ~3,725           |
| 500x500   | 250,000 | ~93,725         | ~93,725          |
| 1920x1080 | 2,073,600 | ~776,925      | ~776,925         |

*Note: Emojis use 4 bytes each in UTF-8*

## 🔍 Files Structure

```
zing-web/
├── src/
│   ├── lib/
│   │   └── stego.ts                    # Core steganography library
│   ├── app/
│   │   ├── api/
│   │   │   └── stego/
│   │   │       ├── embed/route.ts      # Embed API endpoint
│   │   │       └── extract/route.ts    # Extract API endpoint
│   │   └── page.tsx                    # Main UI
├── scripts/
│   └── test-stego.js                   # Automated test suite
├── public/
│   └── test/                           # Test images output
│       ├── original.png
│       └── embedded.png
└── package.json                        # Dependencies (pngjs added)
```

## 🎯 Key Features

1. **UTF-8 Support**: Properly handles multi-byte characters including emojis
2. **Error Handling**: Graceful failures with clear error messages
3. **Capacity Checking**: Prevents overflow with pre-embedding validation
4. **Version Control**: Header includes version for future upgrades
5. **Visual Preservation**: LSB changes are imperceptible to human eye
6. **Integrity Validation**: Header magic string validates embedded messages

## 🔐 Use Cases for Zing Platform

This steganography implementation aligns with the Zing architecture plan:

1. **Member NFT Watermarking**: Embed member NFT object ID into downloaded e-books
2. **Publisher Attribution**: Hidden metadata for tracking and attribution
3. **Anti-piracy**: Invisible watermarks for leak tracking
4. **Audit Trail**: Record download events with embedded identifiers

### Integration Points:

- **TEE Processing**: Can be integrated into AWS Nitro Enclave workflow
- **Walrus Storage**: Embed tracking data before uploading to Walrus
- **Member Downloads**: Personalize each download with member-specific data
- **Verification**: Extract watermark from leaked copies to trace source

## 📊 Test Results

```
✅ All 9 Tests Passed
- Image creation: PASS
- PNG validation: PASS
- Capacity calculation: PASS
- Message embedding: PASS
- Message extraction: PASS
- UTF-8 encoding: PASS (emojis work!)
- Long messages: PASS (2,980 bytes)
- Capacity limits: PASS (correctly rejects oversized)
- Clean image detection: PASS (no false positives)
```

## 🛠️ Dependencies Added

```json
{
  "dependencies": {
    "pngjs": "^7.0.0"
  },
  "devDependencies": {
    "@types/pngjs": "^6.0.5"
  }
}
```

## 🎨 UI Preview

The web interface provides:

- **Left Panel**: Embed message into image
  - File upload (PNG only)
  - Text area for secret message
  - Download button for embedded result
  - Preview of embedded image

- **Right Panel**: Extract message from image
  - File upload (embedded PNG)
  - Display extracted message
  - Error handling for non-embedded images

- **Bottom**: How It Works section with explanation

## 🚨 Important Notes

1. **PNG Only**: Algorithm requires lossless format (JPEG would destroy the data)
2. **Re-encoding**: If the embedded image is converted to JPEG or compressed, the message will be lost
3. **Detection**: While imperceptible, sophisticated tools can detect LSB modifications
4. **Capacity**: Message length is limited by image size (see capacity table)

## 🔄 Next Steps for Production

For production use in Zing platform:

1. **Add Encryption**: Encrypt message before embedding
2. **Add Checksums**: Verify message integrity with hash
3. **Add Compression**: Compress message to increase effective capacity
4. **Multiple Formats**: Support TIFF, BMP (other lossless formats)
5. **TEE Integration**: Embed inside AWS Nitro Enclave for security
6. **Blockchain Anchoring**: Store hash on Sui for verification

## 📝 License

Part of the Zing platform - see main repository for license details.
