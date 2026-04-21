import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Users, Film, Calendar, Shield, Crown, UserCheck, Trash2, Plus, Edit3,
  Save, X, ChevronDown, Ticket, Clock, MapPin, Image, CreditCard, CheckCircle, XCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  membersStore, screeningsStore, eventsStore, currentUser,
  addScreening, updateScreening, deleteScreening,
  addEvent, updateEvent, deleteEvent,
  updateMemberRole, isAdminOrOwner,
  type UserRole, type CommunityMember,
} from "@/lib/admin-store";
import { type Screening, type CinemaEvent, type ScreenType, type ScreenFormat } from "@/lib/data";
import { VENUES, type Venue, type Auditorium } from "@/lib/venues";
import { bookingsStore, updateBookingStatus, type Booking, type BookingStatus } from "@/lib/bookings";
import { ThemePicker } from "@/components/admin/ThemePicker";
import { ImagePicker } from "@/components/admin/ImagePicker";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Cinema EZ & Anime EZ" },
      { name: "description", content: "Manage screenings, events, and community members." },
    ],
  }),
  component: AdminPage,
});

const roleIcons: Record<UserRole, typeof Crown> = { owner: Crown, admin: Shield, member: UserCheck };
const roleColors: Record<UserRole, string> = {
  owner: "text-cinema-gold bg-cinema-gold/10 border-cinema-gold/30",
  admin: "text-anime-cyan bg-anime-cyan/10 border-anime-cyan/30",
  member: "text-muted-foreground bg-secondary border-border",
};

type AdminTab = "screenings" | "events" | "bookings" | "members";

function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("screenings");
  const [, forceUpdate] = useState(0);
  const refresh = () => forceUpdate((n) => n + 1);

  if (!isAdminOrOwner()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-3xl tracking-wider mb-2">Access Denied</h1>
          <p className="text-muted-foreground font-body">Only admins and owners can access this page.</p>
        </div>
      </div>
    );
  }

  const tabs: { key: AdminTab; label: string; icon: typeof Users }[] = [
    { key: "screenings", label: "Screenings", icon: Ticket },
    { key: "events", label: "Events", icon: Calendar },
    { key: "bookings", label: "Payments", icon: CreditCard },
    { key: "members", label: "Members", icon: Users },
  ];

  const pendingCount = bookingsStore.filter((b) => b.status === "payment_submitted").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="font-display text-4xl md:text-5xl tracking-wider">ADMIN PANEL</h1>
          </div>
          <p className="text-muted-foreground font-body text-sm">
            Manage screenings, events, and community — {currentUser.name} ({currentUser.role})
          </p>
        </motion.div>

        <div className="flex gap-2 mb-8 border-b border-border pb-3 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.key === "bookings" && pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-destructive text-destructive-foreground text-[10px]">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "members" && <MembersTab refresh={refresh} />}
        {tab === "screenings" && <ScreeningsTab refresh={refresh} />}
        {tab === "events" && <EventsTab refresh={refresh} />}
        {tab === "bookings" && <BookingsTab refresh={refresh} />}
      </main>
      <Footer />
    </div>
  );
}

