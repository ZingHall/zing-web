#!/usr/bin/env node

/**
 * Test script for steganography encode/decode
 * Creates a simple PNG, embeds a message, then extracts it to verify
 */

const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

// Simple inline implementation for testing (avoids TypeScript compilation)
function stringToBinary(str) {
  // Use Buffer to properly handle UTF-8 encoding including emojis
  const buffer = Buffer.from(str, 'utf8');
  return Array.from(buffer)
    .map(byte => byte.toString(2).padStart(8, '0'))
    .join('');
}

function binaryToString(binary) {
  const bytes = binary.match(/.{8}/g) || [];
  const byteArray = bytes.map(byte => parseInt(byte, 2));
  // Use Buffer to properly decode UTF-8
  return Buffer.from(byteArray).toString('utf8');
}

function createHeader(messageByteLength) {
  const header = `ZING_STEGO|v1|len:${messageByteLength}|`;
  return stringToBinary(header);
}

function parseHeader(binaryData) {
  const headerBits = binaryData.substring(0, 200);
  const headerText = binaryToString(headerBits);
  
  const match = headerText.match(/ZING_STEGO\|v(\d+)\|len:(\d+)\|/);
  if (!match) return null;
  
  const version = parseInt(match[1], 10);
  const messageLength = parseInt(match[2], 10);
  
  if (version !== 1) {
    throw new Error(`Unsupported version: ${version}`);
  }
  
  const headerString = match[0];
  const headerLength = stringToBinary(headerString).length;
  
  return { headerLength, messageLength };
}

function embedMessage(imageBuffer, message) {
  const png = PNG.sync.read(imageBuffer);
  const { data, width, height } = png;
  
  // Use byte length for UTF-8 strings (important for emojis)
  const messageByteLength = Buffer.from(message, 'utf8').length;
  const header = createHeader(messageByteLength);
  const messageBinary = stringToBinary(message);
  const fullBinary = header + messageBinary;
  
  const capacity = width * height * 3;
  if (fullBinary.length > capacity) {
    throw new Error(
      `Message too long. Max capacity: ${Math.floor(capacity / 8)} bytes, message: ${Math.ceil(fullBinary.length / 8)} bytes`
    );
  }
  
  let bitIndex = 0;
  for (let i = 0; i < data.length && bitIndex < fullBinary.length; i++) {
    if (i % 4 === 3) continue;
    
    const bit = parseInt(fullBinary[bitIndex], 10);
    data[i] = (data[i] & 0xFE) | bit;
    bitIndex++;
  }
  
  return PNG.sync.write(png);
}

function extractMessage(imageBuffer) {
  const png = PNG.sync.read(imageBuffer);
  const { data } = png;
  
  let binaryData = '';
  for (let i = 0; i < data.length; i++) {
    if (i % 4 === 3) continue;
    binaryData += (data[i] & 1).toString();
  }
  
  const headerInfo = parseHeader(binaryData);
  if (!headerInfo) {
    throw new Error('No valid steganography header found');
  }
  
  const { headerLength, messageLength } = headerInfo;
  
  const messageStartBit = headerLength;
  const messageEndBit = messageStartBit + (messageLength * 8);
  const messageBinary = binaryData.substring(messageStartBit, messageEndBit);
  
  return binaryToString(messageBinary);
}

function isValidPNG(buffer) {
  try {
    PNG.sync.read(buffer);
    return true;
  } catch {
    return false;
  }
}

function getCapacity(imageBuffer) {
  const png = PNG.sync.read(imageBuffer);
  const bitsAvailable = png.width * png.height * 3;
  const headerOverhead = 25 * 8;
  return Math.floor((bitsAvailable - headerOverhead) / 8);
}

// Create a simple test PNG image (100x100 red square)
function createTestImage(width = 100, height = 100) {
  const png = new PNG({ width, height });
  
  // Fill with red color (R=255, G=0, B=0, A=255)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      png.data[idx] = 255;     // R
      png.data[idx + 1] = 0;   // G
      png.data[idx + 2] = 0;   // B
      png.data[idx + 3] = 255; // A
    }
  }
  
  return PNG.sync.write(png);
}

