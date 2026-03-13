import crypto from 'node:crypto';

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const COOKIE_NAME = 'kb_admin_session';

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD || '';
}

function getSigningSecret() {
  return process.env.ADMIN_SESSION_SECRET || getAdminPassword();
}

function parseCookies(cookieHeader = '') {
  return Object.fromEntries(
    cookieHeader
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separatorIndex = part.indexOf('=');
        const key = separatorIndex >= 0 ? part.slice(0, separatorIndex) : part;
        const value = separatorIndex >= 0 ? part.slice(separatorIndex + 1) : '';
        return [key, decodeURIComponent(value)];
      }),
  );
}

function createSignature(value) {
  return crypto.createHmac('sha256', getSigningSecret()).update(value).digest('hex');
}

function encodeSession(expiresAt) {
  const payload = String(expiresAt);
  return `${payload}.${createSignature(payload)}`;
}

function decodeSession(rawValue) {
  if (!rawValue) return null;

  const [payload, signature] = rawValue.split('.');
  if (!payload || !signature) return null;

  const actual = Buffer.from(signature, 'hex');
  const expected = Buffer.from(createSignature(payload), 'hex');

  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    return null;
  }

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return null;
  }

  return { expiresAt };
}

function baseCookieParts() {
  const parts = ['Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (process.env.NODE_ENV === 'production') {
    parts.push('Secure');
  }
  return parts;
}

export function createSessionCookie() {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  return [`${COOKIE_NAME}=${encodeURIComponent(encodeSession(expiresAt))}`, ...baseCookieParts(), `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`].join('; ');
}

export function clearSessionCookie() {
  return [`${COOKIE_NAME}=`, ...baseCookieParts(), 'Max-Age=0'].join('; ');
}

export function hasValidSession(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return Boolean(decodeSession(cookies[COOKIE_NAME]));
}

export function isPasswordConfigured() {
  return Boolean(getAdminPassword());
}

export function verifyPassword(password) {
  const configuredPassword = getAdminPassword();
  if (!configuredPassword || !password) return false;

  const provided = Buffer.from(password);
  const expected = Buffer.from(configuredPassword);

  return provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
}
