import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, AlertCircle, User, Phone } from "lucide-react";
import { type ScreenType, type Screening } from "@/lib/data";
import { getAuditorium, type Auditorium, type SeatSection } from "@/lib/venues";
import { createBooking, organizerUpiId } from "@/lib/bookings";
import { BookingTicket } from "@/components/BookingTicket";

interface SeatSelectionProps {
  screening: Screening;
  onClose: () => void;
}

// Generate random booked seats for demo
function generateBookedSeats(audi: Auditorium): Set<string> {
  const booked = new Set<string>();
  audi.sections.forEach((section) => {
    section.rows.forEach((r) => {
      r.segments.forEach((seg) => {
        seg.forEach((seatNum) => {
          if (seatNum > 0 && Math.random() < 0.35) {
            booked.add(`${r.label}${seatNum}`);
          }
        });
      });
    });
  });
  return booked;
}

const screenTypeConfig: Record<ScreenType, { selectedClass: string; glowColor: string; screenWidth: string; label: string }> = {
  imax: {
    selectedClass: "bg-screen-imax text-white",
    glowColor: "oklch(0.6 0.2 250 / 0.5)",
    screenWidth: "w-[90%]",
    label: "IMAX",
  },
  "4dx": {
    selectedClass: "bg-screen-4dx text-white",
    glowColor: "oklch(0.6 0.22 25 / 0.5)",
    screenWidth: "w-3/4",
    label: "4DX",
  },
  normal: {
    selectedClass: "bg-screen-normal text-background",
    glowColor: "oklch(0.78 0.15 75 / 0.5)",
    screenWidth: "w-3/4",
    label: "SCREEN",
  },
};

