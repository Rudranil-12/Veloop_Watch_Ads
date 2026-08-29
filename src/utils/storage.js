const NAMESPACE = 'veloop';

function isStorageAvailable() {
  try {
    const testKey = `${NAMESPACE}:__test__`;
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export const storageAvailable = typeof window !== 'undefined' && isStorageAvailable();

export function buildKey(userId, key) {
  return `${NAMESPACE}:${userId || 'guest'}:${key}`;
}

export function loadUserState(userId, key, fallback) {
  if (!storageAvailable) return fallback;
  try {
    const raw = window.localStorage.getItem(buildKey(userId, key));
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveUserState(userId, key, value) {
  if (!storageAvailable) return;
  try {
    window.localStorage.setItem(buildKey(userId, key), JSON.stringify(value));
  } catch {
    // Storage full or unavailable (e.g. private browsing) — fail silently,
    // the app keeps working in-memory for the rest of the session.
  }
}

export function clearUserState(userId, key) {
  if (!storageAvailable) return;
  try {
    window.localStorage.removeItem(buildKey(userId, key));
  } catch {
    // ignore
  }
}