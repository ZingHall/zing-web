/**
 * LSB Steganography utilities for PNG images
 * Embeds and extracts text data in the least significant bits of image pixels
 */

import { PNG } from 'pngjs';

const MAGIC_HEADER = 'ZING_STEGO';
const VERSION = 1;

/**
 * Convert string to binary representation (UTF-8 aware)
 */
function stringToBinary(str: string): string {
  // Use Buffer to properly handle UTF-8 encoding including emojis
  const buffer = Buffer.from(str, 'utf8');
  return Array.from(buffer)
    .map(byte => byte.toString(2).padStart(8, '0'))
    .join('');
}

/**
 * Convert binary string to text (UTF-8 aware)
 */
function binaryToString(binary: string): string {
  const bytes = binary.match(/.{8}/g) || [];
  const byteArray = bytes.map(byte => parseInt(byte, 2));
  // Use Buffer to properly decode UTF-8
  return Buffer.from(byteArray).toString('utf8');
}

/**
 * Create a header with magic string, version, and message byte length
 */
function createHeader(messageByteLength: number): string {
  const header = `${MAGIC_HEADER}|v${VERSION}|len:${messageByteLength}|`;
  return stringToBinary(header);
}

/**
 * Parse header to extract message length
 */
function parseHeader(binaryData: string): { headerLength: number; messageLength: number } | null {
  // Try to read first 200 bits (should be enough for header)
  const headerBits = binaryData.substring(0, 200);
  const headerText = binaryToString(headerBits);
  
  const match = headerText.match(/ZING_STEGO\|v(\d+)\|len:(\d+)\|/);
  if (!match) {
    return null;
  }
  
  const version = parseInt(match[1], 10);
  const messageLength = parseInt(match[2], 10);
  
  if (version !== VERSION) {
    throw new Error(`Unsupported version: ${version}`);
  }
  
  const headerString = match[0];
  const headerLength = stringToBinary(headerString).length;
  
  return { headerLength, messageLength };
}

/**
 * Embed text message into PNG image buffer using LSB steganography
 */
export function embedMessage(imageBuffer: Buffer, message: string): Buffer {
  const png = PNG.sync.read(imageBuffer);
  const { data, width, height } = png;
  
  // Create header and message binary (use byte length for UTF-8 strings)
  const messageByteLength = Buffer.from(message, 'utf8').length;
  const header = createHeader(messageByteLength);
  const messageBinary = stringToBinary(message);
  const fullBinary = header + messageBinary;
  
  // Check capacity (1 bit per color channel, 3 channels per pixel, skipping alpha)
  const capacity = width * height * 3;
  if (fullBinary.length > capacity) {
    throw new Error(
      `Message too long. Max capacity: ${Math.floor(capacity / 8)} bytes, message: ${Math.ceil(fullBinary.length / 8)} bytes`
    );
  }
  
  // Embed binary data into LSBs
  let bitIndex = 0;
  for (let i = 0; i < data.length && bitIndex < fullBinary.length; i++) {
    // Skip alpha channel (every 4th byte)
    if (i % 4 === 3) continue;
    
    // Clear LSB and set new bit
    const bit = parseInt(fullBinary[bitIndex], 10);
    data[i] = (data[i] & 0xFE) | bit;
    bitIndex++;
  }
  
  return PNG.sync.write(png);
}

/**
 * Extract embedded message from PNG image buffer
 */
export function extractMessage(imageBuffer: Buffer): string {
  const png = PNG.sync.read(imageBuffer);
  const { data } = png;
  
  // Extract bits from LSBs
  let binaryData = '';
  for (let i = 0; i < data.length; i++) {
    // Skip alpha channel
    if (i % 4 === 3) continue;
    binaryData += (data[i] & 1).toString();
  }
  
  // Parse header
  const headerInfo = parseHeader(binaryData);
  if (!headerInfo) {
    throw new Error('No valid steganography header found');
  }
  
  const { headerLength, messageLength } = headerInfo;
  
  // Extract message bits
  const messageStartBit = headerLength;
  const messageEndBit = messageStartBit + (messageLength * 8);
  const messageBinary = binaryData.substring(messageStartBit, messageEndBit);
  
  return binaryToString(messageBinary);
}

/**
 * Validate if buffer is a valid PNG
 */
export function isValidPNG(buffer: Buffer): boolean {
  try {
    PNG.sync.read(buffer);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get maximum message capacity for a PNG image
 */
export function getCapacity(imageBuffer: Buffer): number {
  const png = PNG.sync.read(imageBuffer);
  const bitsAvailable = png.width * png.height * 3; // 3 color channels (RGB)
  
  // Account for header overhead (approx 25 bytes)
  const headerOverhead = 25 * 8;
  return Math.floor((bitsAvailable - headerOverhead) / 8);
}