/* ── Members Tab ── */
function MembersTab({ refresh }: { refresh: () => void }) {
  const handleRoleChange = (memberId: string, newRole: UserRole) => {
    if (memberId === currentUser.id) return;
    updateMemberRole(memberId, newRole);
    refresh();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl tracking-wider">Community Members</h2>
        <span className="text-sm text-muted-foreground font-body">{membersStore.length} members</span>
      </div>
      {membersStore.map((member) => {
        const Icon = roleIcons[member.role];
        return (
          <motion.div key={member.id} layout className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-display text-lg">
                {member.name.charAt(0)}
              </div>
              <div>
                <p className="font-body font-medium text-sm">{member.name}</p>
                <p className="text-xs text-muted-foreground font-body">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {member.id === currentUser.id ? (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium border ${roleColors[member.role]}`}>
                  <Icon className="w-3 h-3" />{member.role.toUpperCase()} (You)
                </span>
              ) : currentUser.role === "owner" ? (
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                  className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs font-body focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              ) : (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-body font-medium border ${roleColors[member.role]}`}>
                  <Icon className="w-3 h-3" />{member.role.toUpperCase()}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── Screenings Tab ── */
function ScreeningsTab({ refresh }: { refresh: () => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl tracking-wider">Manage Screenings</h2>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-xs font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" />Add Screening
        </button>
      </div>

      <AnimatePresence>
        {creating && (
          <ScreeningForm onSave={(s) => { addScreening(s); setCreating(false); refresh(); }} onCancel={() => setCreating(false)} />
        )}
      </AnimatePresence>

      <div className="space-y-3 mt-4">
        {screeningsStore.map((screening) => (
          <motion.div key={screening.id} layout className="bg-card rounded-xl border border-border p-4">
            {editing === screening.id ? (
              <ScreeningForm initial={screening} onSave={(updated) => { updateScreening(screening.id, updated); setEditing(null); refresh(); }} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={screening.image} alt={screening.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg tracking-wider">{screening.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-body font-medium ${
                        screening.status === "upcoming" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>{screening.status}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-body font-semibold ${
                        screening.screenType === "imax" ? "bg-blue-500/20 text-blue-400"
                          : screening.screenType === "4dx" ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}>{screening.format}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-body">{screening.language}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body">
                      {screening.date} · {screening.time} · {screening.venue} · {screening.audiName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(screening.id)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => { deleteScreening(screening.id); refresh(); }} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Screening Form ── */
function ScreeningForm({ initial, onSave, onCancel }: { initial?: Screening; onSave: (s: Screening) => void; onCancel: () => void }) {
  const [selectedVenueId, setSelectedVenueId] = useState(initial?.venueId || VENUES[0]?.id || "");
  const selectedVenue = VENUES.find((v) => v.id === selectedVenueId);
  const [selectedAudiId, setSelectedAudiId] = useState(initial?.audiId || selectedVenue?.auditoriums[0]?.id || "");
  const selectedAudi = selectedVenue?.auditoriums.find((a) => a.id === selectedAudiId);

  const formatOptions: ScreenFormat[] = ["2D", "3D", "IMAX 2D", "IMAX 3D", "4DX", "4DX 3D"];

  const getScreenType = (format: ScreenFormat): ScreenType => {
    if (format.startsWith("IMAX")) return "imax";
    if (format.startsWith("4DX")) return "4dx";
    return "normal";
  };

  const [form, setForm] = useState({
    title: initial?.title || "",
    type: initial?.type || "cinema" as "cinema" | "anime",
    date: initial?.date || "",
    time: initial?.time || "",
    format: initial?.format || (selectedAudi?.format || "2D") as ScreenFormat,
    image: initial?.image || "",
    description: initial?.description || "",
    director: initial?.director || "",
    duration: initial?.duration || "",
    language: initial?.language || "English",
    price: initial?.price || 200,
    status: initial?.status || "upcoming" as "upcoming" | "past",
    seatsTotal: initial?.seatsTotal || 150,
    seatsBooked: initial?.seatsBooked || 0,
    themeColor: initial?.themeColor || "",
    themeGradient: initial?.themeGradient || "",
    posterUrl: initial?.posterUrl || "",
  });

  const update = (key: string, value: string | number) => setForm((f) => ({ ...f, [key]: value }));

  const handleVenueChange = (venueId: string) => {
    setSelectedVenueId(venueId);
    const venue = VENUES.find((v) => v.id === venueId);
    if (venue?.auditoriums.length) {
      setSelectedAudiId(venue.auditoriums[0].id);
    } else {
      setSelectedAudiId("");
    }
  };

  const handleSubmit = () => {
    const venue = VENUES.find((v) => v.id === selectedVenueId);
    const audi = venue?.auditoriums.find((a) => a.id === selectedAudiId);
    onSave({
      id: initial?.id || `s${Date.now()}`,
      ...form,
      screenType: getScreenType(form.format),
      venue: venue?.name || "",
      venueId: selectedVenueId,
      venueFull: venue ? `${venue.name}, ${venue.address}` : "",
      audiId: selectedAudiId,
      audiName: audi?.name || "TBD",
    } as Screening);
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
      className="space-y-4 p-4 bg-secondary/50 rounded-xl border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField label="Title" value={form.title} onChange={(v) => update("title", v)} />
        <InputField label="Director" value={form.director} onChange={(v) => update("director", v)} />
        <InputField label="Date" value={form.date} onChange={(v) => update("date", v)} type="date" />
        <InputField label="Time" value={form.time} onChange={(v) => update("time", v)} placeholder="7:00 PM" />

        {/* Venue */}
        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Venue</label>
          <select value={selectedVenueId} onChange={(e) => handleVenueChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring">
            {VENUES.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>

        {/* Audi */}
        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Auditorium</label>
          <select value={selectedAudiId} onChange={(e) => setSelectedAudiId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring">
            {selectedVenue?.auditoriums.length ? (
              selectedVenue.auditoriums.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)
            ) : (
              <option value="">No auditoriums set up yet</option>
            )}
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Screen Format</label>
          <select value={form.format} onChange={(e) => update("format", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring">
            {formatOptions.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Community</label>
          <select value={form.type} onChange={(e) => update("type", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="cinema">Cinema EZ</option>
            <option value="anime">Anime EZ</option>
          </select>
        </div>

        <InputField label="Duration" value={form.duration} onChange={(v) => update("duration", v)} placeholder="2h 30min" />
        <InputField label="Language" value={form.language} onChange={(v) => update("language", v)} />
        <InputField label="Price (₹)" value={String(form.price)} onChange={(v) => update("price", Number(v))} type="number" />
        <InputField label="Total Seats" value={String(form.seatsTotal)} onChange={(v) => update("seatsTotal", Number(v))} type="number" />
        <ImagePicker label="Card Image" value={form.image} onChange={(v) => update("image", v)} searchTitle={form.title} placeholder="https://... or upload" />
        <ImagePicker label="Official Poster" value={form.posterUrl || ""} onChange={(v) => update("posterUrl", v)} searchTitle={form.title} placeholder="Poster URL or upload" />
        <ThemePicker
          value={{ themeColor: form.themeColor, themeGradient: form.themeGradient }}
          onChange={(t) => setForm((f) => ({ ...f, themeColor: t.themeColor || "", themeGradient: t.themeGradient || "" }))}
        />
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-body mb-1 block">Description</label>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring min-h-[60px]" />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body text-muted-foreground hover:bg-accent">
          <X className="w-3.5 h-3.5" />Cancel
        </button>
        <button onClick={handleSubmit} className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-body font-semibold hover:opacity-90">
          <Save className="w-3.5 h-3.5" />{initial ? "Update" : "Create"}
        </button>
      </div>
    </motion.div>
  );
}

/* ── Bookings / Payments Tab ── */
function BookingsTab({ refresh }: { refresh: () => void }) {
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");

  const filtered = filter === "all"
    ? bookingsStore
    : bookingsStore.filter((b) => b.status === filter);

  const handleApprove = (id: string) => {
    updateBookingStatus(id, "confirmed");
    refresh();
  };

  const handleReject = (id: string) => {
    updateBookingStatus(id, "rejected");
    refresh();
  };

  const statusBadge = (status: BookingStatus) => {
    const map: Record<BookingStatus, string> = {
      pending_payment: "bg-yellow-500/20 text-yellow-400",
      payment_submitted: "bg-blue-500/20 text-blue-400",
      confirmed: "bg-green-500/20 text-green-400",
      rejected: "bg-destructive/20 text-destructive",
      expired: "bg-muted text-muted-foreground",
    };
    return map[status] || "bg-secondary text-muted-foreground";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl tracking-wider">Payment Approvals</h2>
        <span className="text-sm text-muted-foreground font-body">{bookingsStore.length} bookings</span>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto">
        {(["all", "payment_submitted", "pending_payment", "confirmed", "rejected", "expired"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-body whitespace-nowrap transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f === "payment_submitted" ? "Awaiting Approval" : f === "pending_payment" ? "Pending Payment" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <CreditCard className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground font-body text-sm">No bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <motion.div key={booking.id} layout className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-display text-base tracking-wider">{booking.screeningTitle}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body font-medium ${statusBadge(booking.status)}`}>
                      {booking.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-body space-y-0.5">
                    <p><strong>ID:</strong> {booking.id} · <strong>Customer:</strong> {booking.customerName} ({booking.customerPhone})</p>
                    <p><strong>Seats:</strong> {booking.seats.join(", ")} · <strong>Total:</strong> ₹{booking.totalPrice}</p>
                    <p><strong>Venue:</strong> {booking.venueName} · {booking.audiName} · {booking.format}</p>
                    <p><strong>Date:</strong> {booking.date} · {booking.time}</p>
                    {booking.transactionId && (
                      <p><strong>Transaction ID:</strong> <span className="text-foreground font-medium">{booking.transactionId}</span></p>
                    )}
                  </div>
                </div>

                {booking.status === "payment_submitted" && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleApprove(booking.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-500/20 text-green-400 text-xs font-body font-semibold hover:bg-green-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />Approve
                    </button>
                    <button onClick={() => handleReject(booking.id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-destructive/20 text-destructive text-xs font-body font-semibold hover:bg-destructive/30">
                      <XCircle className="w-3.5 h-3.5" />Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Events Tab ── */
function EventsTab({ refresh }: { refresh: () => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl tracking-wider">Manage Events</h2>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-xs font-semibold hover:opacity-90">
          <Plus className="w-4 h-4" />Add Event
        </button>
      </div>

      <AnimatePresence>
        {creating && (
          <EventForm onSave={(e) => { addEvent(e); setCreating(false); refresh(); }} onCancel={() => setCreating(false)} />
        )}
      </AnimatePresence>

      <div className="space-y-3 mt-4">
        {eventsStore.map((event) => (
          <motion.div key={event.id} layout className="bg-card rounded-xl border border-border p-4">
            {editing === event.id ? (
              <EventForm initial={event} onSave={(updated) => { updateEvent(event.id, updated); setEditing(null); refresh(); }} onCancel={() => setEditing(null)} />
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={event.image} alt={event.title} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h3 className="font-display text-lg tracking-wider">{event.title}</h3>
                    <p className="text-xs text-muted-foreground font-body">{event.date} · {event.time} · {event.community} · {event.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setEditing(event.id)} className="p-2 rounded-lg hover:bg-accent text-muted-foreground"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => { deleteEvent(event.id); refresh(); }} className="p-2 rounded-lg hover:bg-destructive/20 text-destructive"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Event Form ── */
function EventForm({ initial, onSave, onCancel }: { initial?: CinemaEvent; onSave: (e: CinemaEvent) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    date: initial?.date || "",
    time: initial?.time || "",
    location: initial?.location || "",
    community: initial?.community || "Cinema EZ" as "Cinema EZ" | "Anime EZ" | "Both",
    type: initial?.type || "meetup" as CinemaEvent["type"],
    image: initial?.image || "",
    maxAttendees: initial?.maxAttendees || 50,
    attendees: initial?.attendees || 0,
  });
  const update = (key: string, value: string | number) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
      className="space-y-4 p-4 bg-secondary/50 rounded-xl border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField label="Title" value={form.title} onChange={(v) => update("title", v)} />
        <InputField label="Date" value={form.date} onChange={(v) => update("date", v)} type="date" />
        <InputField label="Time" value={form.time} onChange={(v) => update("time", v)} placeholder="4:00 PM" />
        <InputField label="Location" value={form.location} onChange={(v) => update("location", v)} />
        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Community</label>
          <select value={form.community} onChange={(e) => update("community", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="Cinema EZ">Cinema EZ</option>
            <option value="Anime EZ">Anime EZ</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-body mb-1 block">Type</label>
          <select value={form.type} onChange={(e) => update("type", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="meetup">Meetup</option>
            <option value="cosplay">Cosplay</option>
            <option value="screening">Screening</option>
            <option value="workshop">Workshop</option>
            <option value="festival">Festival</option>
          </select>
        </div>
        <ImagePicker label="Event Image" value={form.image} onChange={(v) => update("image", v)} placeholder="https://... or upload" />
        <InputField label="Max Attendees" value={String(form.maxAttendees)} onChange={(v) => update("maxAttendees", Number(v))} type="number" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground font-body mb-1 block">Description</label>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring min-h-[60px]" />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-body text-muted-foreground hover:bg-accent">
          <X className="w-3.5 h-3.5" />Cancel
        </button>
        <button onClick={() => onSave({ id: initial?.id || `e${Date.now()}`, ...form } as CinemaEvent)}
          className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-body font-semibold hover:opacity-90">
          <Save className="w-3.5 h-3.5" />{initial ? "Update" : "Create"}
        </button>
      </div>
    </motion.div>
  );
}

/* ── Reusable Input ── */
function InputField({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-body mb-1 block">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring" />
    </div>
  );
}
/* ── Stats Editor (live override of homepage numbers + UPI ID) ── */
function StatsEditor() {
  const override = useStatsOverride();
  const [upi, setUpi] = useState(organizerUpiId);
  const fields: { key: "members" | "screeningsDone" | "animeEvents" | "cinemaPartners"; label: string }[] = [
    { key: "members", label: "Members" },
    { key: "screeningsDone", label: "Screenings Done" },
    { key: "animeEvents", label: "Anime Events" },
    { key: "cinemaPartners", label: "Cinema Partners" },
  ];
  return (
    <div className="bg-card rounded-xl border border-border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-lg tracking-wider">Homepage Stats & Payment</h3>
        <button onClick={() => setStatsOverride({})} className="text-[11px] font-body text-muted-foreground hover:text-foreground">
          Auto (use live counts)
        </button>
      </div>
      <p className="text-xs text-muted-foreground font-body mb-3">
        Leave blank to auto-count. Numbers update live across the site.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {fields.map((f) => (
          <div key={f.key}>
            <label className="text-[11px] text-muted-foreground font-body mb-1 block">{f.label}</label>
            <input
              type="number"
              value={override[f.key] ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setStatsOverride({ ...override, [f.key]: v === "" ? undefined : Number(v) });
              }}
              placeholder="auto"
              className="w-full px-2 py-1.5 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="text-[11px] text-muted-foreground font-body mb-1 block">Organizer UPI ID (for ticket payments)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
            placeholder="cinemaaz@upi"
            className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button onClick={() => setOrganizerUpiId(upi)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-body font-semibold hover:opacity-90">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

