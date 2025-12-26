const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'authToken';

const getToken = () => (typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null);

const setToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
};

const buildHeaders = (headers = {}, auth = true) => {
  const result = { ...(headers || {}) };
  if (!result['Content-Type']) {
    result['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (auth && token) {
    result.Authorization = `Bearer ${token}`;
  }
  return result;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get('Content-Type') || '';
  const isJSON = contentType.includes('application/json');
  const payload = isJSON ? await response.json() : await response.text();
  if (!response.ok) {
    const error = new Error(payload?.message || 'Error al comunicarse con el servidor.');
    error.details = payload?.details;
    error.status = response.status;
    throw error;
  }
  return payload;
};

const request = async (path, { method = 'GET', data, headers, auth = true } = {}) => {
  const config = {
    method,
    headers: buildHeaders(headers, auth),
  };
  if (data !== undefined) {
    config.body = typeof data === 'string' ? data : JSON.stringify(data);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, config);
  return parseResponse(response);
};

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, data, options) => request(path, { ...options, method: 'POST', data }),
  put: (path, data, options) => request(path, { ...options, method: 'PUT', data }),
  patch: (path, data, options) => request(path, { ...options, method: 'PATCH', data }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
  setToken,
  clearToken: () => setToken(null),
  getToken,
};

export default apiClient;
