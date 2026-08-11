/**
 * Generate a 6-character unambiguous uppercase alphanumeric pairing token.
 * Excludes easily-confused characters: 0/O, 1/I/L, 5/S, 8/B
 */
const CHARSET = 'ACDEFGHJKMNPQRTUVWXY234679';

export function generatePairingToken() {
  let token = '';
  for (let i = 0; i < 6; i++) {
    token += CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }
  return token;
}
