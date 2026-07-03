const KEY = "costa_token";

export function getToken(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
export function setToken(t: string) {
  try { localStorage.setItem(KEY, t); } catch { /* noop */ }
}
export function clearToken() {
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
}
export function isLoggedIn() {
  return !!getToken();
}
