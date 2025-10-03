import { useCallback, useEffect, useState } from 'react';
import { getItem, setItem } from '../utils/storage';
import { INSURANCE_MOCKS } from '../mocks/insurances.data';

const STORAGE_KEY = 'insurances';
let cache = null;
const listeners = new Set();

const initializeCache = () => {
  if (!cache) {
    const stored = getItem(STORAGE_KEY, null);
    cache = Array.isArray(stored) && stored.length > 0 ? stored : INSURANCE_MOCKS;
  }
  return cache;
};

const notify = () => {
  listeners.forEach((listener) => listener(cache));
};

const updateCache = (updater) => {
  const base = Array.isArray(cache) ? [...cache] : [];
  const next = typeof updater === 'function' ? updater(base) : updater;
  cache = next;
  setItem(STORAGE_KEY, cache);
  notify();
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const useInsurances = () => {
  const [insurances, setInsurances] = useState(() => initializeCache());

  useEffect(() => {
    initializeCache();
    setInsurances(cache);
    return subscribe((next) => setInsurances(next));
  }, []);

  const addInsurance = useCallback((insurance) => {
    updateCache((prev) => [...prev, insurance]);
  }, []);

  const updateInsurance = useCallback((id, updates) => {
    updateCache((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const removeInsurance = useCallback((id) => {
    updateCache((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const existsId = useCallback((id) => cache?.some((item) => item.id === id), []);

  return {
    insurances,
    addInsurance,
    updateInsurance,
    removeInsurance,
    existsId,
  };
};

export default useInsurances;
