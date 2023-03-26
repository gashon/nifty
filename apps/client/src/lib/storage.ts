const storagePrefix = 'l_s';

const storage = {
  get<T>(key: string): T | null {
    if (!this.isMounted()) throw new Error('Storage is not available');

    const item = localStorage.getItem(`${storagePrefix}_${key}`);
    return item ? JSON.parse(item) : null;
  },
  set<T>(key: string, value: T): void {
    if (!this.isMounted()) throw new Error('Storage is not available');

    localStorage.setItem(`${storagePrefix}_${key}`, JSON.stringify(value));
  },
  remove(key: string): void {
    if (!storage.isMounted()) throw new Error('Storage is not available');

    localStorage.removeItem(`${storagePrefix}_${key}`);
  },
  exists(key: string): boolean {
    if (!storage.isMounted()) throw new Error('Storage is not available');

    return !!localStorage.getItem(`${storagePrefix}_${key}`);
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
  }
};

export default storage;
