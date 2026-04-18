import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Clock, CheckCircle, XCircle, Copy, ExternalLink } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getBookingById, updateBookingStatus, type Booking } from "@/lib/bookings";

interface BookingTicketProps {
  bookingId: string;
  onClose: () => void;
}

function formatTime(ms: number): string {
  if (ms <= 0) return "00:00";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function BookingTicket({ bookingId, onClose }: BookingTicketProps) {
  const [booking, setBooking] = useState<Booking | undefined>(() => getBookingById(bookingId));
  const [timeLeft, setTimeLeft] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!booking) return;
    const update = () => {
      const remaining = booking.expiresAt - Date.now();
      setTimeLeft(Math.max(0, remaining));
      if (remaining <= 0 && booking.status === "pending_payment") {
        updateBookingStatus(bookingId, "expired");
        setBooking(getBookingById(bookingId));
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [booking?.expiresAt, booking?.status, bookingId]);

  if (!booking) {
    return null;
  }

  const upiUrl = `upi://pay?pa=${booking.paymentUpiId}&pn=Cinema%20AZ&am=${booking.totalPrice}&cu=INR&tn=Booking%20${booking.id}`;

  const handleSubmitPayment = () => {
    if (!transactionId.trim()) return;
    updateBookingStatus(bookingId, "payment_submitted", transactionId.trim());
    setBooking(getBookingById(bookingId));
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(booking.paymentUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = booking.status === "expired";
  const isPending = booking.status === "pending_payment";
  const isSubmitted = booking.status === "payment_submitted";
  const isConfirmed = booking.status === "confirmed";
  const isRejected = booking.status === "rejected";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="relative bg-card border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ticket Header */}
        <div className="p-5 border-b border-border border-dashed">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-body font-semibold text-muted-foreground tracking-widest uppercase">
              Cinema AZ · Booking Ticket
            </span>
            <button onClick={onClose} className="p-1 rounded hover:bg-accent text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <h2 className="font-display text-2xl tracking-wider mb-1">{booking.screeningTitle}</h2>
          <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground font-body">
            <span className="px-2 py-0.5 rounded-full bg-secondary">{booking.format}</span>
            <span className="px-2 py-0.5 rounded-full bg-secondary">{booking.language}</span>
          </div>
        </div>

        {/* Booking Details */}
        <div className="p-5 border-b border-border border-dashed">
          <div className="grid grid-cols-2 gap-3 text-sm font-body">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Date</span>
              <p className="font-medium">{new Date(booking.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Time</span>
              <p className="font-medium">{booking.time}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Venue</span>
              <p className="font-medium text-xs">{booking.venueName}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Screen</span>
              <p className="font-medium text-xs">{booking.audiName}</p>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Seats</span>
              <p className="font-medium">{booking.seats.join(", ")}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Name</span>
              <p className="font-medium">{booking.customerName}</p>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</span>
              <p className="font-medium">{booking.customerPhone}</p>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-3 pt-3 border-t border-border/50">
            {booking.seatBreakdown.map((s, i) => (
              <div key={i} className="flex justify-between text-xs font-body text-muted-foreground">
                <span>{s.seat} ({s.section})</span>
                <span>₹{s.price}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-body font-semibold mt-1 pt-1 border-t border-border/50">
              <span>Total</span>
              <span className="font-display text-lg">₹{booking.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="p-5">
          {/* Timer */}
          {isPending && (
            <div className={`flex items-center justify-center gap-2 mb-4 p-3 rounded-xl ${
              timeLeft < 120000 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            }`}>
              <Clock className="w-4 h-4" />
              <span className="font-display text-xl tracking-wider">{formatTime(timeLeft)}</span>
              <span className="text-xs font-body">to complete payment</span>
            </div>
          )}

          {/* UPI QR */}
          {isPending && timeLeft > 0 && (
            <>
              <div className="text-center mb-4">
                <p className="text-xs text-muted-foreground font-body mb-3">Scan QR to pay via UPI</p>
                <div className="inline-block p-3 bg-white rounded-xl">
                  <QRCodeSVG value={upiUrl} size={180} level="H" />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-secondary">
                <span className="text-xs font-body text-muted-foreground flex-1 truncate">
                  UPI: {booking.paymentUpiId}
                </span>
                <button onClick={handleCopyUpi} className="text-xs font-body text-primary flex items-center gap-1">
                  <Copy className="w-3 h-3" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              <a
                href={upiUrl}
                className="flex items-center justify-center gap-2 w-full mb-4 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Open UPI App to Pay ₹{booking.totalPrice}
              </a>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-body">After payment, enter your UPI Transaction ID:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Transaction ID / UTR"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  <button
                    onClick={handleSubmitPayment}
                    disabled={!transactionId.trim()}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-xs font-semibold disabled:opacity-40"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Status Messages */}
          {isExpired && (
            <div className="text-center p-4 rounded-xl bg-destructive/10">
              <XCircle className="w-10 h-10 text-destructive mx-auto mb-2" />
              <p className="font-body text-sm font-medium text-destructive">Booking Expired</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Payment was not completed in time.</p>
            </div>
          )}

          {isSubmitted && (
            <div className="text-center p-4 rounded-xl bg-primary/10">
              <Clock className="w-10 h-10 text-primary mx-auto mb-2" />
              <p className="font-body text-sm font-medium">Payment Submitted — Awaiting Approval</p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                Transaction ID: {booking.transactionId}
              </p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                An admin will verify your payment and confirm your booking.
              </p>
            </div>
          )}

          {isConfirmed && (
            <div className="text-center p-4 rounded-xl bg-green-500/10">
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="font-body text-sm font-medium text-green-500">Booking Confirmed!</p>
              <p className="text-xs text-muted-foreground font-body mt-1">Show this ticket at the venue.</p>
              <div className="mt-3 inline-block p-3 bg-white rounded-xl">
                <QRCodeSVG
                  value={JSON.stringify({
                    id: booking.id,
                    film: booking.screeningTitle,
                    seats: booking.seats,
                    date: booking.date,
                    time: booking.time,
                    venue: booking.venueName,
                    audi: booking.audiName,
                  })}
                  size={140}
                  level="M"
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-body mt-2">Booking ID: {booking.id}</p>
            </div>
          )}

          {isRejected && (
            <div className="text-center p-4 rounded-xl bg-destructive/10">
              <XCircle className="w-10 h-10 text-destructive mx-auto mb-2" />
              <p className="font-body text-sm font-medium text-destructive">Payment Rejected</p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                Your payment could not be verified. Please contact the admin.
              </p>
            </div>
          )}
        </div>

        {/* Booking ID Footer */}
        <div className="px-5 pb-4 text-center">
          <p className="text-[10px] text-muted-foreground font-body tracking-wider">
            {booking.id} · Cinema AZ & Anime AZ Ahmedabad
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
