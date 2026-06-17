#!/usr/bin/env node
// Generates the SHA-256 hash to put in VITE_ACCESS_CODE_HASH.
// Usage: node scripts/hash-code.mjs "your-family-code"
import { createHash } from 'node:crypto';

const code = process.argv[2];
if (!code) {
  console.error('Uso: node scripts/hash-code.mjs "tu-codigo"');
  process.exit(1);
}
const hash = createHash('sha256').update(code).digest('hex');
console.log(hash);
