// Temporary in-memory admin store (will be replaced by database later)
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
  email: "owner@cinemaaz.com",
  role: "owner",
  joinedAt: "2024-01-01",
};

export const mockMembers: CommunityMember[] = [
  currentUser,
  { id: "u2", name: "Arjun Patel", email: "arjun@cinemaaz.com", role: "admin", joinedAt: "2024-02-15" },
  { id: "u3", name: "Priya Shah", email: "priya@cinemaaz.com", role: "admin", joinedAt: "2024-03-10" },
  { id: "u4", name: "Ravi Mehta", email: "ravi@cinemaaz.com", role: "admin", joinedAt: "2024-04-20" },
  { id: "u5", name: "Sneha Joshi", email: "sneha@gmail.com", role: "member", joinedAt: "2024-05-01" },
  { id: "u6", name: "Karan Desai", email: "karan@gmail.com", role: "member", joinedAt: "2024-06-15" },
  { id: "u7", name: "Ananya Trivedi", email: "ananya@gmail.com", role: "member", joinedAt: "2024-07-22" },
  { id: "u8", name: "Dhruv Sharma", email: "dhruv@gmail.com", role: "member", joinedAt: "2024-08-05" },
];

// Simple mutable stores for demo
export let screeningsStore = [...mockScreenings];
export let eventsStore = [...mockEvents];
export let membersStore = [...mockMembers];

export function addScreening(screening: Screening) {
  screeningsStore = [screening, ...screeningsStore];
}

export function updateScreening(id: string, updates: Partial<Screening>) {
  screeningsStore = screeningsStore.map((s) => (s.id === id ? { ...s, ...updates } : s));
}

export function deleteScreening(id: string) {
  screeningsStore = screeningsStore.filter((s) => s.id !== id);
}

export function addEvent(event: CinemaEvent) {
  eventsStore = [event, ...eventsStore];
}

export function updateEvent(id: string, updates: Partial<CinemaEvent>) {
  eventsStore = eventsStore.map((e) => (e.id === id ? { ...e, ...updates } : e));
}

export function deleteEvent(id: string) {
  eventsStore = eventsStore.filter((e) => e.id !== id);
}

export function updateMemberRole(id: string, role: UserRole) {
  membersStore = membersStore.map((m) => (m.id === id ? { ...m, role } : m));
}

export function isAdminOrOwner(): boolean {
  return currentUser.role === "owner" || currentUser.role === "admin";
}
