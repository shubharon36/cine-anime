import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, ArrowRight, Pin } from "lucide-react";
import { useEvents } from "@/lib/admin-store";
import type { CommunityFilter } from "@/routes/index";

export function EventsPreview({ filter = "all" }: { filter?: CommunityFilter }) {
  const all = useEvents();
  const filtered =
    filter === "all"
      ? all
      : all.filter((e) =>
          filter === "cinema"
            ? e.community === "Cinema EZ" || e.community === "Both"
            : e.community === "Anime EZ" || e.community === "Both"
        );
  const list = filtered.slice(0, 3);

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return { day: dt.getDate(), mon: dt.toLocaleString("en-US", { month: "short" }) };
  };

  // 50/50 visual split for the EVENTS title — split letter-by-letter so each
  // half (gold "EVE" + purple "NTS") covers the same horizontal width regardless
  // of letter widths.
  const eventsTitle = (
    <span className="inline-flex items-baseline">
      <span style={{
        background: filter === "anime"
          ? "linear-gradient(90deg, var(--anime-purple), var(--anime-cyan))"
          : "linear-gradient(90deg, var(--cinema-gold), var(--cinema-amber))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>EVE</span>
      <span style={{
        background: filter === "cinema"
          ? "linear-gradient(90deg, var(--cinema-gold), var(--cinema-amber))"
          : "linear-gradient(90deg, var(--anime-purple), var(--anime-cyan))",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>NTS</span>
    </span>
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6 }} className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-3">
          UPCOMING {eventsTitle}
        </h2>
        <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
          Community gatherings, cosplay meetups, and exclusive experiences
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          {list.length === 0 && (
            <div className="text-center py-12 text-muted-foreground font-body text-sm">
              No upcoming {filter} events yet.
            </div>
          )}
          {list.map((event, i) => {
            const d = formatDate(event.date);
            // Force the correct community card class based on event.community
            const cardClass =
              event.community === "Anime EZ" ? "card-anime"
              : event.community === "Cinema EZ" ? "card-cinema"
              : "card-both";
            return (
              <Link key={event.id} to="/events" className="block">
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={`group relative bg-card rounded-xl border p-5 cursor-pointer ${cardClass}`}
                >
                  {event.pinned && (
                    <span className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body font-bold bg-yellow-400 text-black z-10">
                      <Pin className="w-2.5 h-2.5" /> PINNED
                    </span>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-center gap-2 sm:gap-0 sm:w-16 sm:py-2">
                      <span className="font-display text-2xl sm:text-3xl text-primary leading-none">{d.day}</span>
                      <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">{d.mon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-body px-2 py-0.5 rounded-full ${
                          event.community === "Cinema EZ" ? "bg-cinema-gold/10 text-cinema-gold"
                            : event.community === "Anime EZ" ? "bg-anime-purple/10 text-anime-cyan"
                            : "bg-secondary text-foreground"
                        }`}>{event.community}</span>
                        <span className="text-xs text-muted-foreground font-body capitalize">{event.type}</span>
                      </div>
                      <h3 className="font-display text-xl tracking-wider mb-1 group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-muted-foreground text-sm font-body mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-body">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-center mt-10">
        <Link to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-body text-sm font-medium hover:bg-accent transition-colors">
          View All Events <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
