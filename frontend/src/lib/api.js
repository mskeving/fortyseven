import { getAuth } from 'lib/auth';
import URI from 'lib/uri';

export const API_HOST = 'http://localhost:5000';

export async function apiFetch(path, method = 'POST', params = null) {
  const { token } = getAuth();
  const uri = _buildUrl(path, method, params);
  const body = _buildBody(method, params);
  const response = await fetch(uri, {
    method,
    body,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
      'Authorization': `Token ${token}`,
    },
  });

  if (response.status !== 200) {
    throw response;
  }

  return await response.json();
}

function _buildUrl(path, method, params) {
  let uri = URI.parse(API_HOST).setPath(`/${path}`);

  if (method !== 'POST') {
    uri.setQuery(params);
  }

  return String(uri);
}

function _buildBody(method, params) {
  if (!params || method !== 'POST') {
    return null;
  }
  return JSON.stringify(params);
}

export function apiGet(path, params = {}) {
  return apiFetch(path, 'GET', params);
}

export function apiPost(path, params = {}) {
  return apiFetch(path, 'POST', params);
}

export function apiDelete(path, params = {}) {
  return apiFetch(path, 'DELETE', params);
}
