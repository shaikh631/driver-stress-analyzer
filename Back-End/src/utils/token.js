import crypto from 'crypto';

/**
 * Generate a 6-character unambiguous uppercase alphanumeric pairing token.
 * Excludes easily-confused characters: 0/O, 1/I/L, 5/S, 8/B
 */
const CHARSET = 'ACDEFGHJKMNPQRTUVWXY234679';

export function generatePairingToken() {
  return Array.from({ length: 6 }, () => CHARSET[crypto.randomInt(CHARSET.length)]).join('');
}
