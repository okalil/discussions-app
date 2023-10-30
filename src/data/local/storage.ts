const map: Record<string, any> = {};

export const storage = {
  getString(key: string) {
    return map[key];
  },
  set(key: string, value: string) {
    map[key] = value;
  },
  delete(key: string) {
    map[key] = null;
  },
};
