// Reactive in-memory admin store with subscription support.
// Components can subscribe via useSyncExternalStore for real-time updates.

import { useSyncExternalStore } from "react";
import { type Screening, type CinemaEvent, mockScreenings, mockEvents } from "./data";

export type UserRole = "owner" | "admin" | "member";

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  joinedAt: string;
  avatar?: string;
}

// Mock current user as owner
export const currentUser: CommunityMember = {
  id: "u1",
  name: "You (Owner)",
  email: "owner@cinemaez.com",
  role: "owner",
  joinedAt: "2024-01-01",
};

const initialMembers: CommunityMember[] = [
  currentUser,
  { id: "u2", name: "Arjun Patel", email: "arjun@cinemaez.com", role: "admin", joinedAt: "2024-02-15" },
  { id: "u3", name: "Priya Shah", email: "priya@cinemaez.com", role: "admin", joinedAt: "2024-03-10" },
  { id: "u4", name: "Ravi Mehta", email: "ravi@cinemaez.com", role: "admin", joinedAt: "2024-04-20" },
  { id: "u5", name: "Sneha Joshi", email: "sneha@gmail.com", role: "member", joinedAt: "2024-05-01" },
  { id: "u6", name: "Karan Desai", email: "karan@gmail.com", role: "member", joinedAt: "2024-06-15" },
  { id: "u7", name: "Ananya Trivedi", email: "ananya@gmail.com", role: "member", joinedAt: "2024-07-22" },
  { id: "u8", name: "Dhruv Sharma", email: "dhruv@gmail.com", role: "member", joinedAt: "2024-08-05" },
];

// ── Reactive store helpers ──────────────────────────────────────────────────

type Listener = () => void;
function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => value,
    set: (next: T) => {
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

const screeningsState = createStore<Screening[]>([...mockScreenings]);
const eventsState = createStore<CinemaEvent[]>([...mockEvents]);
const membersState = createStore<CommunityMember[]>([...initialMembers]);

// Backwards-compat exports (read snapshots)
export const screeningsStore = new Proxy([] as Screening[], {
  get: (_t, prop) => Reflect.get(screeningsState.get(), prop),
});
export const eventsStore = new Proxy([] as CinemaEvent[], {
  get: (_t, prop) => Reflect.get(eventsState.get(), prop),
});
export const membersStore = new Proxy([] as CommunityMember[], {
  get: (_t, prop) => Reflect.get(membersState.get(), prop),
});

// ── React hooks for live data ───────────────────────────────────────────────

export function useScreenings(): Screening[] {
  return useSyncExternalStore(
    screeningsState.subscribe,
    screeningsState.get,
    screeningsState.get,
  );
}

export function useEvents(): CinemaEvent[] {
  return useSyncExternalStore(
    eventsState.subscribe,
    eventsState.get,
    eventsState.get,
  );
}

export function useMembers(): CommunityMember[] {
  return useSyncExternalStore(
    membersState.subscribe,
    membersState.get,
    membersState.get,
  );
}

// ── Mutations ───────────────────────────────────────────────────────────────

function sortPinned<T extends { pinned?: boolean }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false));
}

export function addScreening(screening: Screening) {
  screeningsState.set(sortPinned([screening, ...screeningsState.get()]));
}
export function updateScreening(id: string, updates: Partial<Screening>) {
  screeningsState.set(
    sortPinned(screeningsState.get().map((s) => (s.id === id ? { ...s, ...updates } : s))),
  );
}
export function deleteScreening(id: string) {
  screeningsState.set(screeningsState.get().filter((s) => s.id !== id));
}
export function toggleScreeningPin(id: string) {
  updateScreening(id, { pinned: !screeningsState.get().find((s) => s.id === id)?.pinned });
}

export function addEvent(event: CinemaEvent) {
  eventsState.set(sortPinned([event, ...eventsState.get()]));
}
export function updateEvent(id: string, updates: Partial<CinemaEvent>) {
  eventsState.set(
    sortPinned(eventsState.get().map((e) => (e.id === id ? { ...e, ...updates } : e))),
  );
}
export function deleteEvent(id: string) {
  eventsState.set(eventsState.get().filter((e) => e.id !== id));
}
export function toggleEventPin(id: string) {
  updateEvent(id, { pinned: !eventsState.get().find((e) => e.id === id)?.pinned });
}

export function updateMemberRole(id: string, role: UserRole) {
  membersState.set(membersState.get().map((m) => (m.id === id ? { ...m, role } : m)));
}

export function isAdminOrOwner(): boolean {
  return currentUser.role === "owner" || currentUser.role === "admin";
}

// ── Editable stat overrides (admin can manually adjust headline numbers) ───

const STATS_OVERRIDE_KEY = "ez:stats-override";
type StatsOverride = { members?: number; screeningsDone?: number; animeEvents?: number; cinemaPartners?: number };

function loadOverride(): StatsOverride {
  if (typeof localStorage === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STATS_OVERRIDE_KEY) || "{}"); } catch { return {}; }
}

const statsOverrideState = createStore<StatsOverride>(loadOverride());

export function useStatsOverride(): StatsOverride {
  return useSyncExternalStore(statsOverrideState.subscribe, statsOverrideState.get, statsOverrideState.get);
}

export function setStatsOverride(next: StatsOverride) {
  statsOverrideState.set(next);
  if (typeof localStorage !== "undefined") localStorage.setItem(STATS_OVERRIDE_KEY, JSON.stringify(next));
}

// ── Live community stats ────────────────────────────────────────────────────

export function useCommunityStats() {
  const screenings = useScreenings();
  const events = useEvents();
  const members = useMembers();
  const override = useStatsOverride();

  const screeningsDone = screenings.filter((s) => s.status === "past").length;
  const animeEvents = events.filter((e) => e.community === "Anime EZ" || e.community === "Both").length
    + screenings.filter((s) => s.type === "anime").length;
  const cinemaPartners = new Set(screenings.map((s) => s.venue)).size;

  return {
    members: override.members ?? members.length,
    screeningsDone: override.screeningsDone ?? screeningsDone,
    animeEvents: override.animeEvents ?? animeEvents,
    cinemaPartners: override.cinemaPartners ?? Math.max(cinemaPartners, 1),
  };
}
