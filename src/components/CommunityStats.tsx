import { motion } from "framer-motion";
import { Users, Film, Tv, MapPin } from "lucide-react";
import { useCommunityStats } from "@/lib/admin-store";

export function CommunityStats() {
  const { members, screeningsDone, animeEvents, cinemaPartners } = useCommunityStats();

  const stats = [
    { icon: Users, value: `${members}+`, label: "Members", color: "text-primary" },
    { icon: Film, value: `${screeningsDone}+`, label: "Screenings Done", color: "text-cinema-gold" },
    { icon: Tv, value: `${animeEvents}+`, label: "Anime Events", color: "text-anime-cyan" },
    { icon: MapPin, value: `${cinemaPartners}+`, label: "Cinema Partners", color: "text-anime-pink" },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border/50">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
            <motion.div
              key={stat.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="font-display text-3xl md:text-4xl tracking-wider mb-1"
            >
              {stat.value}
            </motion.div>
            <div className="text-xs text-muted-foreground font-body uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
