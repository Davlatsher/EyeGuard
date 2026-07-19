/**
 * Developer tool: issue a Pro license key for a customer.
 *
 *   EYEGUARD_PRIVATE_KEY=<hex> node scripts/sign-license.mjs customer@example.com
 *
 * The private key is the one printed by gen-keypair.mjs. NEVER commit it —
 * pass it via the environment. Output is the license key to give the customer.
 */
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';

ed.hashes.sha512 = (...msgs) => sha512(ed.etc.concatBytes(...msgs));

const priv = process.env.EYEGUARD_PRIVATE_KEY;
const email = process.argv[2];

if (!priv || !email) {
  console.error('Usage: EYEGUARD_PRIVATE_KEY=<hex> node scripts/sign-license.mjs <email>');
  process.exit(1);
}

function b64url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return Buffer.from(bin, 'binary')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

const payload = { email, plan: 'pro', issued: Date.now() };
const msg = new TextEncoder().encode(JSON.stringify(payload));
const sig = ed.sign(msg, ed.etc.hexToBytes(priv));

console.log('EG1.' + b64url(msg) + '.' + b64url(sig));
