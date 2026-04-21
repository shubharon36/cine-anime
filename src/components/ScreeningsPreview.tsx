import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Tv, Calendar, MapPin, Clock, ArrowRight, Pin } from "lucide-react";
import { useScreenings } from "@/lib/admin-store";
import type { CommunityFilter } from "@/routes/index";

export function ScreeningsPreview({ filter = "all" }: { filter?: CommunityFilter }) {
  const all = useScreenings();
  const upcoming = all.filter((s) => s.status === "upcoming");
  const filtered = filter === "all" ? upcoming : upcoming.filter((s) => s.type === filter);
  const list = filtered.slice(0, 4);

  const titleClass =
    filter === "anime" ? "text-gradient-anime"
    : "text-gradient-gold";

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6 }} className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl tracking-wider mb-3">
          UPCOMING <span className={titleClass}>SCREENINGS</span>
        </h2>
        <p className="text-muted-foreground font-body text-sm max-w-md mx-auto">
          {filter === "cinema" ? "Curated cinema screenings across Ahmedabad" :
           filter === "anime" ? "Anime film screenings & watch parties" :
           "Exclusive film & anime screenings across Ahmedabad's best cinemas"}
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {list.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground font-body text-sm">
              No upcoming {filter} screenings yet.
            </div>
          )}
          {list.map((screening, i) => {
            const themeStyle = screening.themeGradient
              ? { background: screening.themeGradient, padding: "1px" }
              : screening.themeColor
              ? { background: screening.themeColor, padding: "1px" }
              : undefined;
            const cardClasses = `group relative bg-card rounded-xl overflow-hidden border cursor-pointer ${
              !themeStyle ? (screening.type === "cinema" ? "card-cinema" : "card-anime") : ""
            }`;

            const Inner = (
              <Link to="/screenings" className="block h-full">
                <div className={cardClasses}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={screening.image} alt={screening.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy" width={400} height={300} />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-medium ${
                      screening.type === "cinema"
                        ? "bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/30"
                        : "bg-anime-purple/20 text-anime-cyan border border-anime-purple/30"
                    }`}>
                      {screening.type === "cinema" ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                      {screening.type === "cinema" ? "Cinema EZ" : "Anime EZ"}
                    </div>
                    <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                      {screening.pinned && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-body font-bold bg-yellow-400/90 text-black">
                          <Pin className="w-2.5 h-2.5" /> PINNED
                        </span>
                      )}
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-body font-bold ${
                        screening.screenType === "imax" ? "bg-blue-500/30 text-blue-200"
                          : screening.screenType === "4dx" ? "bg-red-500/30 text-red-200"
                          : "bg-yellow-500/30 text-yellow-200"
                      }`}>{screening.format}</div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-display text-lg tracking-wider mb-2 group-hover:text-primary transition-colors">
                      {screening.title}
                    </h3>
                    <div className="space-y-1.5 text-xs text-muted-foreground font-body">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{screening.date}</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{screening.time}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{screening.venue}</div>
                    </div>
                  </div>
                </div>
              </Link>
            );

            return (
              <motion.div key={screening.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-xl"
                style={themeStyle}
              >
                {Inner}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-center mt-10">
        <Link to="/screenings"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-body text-sm font-medium hover:bg-accent transition-colors">
          View All Screenings <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
