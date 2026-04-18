import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Search, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { type CinemaEvent } from "@/lib/data";
import { eventsStore } from "@/lib/admin-store";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Cinema EZ & Anime EZ Ahmedabad" },
      { name: "description", content: "Community events, meetups, cosplay gatherings, and workshops by Cinema EZ & Anime EZ." },
      { property: "og:title", content: "Events — Cinema EZ & Anime EZ" },
      { property: "og:description", content: "Join our community events in Ahmedabad." },
    ],
  }),
  component: EventsPage,
});

const typeLabels: Record<string, string> = {
  all: "All Events",
  meetup: "Meetups",
  cosplay: "Cosplay",
  screening: "Screenings",
  workshop: "Workshops",
  festival: "Festivals",
};

const communityColors: Record<string, string> = {
  "Cinema EZ": "bg-cinema-gold/10 text-cinema-gold border-cinema-gold/30",
  "Anime EZ": "bg-anime-purple/10 text-anime-cyan border-anime-purple/30",
  "Both": "bg-primary/10 text-primary border-primary/30",
};

function EventsPage() {
  const [communityFilter, setCommunityFilter] = useState<"all" | "Cinema EZ" | "Anime EZ">("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const filtered = eventsStore.filter((e) => {
    if (communityFilter !== "all" && e.community !== communityFilter && e.community !== "Both") return false;
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-3">
            <span
              style={{
                background: "linear-gradient(90deg, var(--cinema-gold) 0%, var(--cinema-gold) 45%, var(--anime-purple) 55%, var(--anime-purple) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >EVENTS</span>
          </h1>
          <p className="text-muted-foreground font-body text-sm max-w-lg mx-auto">
            Community gatherings, cosplay meets, film workshops, and mega festivals
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Community toggle */}
          <div className="flex gap-1.5">
            {(["all", "Cinema EZ", "Anime EZ"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCommunityFilter(c)}
                className={`px-4 py-2.5 rounded-xl font-body text-xs font-medium transition-all ${
                  communityFilter === c
                    ? c === "Cinema EZ"
                      ? "bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/30"
                      : c === "Anime EZ"
                      ? "bg-anime-purple/20 text-anime-cyan border border-anime-purple/30"
                      : "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {c === "all" ? "All" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(typeLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTypeFilter(key)}
              className={`px-3 py-1.5 rounded-lg font-body text-xs transition-all ${
                typeFilter === key
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((event, i) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className={`group bg-card rounded-xl border overflow-hidden cursor-pointer ${
                  event.community === "Cinema EZ" ? "card-cinema" : event.community === "Anime EZ" ? "card-anime" : "card-both"
                }`}
                onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="relative sm:w-56 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      width={400}
                      height={300}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/50 hidden sm:block" />
                  </div>

                  <div className="flex-1 p-5">
                    {/* Tags */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-body px-2 py-0.5 rounded-full border ${communityColors[event.community] || communityColors["Both"]}`}>
                        {event.community}
                      </span>
                      <span className="text-xs text-muted-foreground font-body capitalize">{event.type}</span>
                    </div>

                    <h3 className="font-display text-xl md:text-2xl tracking-wider mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-body mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(event.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.attendees}/{event.maxAttendees}
                      </span>
                    </div>

                    {/* Attendance bar */}
                    <div className="w-full h-1.5 bg-secondary rounded-full mb-3">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      />
                    </div>

                    {/* Always show description, expand for RSVP */}
                    <p className="text-sm text-muted-foreground font-body mb-3 line-clamp-2">{event.description}</p>

                    <AnimatePresence>
                      {expandedEvent === event.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-muted-foreground font-body mb-4">{event.description}</p>
                          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-xs font-semibold hover:opacity-90 transition-opacity">
                            <Sparkles className="w-3.5 h-3.5" />
                            RSVP Now
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body">No events found matching your filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
