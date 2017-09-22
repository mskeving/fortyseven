import ScriptLoader from 'react-async-script-loader';

const GOOGLE_SCRIPT = 'https://apis.google.com/js/platform.js';
const GOOGLE_CLIENT_ID = '159531093281-6t6pme7r12ooc4o979qgtmsalc590k6g.apps.googleusercontent.com';
const OAUTH_BACKEND_URL = 'http://localhost:5000/social/google-oauth2/';

const TOKEN_KEY = 'auth_token';
const EMAIL_KEY = 'auth_email';

export function isLoggedIn() {
  return !!getAuth().token;
}

export function getAuth() {
  const token = window.localStorage.getItem(TOKEN_KEY);
  const email = window.localStorage.getItem(EMAIL_KEY);
  return (token && email) ? { token, email } : {};
}

export function setAuth(token, email) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(EMAIL_KEY, email);
  } catch (e) {}
}

export async function initializeAuthLib() {
  if (window.gapi.auth2) {
    return;
  }

  await new Promise((resolve, reject) => {
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: GOOGLE_CLIENT_ID,
        fetch_basic_profile: false,
        scope: 'email',
      }).then(
        () => resolve()
      );
    });
  });

  return;
}

export async function authorizeUser() {
  const auth2 = window.gapi.auth2.getAuthInstance();
  const user = await auth2.signIn({
    fetch_basic_profile: false,
    prompt: 'select_account',
    scope: 'email',
  });
  const { access_token } = user.getAuthResponse();
  const email = user.getBasicProfile().getEmail();
  const response = await fetch(OAUTH_BACKEND_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Origin': '',
    },
    body: JSON.stringify({ access_token })
  });
  const { token } = await response.json();
  setAuth(token, email);
  return email;
}

export function AuthScriptLoader(Wrapped) {
  return ScriptLoader([GOOGLE_SCRIPT])(Wrapped);
}
