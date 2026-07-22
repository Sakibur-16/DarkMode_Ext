const fs = require('fs');
const path = require('path');

// Pure JS Minimal PNG Generator for Dark Vision Icon (Moon & Stars motif)
function createPNG(size) {
  // We construct a valid PNG buffer programmatically for icon sizes
  const width = size;
  const height = size;
  
  // Minimal PNG signature and chunks for solid/gradient icon with moon
  const rawData = [];
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.4;
  
  for (let y = 0; y < height; y++) {
    rawData.push(0); // Filter type byte (None)
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Crescent Moon Math
      const moonDx = x - (cx + size * 0.12);
      const moonDy = y - (cy - size * 0.1);
      const moonDist = Math.sqrt(moonDx * moonDx + moonDy * moonDy);
      
      if (dist <= radius && moonDist > radius * 0.75) {
        // Moon Glowing Gradient (Cyan to Purple)
        const t = (x + y) / (width + height);
        const r = Math.round(59 + t * (139 - 59));
        const g = Math.round(130 + t * (92 - 130));
        const b = Math.round(246 + t * (246 - 246));
        rawData.push(r, g, b, 255);
      } else {
        // Transparent or subtle background circle
        if (dist <= radius * 1.1) {
          rawData.push(18, 24, 38, 220); // Dark Midnight Blue
        } else {
          rawData.push(0, 0, 0, 0); // Transparent
        }
      }
    }
  }

  return buildPNG(width, height, Buffer.from(rawData));
}

// Minimal ZLIB & PNG Chunk Encoder
const zlib = require('zlib');

function buildPNG(width, height, rawData) {
  const compressed = zlib.deflateSync(rawData);
  
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // Bit depth
  ihdr.writeUInt8(6, 9); // Color type 6 (RGBA)
  ihdr.writeUInt8(0, 10); // Compression
  ihdr.writeUInt8(0, 11); // Filter
  ihdr.writeUInt8(0, 12); // Interlace
  const ihdrChunk = createChunk('IHDR', ihdr);
  
  // IDAT
  const idatChunk = createChunk('IDAT', compressed);
  
  // IEND
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

// CRC32 implementation for PNG chunks
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
    }
  }
  return (crc ^ -1) >>> 0;
}

// Generate 16, 48, 128 icons
const iconsDir = path.join(__dirname);
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[16, 48, 128].forEach((size) => {
  const iconBuffer = createPNG(size);
  const filePath = path.join(iconsDir, `icon${size}.png`);
  fs.writeFileSync(filePath, iconBuffer);
  console.log(`Generated ${filePath}`);
});
