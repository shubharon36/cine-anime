import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { mockEvents } from "@/lib/data";
import type { CommunityFilter } from "@/routes/index";

export function EventsPreview({ filter = "all" }: { filter?: CommunityFilter }) {
  const filtered =
    filter === "all"
      ? mockEvents
      : mockEvents.filter((e) =>
          filter === "cinema"
            ? e.community === "Cinema EZ" || e.community === "Both"
            : e.community === "Anime EZ" || e.community === "Both"
        );
  const list = filtered.slice(0, 3);

  const formatDate = (d: string) => {
    const dt = new Date(d);
    return { day: dt.getDate(), mon: dt.toLocaleString("en-US", { month: "short" }) };
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6 }} className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-3">
          UPCOMING{" "}
          <span style={{
            background: filter === "cinema"
              ? "linear-gradient(90deg, var(--cinema-gold), var(--cinema-amber))"
              : filter === "anime"
              ? "linear-gradient(90deg, var(--anime-purple), var(--anime-cyan))"
              : "linear-gradient(90deg, var(--cinema-gold) 0%, var(--cinema-gold) 50%, var(--anime-purple) 50%, var(--anime-purple) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>EVENTS</span>
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
            return (
              <Link key={event.id} to="/events" className="block">
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className={`group relative bg-card rounded-xl border p-5 cursor-pointer ${
                    event.community === "Cinema EZ" ? "card-cinema"
                      : event.community === "Anime EZ" ? "card-anime"
                      : "card-both"
                  }`}
                >
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
