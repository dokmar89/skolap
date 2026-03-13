const ADMIN_SESSION_KEY = 'kb_admin_session_v1';
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

interface AdminSession {
  expiresAt: number;
}

export function hasValidAdminSession(): boolean {
  const raw = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!raw) return false;

  try {
    const parsed = JSON.parse(raw) as AdminSession;
    if (!parsed.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  }
}

export function startAdminSession(): void {
  const session: AdminSession = {
    expiresAt: Date.now() + ADMIN_SESSION_TTL_MS,
  };
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function endAdminSession(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
