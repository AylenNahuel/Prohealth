const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getItem = (key, fallback = null) => {
  if (!isBrowser) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`storage.getItem: error reading key "${key}"`, error);
    return fallback;
  }
};

export const setItem = (key, value) => {
  if (!isBrowser) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`storage.setItem: error writing key "${key}"`, error);
  }
};

export default { getItem, setItem };
