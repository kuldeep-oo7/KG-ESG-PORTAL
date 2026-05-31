// Comprehensive CP1252-mojibake reversal.
// When PowerShell reads UTF-8 as CP1252, each UTF-8 byte B is mapped to
// the CP1252 Unicode character for B, then re-encoded as UTF-8.
// This script reverses that by detecting CP1252 characters that form
// valid UTF-8 multi-byte sequences and replacing them with the original char.
const fs = require('fs');

const files = [
  'E:/HACKATHON/portal/src/components/AssessmentForm.jsx',
  'E:/HACKATHON/portal/src/pages/CSR.jsx',
  'E:/HACKATHON/portal/src/pages/Dashboard.jsx',
  'E:/HACKATHON/portal/src/pages/GHGReports.jsx',
  'E:/HACKATHON/portal/src/pages/Governance.jsx',
  'E:/HACKATHON/portal/src/pages/Help.jsx',
  'E:/HACKATHON/portal/src/pages/Sites.jsx',
  'E:/HACKATHON/portal/src/pages/Social.jsx',
];

// CP1252 special range 0x80-0x9F: byte -> Unicode codepoint
const cp1252special = {
  0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026,
  0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160,
  0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019,
  0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153,
  0x9E: 0x017E, 0x9F: 0x0178,
};

// Build reverse map: Unicode codepoint -> CP1252 byte
const unicodeToByte = {};
for (let b = 0; b < 0x80; b++) unicodeToByte[b] = b;
for (const [b, u] of Object.entries(cp1252special)) unicodeToByte[u] = parseInt(b);
for (let b = 0xA0; b <= 0xFF; b++) unicodeToByte[b] = b;
// Undefined CP1252 bytes (0x81, 0x8D, 0x8F, 0x90, 0x9D) mapped to their own codepoint by Windows
for (const b of [0x81, 0x8D, 0x8F, 0x90, 0x9D]) unicodeToByte[b] = b;

function getByte(ch) {
  const cp = ch.codePointAt(0);
  return unicodeToByte[cp] ?? null;
}

function decodeMojibake(str) {
  const out = [];
  let i = 0;
  while (i < str.length) {
    const ch = str[i];
    const b1 = getByte(ch);

    // Try 4-byte UTF-8: F0-F7 + 3 continuation bytes
    if (b1 !== null && b1 >= 0xF0 && b1 <= 0xF7 && i + 3 < str.length) {
      const b2 = getByte(str[i+1]);
      const b3 = getByte(str[i+2]);
      const b4 = getByte(str[i+3]);
      if (b2 !== null && b2 >= 0x80 && b2 <= 0xBF &&
          b3 !== null && b3 >= 0x80 && b3 <= 0xBF &&
          b4 !== null && b4 >= 0x80 && b4 <= 0xBF) {
        const cp = ((b1 & 0x07) << 18) | ((b2 & 0x3F) << 12) | ((b3 & 0x3F) << 6) | (b4 & 0x3F);
        if (cp >= 0x10000) { out.push(String.fromCodePoint(cp)); i += 4; continue; }
      }
    }

    // Try 3-byte UTF-8: E0-EF + 2 continuation bytes
    if (b1 !== null && b1 >= 0xE0 && b1 <= 0xEF && i + 2 < str.length) {
      const b2 = getByte(str[i+1]);
      const b3 = getByte(str[i+2]);
      if (b2 !== null && b2 >= 0x80 && b2 <= 0xBF &&
          b3 !== null && b3 >= 0x80 && b3 <= 0xBF) {
        const cp = ((b1 & 0x0F) << 12) | ((b2 & 0x3F) << 6) | (b3 & 0x3F);
        if (cp >= 0x0800) { out.push(String.fromCodePoint(cp)); i += 3; continue; }
      }
    }

    // Try 2-byte UTF-8: C2-DF + 1 continuation byte
    if (b1 !== null && b1 >= 0xC2 && b1 <= 0xDF && i + 1 < str.length) {
      const b2 = getByte(str[i+1]);
      if (b2 !== null && b2 >= 0x80 && b2 <= 0xBF) {
        const cp = ((b1 & 0x1F) << 6) | (b2 & 0x3F);
        if (cp >= 0x0080) { out.push(String.fromCodePoint(cp)); i += 2; continue; }
      }
    }

    out.push(ch);
    i++;
  }
  return out.join('');
}

// Strip UTF-8 BOM if present
function stripBOM(s) {
  return s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s;
}

let totalFixed = 0;
files.forEach(f => {
  let content = stripBOM(fs.readFileSync(f, 'utf8'));
  const fixed = decodeMojibake(content);
  if (fixed !== content) {
    fs.writeFileSync(f, fixed, 'utf8');
    console.log('Fixed: ' + f.split('/').pop());
    totalFixed++;
  } else {
    console.log('Clean: ' + f.split('/').pop());
  }
});
console.log('\nDone. Fixed ' + totalFixed + ' files.');
