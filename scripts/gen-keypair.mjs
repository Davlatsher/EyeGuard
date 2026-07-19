/**
 * One-time developer tool: generate an ed25519 key pair for license signing.
 *
 *   node scripts/gen-keypair.mjs
 *
 * - Copy the PUBLIC key into src/lib/license.ts (LICENSE_PUBLIC_KEY).
 * - Keep the PRIVATE key SECRET (never commit). Use it with sign-license.mjs
 *   to issue license keys to paying customers.
 */
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';

// @noble/ed25519 v3 needs a sha512 implementation wired in for sync ops.
ed.hashes.sha512 = (...msgs) => sha512(ed.etc.concatBytes(...msgs));

const secret = ed.utils.randomSecretKey();
const pub = ed.getPublicKey(secret);

console.log('PRIVATE KEY (keep secret, do NOT commit):');
console.log('  ' + ed.etc.bytesToHex(secret));
console.log('');
console.log('PUBLIC KEY (paste into src/lib/license.ts):');
console.log('  ' + ed.etc.bytesToHex(pub));
