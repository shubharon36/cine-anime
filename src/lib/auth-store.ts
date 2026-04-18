// Lightweight client-side mock auth (will move to Lovable Cloud later).
// Stores the logged-in user in localStorage so it survives reloads.

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  isFirstLogin?: boolean;
};

const USER_KEY = "ez:user";
const SHOULD_GREET_KEY = "ez:should-greet";
const ANIM_KEY = "ez:welcome-animation";

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredUser | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function isLoggedIn(): boolean {
  return !!getStoredUser();
}

export function logout() {
  setStoredUser(null);
  localStorage.removeItem(SHOULD_GREET_KEY);
}

/** Called after a successful login. Marks that the welcome greeting should show next page. */
export function markFreshLogin(user: StoredUser) {
  setStoredUser(user);
  localStorage.setItem(SHOULD_GREET_KEY, "true");
}

export function consumeShouldGreet(): boolean {
  if (typeof window === "undefined") return false;
  const v = localStorage.getItem(SHOULD_GREET_KEY) === "true";
  if (v) localStorage.removeItem(SHOULD_GREET_KEY);
  return v;
}

export function isWelcomeAnimationEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const v = localStorage.getItem(ANIM_KEY);
  return v === null ? true : v === "true";
}
