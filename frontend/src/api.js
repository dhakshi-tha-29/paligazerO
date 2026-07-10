const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export function setToken(token) {
  localStorage.setItem('paligazer_token', token);
}

export function getToken() {
  return localStorage.getItem('paligazer_token');
}

export function clearToken() {
  localStorage.removeItem('paligazer_token');
}

export async function apiCall(method, path, body, isFormData = false) {
  const token = getToken();
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const config = { method, headers };
  if (body !== undefined) {
    config.body = isFormData ? body : JSON.stringify(body);
  }
  const response = await fetch(`${BASE_URL}${path}`, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }
  return data;
}

export async function apiBlob(method, path) {
  const token = getToken();
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, { method, headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || data.error || 'Request failed');
  }
  return response;
}
