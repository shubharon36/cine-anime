import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Tv, Calendar, Clock, MapPin, Users, Ticket, Search, Monitor } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SeatSelection } from "@/components/SeatSelection";
import { type Screening } from "@/lib/data";
import { screeningsStore } from "@/lib/admin-store";
import { getAllVenueNames } from "@/lib/venues";

export const Route = createFileRoute("/screenings")({
  head: () => ({
    meta: [
      { title: "Screenings — Cinema EZ & Anime EZ Ahmedabad" },
      { name: "description", content: "Upcoming and past film & anime screenings across Ahmedabad's best cinemas." },
      { property: "og:title", content: "Screenings — Cinema EZ & Anime EZ" },
      { property: "og:description", content: "Book tickets for exclusive screenings in Ahmedabad." },
    ],
  }),
  component: ScreeningsPage,
});

// Rotating cinematic hero backgrounds for Cinema
const cinemaHeroImages = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&q=80", // cinema hall
  "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80", // film reel
  "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&q=80", // dramatic sky
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=80", // space
  "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&q=80", // dark mood
];

// Rotating anime hero backgrounds
const animeHeroImages = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&q=80",
  "https://images.unsplash.com/photo-1607604276583-3eabe4f46cfc?w=1200&q=80",
  "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=1200&q=80",
  "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=1200&q=80",
  "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=1200&q=80",
];

function ScreeningsPage() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [typeFilter, setTypeFilter] = useState<"all" | "cinema" | "anime">("all");
  const [cinemaFilter, setCinemaFilter] = useState("All Cinemas");
  const [search, setSearch] = useState("");
  const [seatScreening, setSeatScreening] = useState<Screening | null>(null);

  // Random hero image on mount
  const heroImage = useMemo(() => {
    const imgs = typeFilter === "anime" ? animeHeroImages : cinemaHeroImages;
    return imgs[Math.floor(Math.random() * imgs.length)];
  }, [typeFilter]);

  const isAnimeMode = typeFilter === "anime";

  const filtered = screeningsStore.filter((s) => {
    if (s.status !== tab) return false;
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (cinemaFilter !== "All Cinemas" && s.venue !== cinemaFilter) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-16 pb-16">
        {/* Hero with rotating background */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img
            src={heroImage}
            alt="Screenings hero"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
          <div className="relative flex flex-col items-center justify-center h-full px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-5xl md:text-7xl tracking-wider mb-3 text-center"
            >
              <span
                className={isAnimeMode ? "text-gradient-anime" : ""}
                style={!isAnimeMode ? {
                  background: "linear-gradient(135deg, #FFD700, #DAA520, #B8860B)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                } : undefined}
              >
                SCREENINGS
              </span>
            </motion.h1>
            <p className="text-muted-foreground font-body text-sm max-w-lg mx-auto text-center">
              Exclusive film & anime screenings across Ahmedabad — PVR, Cinepolis, Miraj, Palladium & more
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-8">
          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-6 py-2.5 rounded-xl font-body text-sm font-medium transition-all ${
                tab === "upcoming" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setTab("past")}
              className={`px-6 py-2.5 rounded-xl font-body text-sm font-medium transition-all ${
                tab === "past" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              Past
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search screenings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Type Filter */}
            <div className="flex gap-1.5">
              {(["all", "cinema", "anime"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2.5 rounded-xl font-body text-xs font-medium transition-all flex items-center gap-1.5 ${
                    typeFilter === t
                      ? t === "cinema"
                        ? "bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/30"
                        : t === "anime"
                        ? "bg-anime-purple/20 text-anime-cyan border border-anime-purple/30"
                        : "bg-primary/20 text-primary border border-primary/30"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "cinema" && <Film className="w-3 h-3" />}
                  {t === "anime" && <Tv className="w-3 h-3" />}
                  {t === "all" ? "All" : t === "cinema" ? "Cinema" : "Anime"}
                </button>
              ))}
            </div>

            {/* Cinema Filter */}
            <select
              value={cinemaFilter}
              onChange={(e) => setCinemaFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground font-body text-xs focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {getAllVenueNames().map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((screening, i) => (
                <ScreeningCard
                  key={screening.id}
                  screening={screening}
                  index={i}
                  onBook={() => setSeatScreening(screening)}
                />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Ticket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-body">No screenings found matching your filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* Seat Selection Modal */}
      <AnimatePresence>
        {seatScreening && (
          <SeatSelection
            screening={seatScreening}
            onClose={() => setSeatScreening(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function ScreeningCard({ screening, index, onBook }: { screening: Screening; index: number; onBook: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={screening.image}
          alt={screening.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          width={600}
          height={400}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

        {/* Badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium ${
          screening.type === "cinema"
            ? "bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/30"
            : "bg-anime-purple/20 text-anime-cyan border border-anime-purple/30"
        }`}>
          {screening.type === "cinema" ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
          {screening.type === "cinema" ? "Cinema EZ" : "Anime EZ"}
        </div>

        {/* Format & Language badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-semibold backdrop-blur-sm ${
            screening.screenType === "imax"
              ? "bg-blue-500/80 text-white"
              : screening.screenType === "4dx"
              ? "bg-red-500/80 text-white"
              : "bg-yellow-500/80 text-background"
          }`}>
            {screening.format}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-body bg-background/70 text-foreground backdrop-blur-sm">
            {screening.language}
          </span>
          {screening.status === "past" && (
            <span className="px-2 py-0.5 rounded-full bg-muted/80 text-muted-foreground text-[10px] font-body">
              Completed
            </span>
          )}
        </div>

        {/* Seats indicator */}
        {screening.status === "upcoming" && (
          <div className="absolute bottom-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-background/80 backdrop-blur-sm text-xs font-body">
              <Users className="w-3 h-3" />
              <span className={screening.seatsBooked / screening.seatsTotal > 0.8 ? "text-cinema-red" : "text-foreground"}>
                {screening.seatsTotal - screening.seatsBooked} left
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl tracking-wider mb-1 group-hover:text-primary transition-colors">
          {screening.title}
        </h3>
        <p className="text-xs text-muted-foreground font-body mb-3 line-clamp-2">{screening.description}</p>

        <div className="space-y-1.5 text-xs text-muted-foreground font-body mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {new Date(screening.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {screening.time} · {screening.duration}
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {screening.venue}
          </div>
          <div className="flex items-center gap-1.5">
            <Monitor className="w-3 h-3" />
            {screening.audiName}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-display text-lg">₹{screening.price}</span>
          {screening.status === "upcoming" ? (
            <button
              onClick={onBook}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-body text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <Ticket className="w-3.5 h-3.5" />
              Book Now
            </button>
          ) : (
            <span className="text-xs text-muted-foreground font-body">Sold {screening.seatsBooked}/{screening.seatsTotal}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
