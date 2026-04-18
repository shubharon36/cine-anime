import { motion } from "framer-motion";
import { Users, Film, Tv, Calendar, Star, MapPin } from "lucide-react";

const stats = [
  { icon: Users, value: "80+", label: "Members", color: "text-primary" },
  { icon: Film, value: "50+", label: "Screenings Done", color: "text-cinema-gold" },
  { icon: Tv, value: "30+", label: "Anime Events", color: "text-anime-cyan" },
  { icon: MapPin, value: "10+", label: "Cinema Partners", color: "text-anime-pink" },
];

export function CommunityStats() {
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
            <div className="font-display text-3xl md:text-4xl tracking-wider mb-1">{stat.value}</div>
            <div className="text-xs text-muted-foreground font-body uppercase tracking-wider">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