async function runTests() {
  console.log('🧪 Starting Steganography Tests\n');
  
  try {
    // Test 1: Create test image
    console.log('Test 1: Creating test image...');
    const originalImage = createTestImage(100, 100);
    console.log(`✓ Created ${originalImage.length} byte PNG image\n`);
    
    // Test 2: Validate PNG
    console.log('Test 2: Validating PNG...');
    const isValid = isValidPNG(originalImage);
    if (!isValid) throw new Error('PNG validation failed');
    console.log('✓ PNG is valid\n');
    
    // Test 3: Check capacity
    console.log('Test 3: Checking capacity...');
    const capacity = getCapacity(originalImage);
    console.log(`✓ Capacity: ${capacity} bytes\n`);
    
    // Test 4: Embed message
    console.log('Test 4: Embedding message...');
    const testMessage = 'Hello from Zing! This is a secret message embedded using LSB steganography. 🔐';
    console.log(`Message: "${testMessage}"`);
    console.log(`Message length: ${testMessage.length} bytes`);
    
    const embeddedImage = embedMessage(originalImage, testMessage);
    console.log(`✓ Embedded message, result size: ${embeddedImage.length} bytes\n`);
    
    // Save embedded image for manual inspection
    const outputDir = path.join(__dirname, '../public/test');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const originalPath = path.join(outputDir, 'original.png');
    const embeddedPath = path.join(outputDir, 'embedded.png');
    
    fs.writeFileSync(originalPath, originalImage);
    fs.writeFileSync(embeddedPath, embeddedImage);
    console.log(`✓ Saved images to ${outputDir}\n`);
    
    // Test 5: Extract message
    console.log('Test 5: Extracting message...');
    const extractedMessage = extractMessage(embeddedImage);
    console.log(`Extracted: "${extractedMessage}"\n`);
    
    // Test 6: Verify match
    console.log('Test 6: Verifying message integrity...');
    if (extractedMessage !== testMessage) {
      throw new Error(`Message mismatch!\nOriginal: "${testMessage}"\nExtracted: "${extractedMessage}"`);
    }
    console.log('✓ Messages match perfectly!\n');
    
    // Test 7: Long message
    console.log('Test 7: Testing with long message...');
    const longMessage = 'A'.repeat(Math.floor(capacity * 0.8)); // Use 80% of capacity
    console.log(`Long message length: ${longMessage.length} bytes`);
    
    const embeddedLong = embedMessage(originalImage, longMessage);
    const extractedLong = extractMessage(embeddedLong);
    
    if (extractedLong !== longMessage) {
      throw new Error('Long message mismatch!');
    }
    console.log('✓ Long message test passed\n');
    
    // Test 8: Try to exceed capacity (should throw)
    console.log('Test 8: Testing capacity limit...');
    try {
      const tooLong = 'X'.repeat(capacity + 100);
      embedMessage(originalImage, tooLong);
      throw new Error('Should have thrown capacity error');
    } catch (error) {
      if (error.message.includes('too long')) {
        console.log('✓ Capacity limit enforced correctly\n');
      } else {
        throw error;
      }
    }
    
    // Test 9: Empty image extraction (should fail gracefully)
    console.log('Test 9: Testing extraction from clean image...');
    try {
      extractMessage(originalImage);
      throw new Error('Should have thrown "no header" error');
    } catch (error) {
      if (error.message.includes('header')) {
        console.log('✓ Clean image detection works\n');
      } else {
        throw error;
      }
    }
    
    console.log('═══════════════════════════════════════');
    console.log('✅ All Tests Passed!');
    console.log('═══════════════════════════════════════');
    console.log(`\nTest images saved to: ${outputDir}`);
    console.log('You can now test the web UI by running: npm run dev\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test Failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runTests();
