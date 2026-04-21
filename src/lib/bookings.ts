// Booking system with QR tickets and payment tracking
import { useSyncExternalStore } from "react";

export type BookingStatus = "pending_payment" | "payment_submitted" | "confirmed" | "rejected" | "expired";

export interface Booking {
  id: string;
  screeningId: string;
  screeningTitle: string;
  venueId: string;
  venueName: string;
  audiId: string;
  audiName: string;
  format: string;
  language: string;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  seatBreakdown: { section: string; seat: string; price: number }[];
  status: BookingStatus;
  createdAt: number;
  expiresAt: number;
  customerName: string;
  customerPhone: string;
  paymentUpiId: string;
  transactionId?: string;
}

// Reactive store
let _bookings: Booking[] = [];
const _listeners = new Set<() => void>();
const notify = () => _listeners.forEach((l) => l());

export const bookingsStore = new Proxy([] as Booking[], {
  get: (_t, prop) => Reflect.get(_bookings, prop),
});

export function useBookings(): Booking[] {
  return useSyncExternalStore(
    (l) => { _listeners.add(l); return () => _listeners.delete(l); },
    () => _bookings,
    () => _bookings,
  );
}

export function createBooking(booking: Omit<Booking, "id" | "createdAt" | "expiresAt" | "status">): Booking {
  const now = Date.now();
  const newBooking: Booking = {
    ...booking,
    id: `BK${now.toString(36).toUpperCase()}`,
    status: "pending_payment",
    createdAt: now,
    expiresAt: now + 15 * 60 * 1000,
  };
  _bookings = [newBooking, ..._bookings];
  notify();
  return newBooking;
}

export function updateBookingStatus(id: string, status: BookingStatus, transactionId?: string) {
  _bookings = _bookings.map((b) =>
    b.id === id ? { ...b, status, ...(transactionId ? { transactionId } : {}) } : b
  );
  notify();
}

export function getBookingById(id: string): Booking | undefined {
  return _bookings.find((b) => b.id === id);
}

// UPI ID — also reactive via localStorage
const UPI_KEY = "ez:organizer-upi";
export let organizerUpiId = (typeof localStorage !== "undefined" && localStorage.getItem(UPI_KEY)) || "cinemaaz@upi";

export function setOrganizerUpiId(upiId: string) {
  organizerUpiId = upiId;
  if (typeof localStorage !== "undefined") localStorage.setItem(UPI_KEY, upiId);
  notify();
}
