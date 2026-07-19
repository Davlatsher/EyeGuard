/**
 * Offline license verification (ed25519).
 *
 * A license key is issued by the developer with the private key
 * (scripts/sign-license.mjs) and verified here with the embedded public key —
 * no server or internet needed. Format:
 *
 *   EG1.<base64url(payloadJson)>.<base64url(signature)>
 *
 * The signature covers the exact payload bytes, so we verify against those
 * same bytes rather than re-serializing.
 */
import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha2.js';

// Wire sha512 for @noble/ed25519 v3 sync verification.
ed.hashes.sha512 = (...msgs: Uint8Array[]) => sha512(ed.etc.concatBytes(...msgs));

// Public key — safe to ship. The matching private key stays with the developer.
export const LICENSE_PUBLIC_KEY =
  '31021013010275921409c14b0e3f87685ec3590d8e0ac8b9ad913ad8def3cd97';

const PREFIX = 'EG1.';

export interface LicensePayload {
  email: string;
  plan: string;
  issued: number;
}

function bytesFromB64url(s: string): Uint8Array {
  let b = s.replace(/-/g, '+').replace(/_/g, '/');
  while (b.length % 4) b += '=';
  const bin = atob(b);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Verify a license key offline. Returns the payload if valid, else null. */
export function verifyLicenseKey(key: string): LicensePayload | null {
  try {
    const trimmed = key.trim();
    if (!trimmed.startsWith(PREFIX)) return null;
    const [p, s] = trimmed.slice(PREFIX.length).split('.');
    if (!p || !s) return null;

    const msg = bytesFromB64url(p);
    const sig = bytesFromB64url(s);
    const pub = ed.etc.hexToBytes(LICENSE_PUBLIC_KEY);

    if (!ed.verify(sig, msg, pub)) return null;

    const payload = JSON.parse(new TextDecoder().decode(msg)) as LicensePayload;
    if (payload.plan !== 'pro' || !payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}

const LS_KEY = 'eyeguard-license';

/** Load and re-verify a stored license key (called on startup). */
export function loadStoredLicense(): { key: string; payload: LicensePayload } | null {
  try {
    const key = localStorage.getItem(LS_KEY);
    if (!key) return null;
    const payload = verifyLicenseKey(key);
    return payload ? { key, payload } : null;
  } catch {
    return null;
  }
}

export function storeLicense(key: string): void {
  try {
    localStorage.setItem(LS_KEY, key);
  } catch {
    /* ignore */
  }
}

export function clearLicense(): void {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    /* ignore */
  }
}