export function SeatSelection({ screening, onClose }: SeatSelectionProps) {
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showTicket, setShowTicket] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const config = screenTypeConfig[screening.screenType];

  const audi = getAuditorium(screening.venueId, screening.audiId);

  const [bookedSeats] = useState<Set<string>>(() => {
    if (!audi) return new Set<string>();
    return generateBookedSeats(audi);
  });

  if (!audi) {
    return (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
          className="bg-card border border-border rounded-2xl p-8 text-center max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-xl mb-2">Seat Map Coming Soon</h2>
          <p className="text-sm text-muted-foreground font-body">
            The seat map for {screening.venue} — {screening.audiName} is being set up.
          </p>
          <button onClick={onClose} className="mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-body text-sm">
            Close
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const toggleSeat = (seatId: string) => {
    if (bookedSeats.has(seatId)) return;
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(seatId)) next.delete(seatId);
      else if (next.size < 10) next.add(seatId);
      return next;
    });
  };

  const getSeatPrice = (seatId: string): number => {
    const rowLabel = seatId.charAt(0);
    for (const section of audi.sections) {
      if (section.rows.some((r) => r.label === rowLabel)) {
        return section.price;
      }
    }
    return 0;
  };

  const getSeatSection = (seatId: string): string => {
    const rowLabel = seatId.charAt(0);
    for (const section of audi.sections) {
      if (section.rows.some((r) => r.label === rowLabel)) {
        return section.name;
      }
    }
    return "";
  };

  const totalPrice = useMemo(() => {
    let total = 0;
    selectedSeats.forEach((seatId) => {
      total += getSeatPrice(seatId);
    });
    return total;
  }, [selectedSeats]);

  const handleBook = () => {
    if (!customerName || !customerPhone) return;

    const seatBreakdown = Array.from(selectedSeats).sort().map((seat) => ({
      section: getSeatSection(seat),
      seat,
      price: getSeatPrice(seat),
    }));

    const booking = createBooking({
      screeningId: screening.id,
      screeningTitle: screening.title,
      venueId: screening.venueId,
      venueName: screening.venue,
      audiId: screening.audiId,
      audiName: screening.audiName,
      format: screening.format,
      language: screening.language,
      date: screening.date,
      time: screening.time,
      seats: Array.from(selectedSeats).sort(),
      totalPrice,
      seatBreakdown,
      customerName,
      customerPhone,
      paymentUpiId: organizerUpiId,
    });

    setShowTicket(booking.id);
  };

  if (showTicket) {
    return <BookingTicket bookingId={showTicket} onClose={onClose} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-card border border-border rounded-2xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl tracking-wider">{screening.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground font-body">
                {screening.audiName}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-body font-semibold ${
                screening.screenType === "imax"
                  ? "bg-screen-imax/20 text-blue-400"
                  : screening.screenType === "4dx"
                  ? "bg-screen-4dx/20 text-red-400"
                  : "bg-screen-normal/20 text-yellow-400"
              }`}>
                {screening.format}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-body">
                {screening.language}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Screen */}
        <div className="mb-6 text-center">
          <div className={`relative mx-auto ${config.screenWidth} mb-2`}>
            <div
              className="h-2 rounded-full"
              style={{
                background: `linear-gradient(90deg, transparent, ${config.glowColor}, transparent)`,
                boxShadow: `0 0 40px ${config.glowColor}, 0 0 80px ${config.glowColor}`,
              }}
            />
            <div
              className="h-8 rounded-b-[50%]"
              style={{ background: `linear-gradient(to bottom, ${config.glowColor}, transparent)` }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-body tracking-widest uppercase">{config.label}</span>
        </div>

        {/* Seat Map */}
        <div className="space-y-5 mb-6">
          {audi.sections.map((section, si) => (
            <div key={`${section.name}-${si}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-body font-medium uppercase tracking-wider ${section.color}`}>
                  {section.name} — ₹{section.price}
                </span>
              </div>
              <div className="space-y-1.5">
                {section.rows.map((audiRow) => (
                  <div key={audiRow.label} className="flex items-center gap-1 justify-center">
                    <span className="w-5 text-xs text-muted-foreground font-body text-right mr-1">{audiRow.label}</span>
                    <div className="flex gap-0.5 items-center">
                      {audiRow.segments.map((segment, segIdx) => (
                        <div key={segIdx} className={`flex gap-0.5 ${segIdx > 0 ? "ml-3 sm:ml-5" : ""}`}>
                          {segment.map((seatNum, seatIdx) => {
                            if (seatNum === 0) {
                              return <div key={`gap-${seatIdx}`} className="w-5 h-5 sm:w-6 sm:h-6" />;
                            }
                            const seatId = `${audiRow.label}${seatNum}`;
                            const isBooked = bookedSeats.has(seatId);
                            const isSelected = selectedSeats.has(seatId);

                            return (
                              <button
                                key={seatId}
                                onClick={() => toggleSeat(seatId)}
                                disabled={isBooked}
                                title={seatId}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-t-md text-[8px] sm:text-[9px] font-body font-medium transition-all duration-150 ${
                                  isBooked
                                    ? "bg-muted/50 text-muted-foreground/30 cursor-not-allowed"
                                    : isSelected
                                    ? `${config.selectedClass} scale-110 shadow-md`
                                    : "bg-secondary text-secondary-foreground hover:bg-accent hover:scale-105 cursor-pointer"
                                }`}
                              >
                                {seatNum}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    <span className="w-5 text-xs text-muted-foreground font-body ml-1">{audiRow.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mb-6 text-xs font-body text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-t-sm bg-secondary" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded-t-sm ${config.selectedClass}`} />
            Selected
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-t-sm bg-muted/50" />
            Booked
          </div>
        </div>

        {/* Summary & Booking Form */}
        <AnimatePresence>
          {selectedSeats.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="border-t border-border pt-4"
            >
              {!showBookingForm ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-body">
                      <span className="text-muted-foreground">Seats: </span>
                      <span className="text-foreground font-medium">
                        {Array.from(selectedSeats).sort().join(", ")}
                      </span>
                    </p>
                    <p className="text-sm font-body">
                      <span className="text-muted-foreground">Total: </span>
                      <span className="text-foreground font-display text-xl">₹{totalPrice}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl font-body font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${config.selectedClass}`}
                  >
                    <Check className="w-4 h-4" />
                    Proceed to Book
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-body text-muted-foreground mb-2">
                    {Array.from(selectedSeats).sort().join(", ")} · <span className="font-display text-foreground text-lg">₹{totalPrice}</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowBookingForm(false)}
                      className="px-4 py-2.5 rounded-xl font-body text-sm text-muted-foreground hover:bg-accent transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleBook}
                      disabled={!customerName || !customerPhone}
                      className={`flex-1 px-8 py-2.5 rounded-xl font-body font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40 ${config.selectedClass}`}
                    >
                      <Check className="w-4 h-4" />
                      Book & Pay — ₹{totalPrice}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    You'll get 15 minutes to pay via UPI. Booking confirmed after admin approval.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
