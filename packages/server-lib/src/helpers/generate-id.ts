import { customAlphabet } from 'nanoid';

export default function generateId(prefix: string, size?: number) {
  const nanoid = customAlphabet(
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    size || 21,
  );
  return `${prefix}_${nanoid()}`;
}
