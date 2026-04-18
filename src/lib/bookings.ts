// Booking system with QR tickets and payment tracking

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
  createdAt: number; // timestamp
  expiresAt: number; // timestamp (15 min after creation)
  customerName: string;
  customerPhone: string;
  paymentUpiId: string;
  transactionId?: string;
}

// In-memory store (will be replaced by DB later)
export let bookingsStore: Booking[] = [];

export function createBooking(booking: Omit<Booking, "id" | "createdAt" | "expiresAt" | "status">): Booking {
  const now = Date.now();
  const newBooking: Booking = {
    ...booking,
    id: `BK${now.toString(36).toUpperCase()}`,
    status: "pending_payment",
    createdAt: now,
    expiresAt: now + 15 * 60 * 1000, // 15 minutes
  };
  bookingsStore = [newBooking, ...bookingsStore];
  return newBooking;
}

export function updateBookingStatus(id: string, status: BookingStatus, transactionId?: string) {
  bookingsStore = bookingsStore.map((b) =>
    b.id === id ? { ...b, status, ...(transactionId ? { transactionId } : {}) } : b
  );
}

export function getBookingById(id: string): Booking | undefined {
  return bookingsStore.find((b) => b.id === id);
}

// Default UPI ID for receiving payments (admin configurable)
export let organizerUpiId = "cinemaaz@upi";

export function setOrganizerUpiId(upiId: string) {
  organizerUpiId = upiId;
}
