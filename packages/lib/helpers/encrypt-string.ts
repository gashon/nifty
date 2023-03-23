import crypto from 'crypto';

export function createIv() {
  return crypto.randomBytes(16).toString('hex');
}

export function encrypt(text: string, iv: string) {
  const ivBuffer = Buffer.from(iv, 'hex');
  const cipher = crypto.createCipheriv(
    'aes-256-ctr',
    process.env.ENCRYPTION_KEY!,
    ivBuffer
  );
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return encrypted.toString('hex')
}

export function decrypt(encrypted: string, iv: string) {
  const ivBuffer = Buffer.from(iv, 'hex');
  const encryptedBuffer = Buffer.from(encrypted, 'hex');

  const decipher = crypto.createDecipheriv(
    'aes-256-ctr',
    process.env.ENCRYPTION_KEY!,
    ivBuffer
  );
  const decrypted = Buffer.concat([
    decipher.update(encryptedBuffer),
    decipher.final(),
  ]);

  return decrypted.toString();
}
