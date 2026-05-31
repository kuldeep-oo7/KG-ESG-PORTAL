// Fix double-encoded UTF-8 in JSX files.
// PowerShell read files as Windows-1252 then wrote back as UTF-8, corrupting non-ASCII chars.
// Each entry: [mojibake_sequence_as_unicode_escapes, correct_character]
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

// Mojibake mapping: CP1252-read-then-UTF8-written sequences -> original Unicode char
// Pattern: UTF-8 bytes of original char were each individually re-encoded as UTF-8
const fixes = [
  // em dash U+2014 (E2 80 94): 0x94 in CP1252 = U+201D right double quote
  ['â€”', '—'],
  // en dash U+2013 (E2 80 93): 0x93 in CP1252 = U+201C left double quote
  ['â€“', '–'],
  // right single quote U+2019 (E2 80 99): 0x99 in CP1252 = U+2122 trademark
  ['â€™', '’'],
  // left single quote U+2018 (E2 80 98): 0x98 in CP1252 = U+02DC small tilde
  ['â€˜', '‘'],
  // left double quote U+201C handled above (same mojibake end as em dash start)
  // bullet U+2022 (E2 80 A2): 0xA2 = U+00A2 cent sign - no CP1252 special
  // ellipsis U+2026 (E2 80 A6): 0x85 in CP1252 = U+2026 (same!) - safe
  // rupee U+20B9 (E2 82 B9): 0x82 in CP1252 = U+201A low-9 quote; 0xB9 = U+00B9 superscript-1
  ['â‚¹', '₹'],
  // superscript-3 U+00B3 (C2 B3): 0xC2 = U+00C2 A-circumflex
  ['Â³', '³'],
  // degree U+00B0 (C2 B0): 0xC2 = U+00C2
  ['Â°', '°'],
  // non-breaking space U+00A0 (C2 A0)
  ['Â ', ' '],
  // superscript-2 U+00B2 (C2 B2)
  ['Â²', '²'],
  // micro sign U+00B5 (C2 B5)
  ['Âµ', 'µ'],
];

let totalFixed = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const original = content;
  fixes.forEach(([bad, good]) => {
    content = content.split(bad).join(good);
  });
  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed: ' + f.split('/').pop());
    totalFixed++;
  } else {
    console.log('Clean: ' + f.split('/').pop());
  }
});
console.log('\nDone. Fixed ' + totalFixed + ' files.');
