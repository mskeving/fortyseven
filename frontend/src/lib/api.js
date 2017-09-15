import { getAuth } from 'lib/auth';

export const API_HOST = 'http://localhost:5000';

export function apiFetch(path, method = 'POST', params = null) {
  const url = `${API_HOST}/api/${path}`;
  const { token } = getAuth();
  const body = params ? JSON.stringify(params) : null;
  return fetch(url, {
    method,
    body,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
      'Authorization': `Token ${token}`,
    },
  });
}

export function apiGet(path, params = null) {
  return apiFetch(path, 'GET', params);
}

export function apiPost(path, params = null) {
  return apiFetch(path, 'POST', params);
}
