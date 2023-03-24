const storagePrefix = 'l_s';

const storage = {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(`${storagePrefix}_${key}`);
    return item ? JSON.parse(item) : null;
  },
  set<T>(key: string, value: T): void {
    localStorage.setItem(`${storagePrefix}_${key}`, JSON.stringify(value));
  },
  remove(key: string): void {
    localStorage.removeItem(`${storagePrefix}_${key}`);
  },
  exists(key: string): boolean {
    return !!localStorage.getItem(`${storagePrefix}_${key}`);
  },
  available(): boolean {
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
