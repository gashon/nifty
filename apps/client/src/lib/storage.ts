const storagePrefix = 'G_H';

type StorageDocument<T> = {
  data: T;
  created_at: Date;
  updated_at: Date;
  expires_at?: Date;
} | null;

type Storage = {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, expires_at?: Date): void;
  remove(key: string): void;
  exists(key: string): boolean;
  getMeta(key: string): Omit<StorageDocument<any>, 'data'> | null;
  isMounted(): boolean;
  isAvailable(): boolean;
};

const storage: Storage = {
  get<T>(key: string): T | null {
    if (!this.isMounted()) throw new Error('Storage is not available');

    const item = localStorage.getItem(`${storagePrefix}_${key}`);
    const doc: StorageDocument<T> = item ? JSON.parse(item) : null;

    if (doc && doc.expires_at && new Date(doc.expires_at) < new Date()) {
      this.remove(key);
      return null;
    }

    return doc ? doc.data : null;
  },
  set<T>(key: string, value: T, expires_at?: Date): void {
    if (!this.isMounted()) throw new Error('Storage is not available');

    const prev = this.getMeta(key);

    const doc: StorageDocument<T> = {
      data: value,
      created_at: prev ? prev.created_at : new Date(),
      updated_at: new Date(),
      expires_at,
    };

    localStorage.setItem(`${storagePrefix}_${key}`, JSON.stringify(doc));
  },
  remove(key: string): void {
    if (!this.isMounted()) throw new Error('Storage is not available');

    localStorage.removeItem(`${storagePrefix}_${key}`);
  },
  exists(key: string): boolean {
    if (!this.isMounted()) throw new Error('Storage is not available');

    return !!localStorage.getItem(`${storagePrefix}_${key}`);
  },
  getMeta(key: string): Omit<StorageDocument<any>, 'data'> | null {
    const item = localStorage.getItem(`${storagePrefix}_${key}`);
    const doc: StorageDocument<any> = item ? JSON.parse(item) : null;

    if (doc)
      delete doc.data;

    return doc
  },
  isMounted(): boolean {
    return typeof window !== 'undefined';
  },
  isAvailable(): boolean {
    try {
      localStorage.setItem('available_check', 'available_check');
      localStorage.removeItem('available_check');
      return true;
    } catch (e) {
      return false;
    }
  },
};

export default storage;
