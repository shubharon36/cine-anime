import { motion, AnimatePresence } from "framer-motion";
import { Film, Tv, Users, MapPin, X } from "lucide-react";
import cinemaHero from "@/assets/cinema-hero.jpg";
import animeHero from "@/assets/anime-hero.webp";
import type { CommunityFilter } from "@/routes/index";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};


export function HeroSection({
  filter,
  onFilter,
}: {
  filter: CommunityFilter;
  onFilter: (f: CommunityFilter) => void;
}) {
  const cinemaActive = filter === "cinema";
  const animeActive = filter === "anime";
  const cinemaDim = filter === "anime";
  const animeDim = filter === "cinema";

  return (
    <section className="relative min-h-screen pt-16">
      {/* Filter status bar */}
      <AnimatePresence>
        {filter !== "all" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-20"
          >
            <button
              onClick={() => onFilter("all")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/90 backdrop-blur-md border text-xs font-body font-medium"
              style={{
                borderColor: cinemaActive ? "var(--cinema-gold)" : "var(--anime-purple)",
                color: cinemaActive ? "var(--cinema-gold)" : "var(--anime-cyan)",
              }}
            >
              Showing {cinemaActive ? "Cinema EZ" : "Anime EZ"} only
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        {/* Cinema EZ Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{
            opacity: cinemaDim ? 0.35 : 1,
            x: 0,
            flex: cinemaActive ? 2 : animeActive ? 0.6 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onFilter(cinemaActive ? "all" : "cinema")}
          className="relative flex-1 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0">
            <img
              src={cinemaHero}
              alt="Cinema EZ Ahmedabad"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              width={960}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/40 md:to-background/80" />
            {cinemaActive && (
              <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 120px var(--cinema-gold)", opacity: 0.4 }} />
            )}
          </div>

          <div className="relative flex flex-col justify-end p-8 md:p-12 min-h-[50vh] md:min-h-full">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center gap-2 mb-3">
                <Film className="w-5 h-5 text-cinema-gold" />
                <span className="text-xs font-body uppercase tracking-[0.2em] text-cinema-gold">
                  Film Community {cinemaActive && "· Active"}
                </span>
              </div>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider leading-none mb-4"
            >
              <span className="text-gradient-gold">CINEMA</span>
              <br />
              <span className="text-foreground">EZ</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="font-body text-muted-foreground text-sm md:text-base max-w-sm mb-4">
              Ahmedabad's cinephile community. Exclusive screenings, film discussions, and a shared love for cinema.
            </motion.p>

            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 80+ Members</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Ahmedabad</span>
            </motion.div>

            <motion.span
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-4 text-[10px] uppercase tracking-widest text-cinema-gold/70 font-body"
            >
              {cinemaActive ? "Click again to show all →" : "Click to filter Cinema content →"}
            </motion.span>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gradient-to-b from-cinema-gold/20 via-border to-anime-purple/20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
            <span className="font-display text-xs text-muted-foreground">&</span>
          </div>
        </div>

        {/* Anime EZ Side */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{
            opacity: animeDim ? 0.35 : 1,
            x: 0,
            flex: animeActive ? 2 : cinemaActive ? 0.6 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          onClick={() => onFilter(animeActive ? "all" : "anime")}
          className="relative flex-1 overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0">
            <img
              src={animeHero}
              alt="Anime EZ Ahmedabad"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              width={960}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/40 md:to-background/80" />
            {animeActive && (
              <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 120px var(--anime-purple)", opacity: 0.4 }} />
            )}
          </div>

          <div className="relative flex flex-col justify-end p-8 md:p-12 min-h-[50vh] md:min-h-full md:items-end md:text-right">
            <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center gap-2 mb-3 md:justify-end">
                <Tv className="w-5 h-5 text-anime-cyan" />
                <span className="text-xs font-body uppercase tracking-[0.2em] text-anime-cyan">
                  Anime Community {animeActive && "· Active"}
                </span>
              </div>
            </motion.div>

            <motion.h1 custom={1.5} variants={fadeUp} initial="hidden" animate="visible"
              className="font-display text-5xl md:text-7xl lg:text-8xl tracking-wider leading-none mb-4">
              <span className="text-gradient-anime">ANIME</span>
              <br />
              <span className="text-foreground">EZ</span>
            </motion.h1>

            <motion.p custom={2.5} variants={fadeUp} initial="hidden" animate="visible"
              className="font-body text-muted-foreground text-sm md:text-base max-w-sm mb-4">
              Ahmedabad's anime community. Exclusive screenings, cosplay events, and a vibrant otaku culture.
            </motion.p>

            <motion.div custom={3.5} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 80+ Members</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Ahmedabad</span>
            </motion.div>

            <motion.span
              custom={4.5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-4 text-[10px] uppercase tracking-widest text-anime-cyan/70 font-body"
            >
              {animeActive ? "← Click again to show all" : "← Click to filter Anime content"}
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground font-body tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border border-muted-foreground/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-1.5 rounded-full bg-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
