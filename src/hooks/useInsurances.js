import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

let cache = null;
let fetchPromise = null;
const listeners = new Set();

const notify = () => {
  listeners.forEach((listener) => listener(cache));
};

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const updateCache = (updater) => {
  const base = Array.isArray(cache) ? [...cache] : [];
  const next = typeof updater === 'function' ? updater(base) : updater;
  cache = next;
  notify();
  return cache;
};

const loadInsurances = async (force = false) => {
  if (cache && !force) {
    return cache;
  }
  if (fetchPromise) {
    return fetchPromise;
  }
  fetchPromise = apiClient
    .get('/insurances', { auth: false })
    .then((data) => {
      cache = data;
      notify();
      return cache;
    })
    .finally(() => {
      fetchPromise = null;
    });
  return fetchPromise;
};

const useInsurances = () => {
  const [insurances, setInsurances] = useState(() => cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const sync = () => {
      if (active) {
        setInsurances(cache || []);
      }
    };
    const unsubscribe = subscribe(sync);

    if (!cache) {
      setLoading(true);
      loadInsurances()
        .catch((err) => {
          console.error('useInsurances: error fetching data', err);
          if (active) {
            setError(err.message || 'No se pudo cargar la lista de obras sociales.');
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await loadInsurances(true);
    } catch (err) {
      setError(err.message || 'No se pudo actualizar la lista de obras sociales.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addInsurance = useCallback(async (insurance) => {
    const created = await apiClient.post('/insurances', insurance);
    updateCache((prev) => [...prev, created]);
    return created;
  }, []);

  const updateInsurance = useCallback(async (id, updates) => {
    const updated = await apiClient.put(`/insurances/${id}`, updates);
    updateCache((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    return updated;
  }, []);

  const removeInsurance = useCallback(async (id) => {
    await apiClient.delete(`/insurances/${id}`);
    updateCache((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const existsId = useCallback(
    (id) => {
      if (!cache) return false;
      return cache.some((item) => item.id === id);
    },
    []
  );

  return {
    insurances,
    loading,
    error,
    refresh,
    addInsurance,
    updateInsurance,
    removeInsurance,
    existsId,
  };
};

export default useInsurances;
