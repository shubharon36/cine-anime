import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Random anime character welcome animation.
 * Pops up huge in the middle, does something cool, fades away.
 * Uses styled emoji + custom SVG aura since we can't bundle copyrighted character art.
 * Each character has its own signature move + colors.
 */

type Character = {
  id: string;
  name: string;
  emoji: string;
  catchphrase: string;
  auraColor: string;
  auraColor2: string;
  move: string;
};

const CHARACTERS: Character[] = [
  { id: "goku", name: "Goku", emoji: "🥋", catchphrase: "KA・ME・HA・ME・HAAAA!!!", auraColor: "#FFD700", auraColor2: "#FF6B00", move: "ki-blast" },
  { id: "naruto", name: "Naruto", emoji: "🍥", catchphrase: "RASENGAN!!!", auraColor: "#FF8C00", auraColor2: "#1E90FF", move: "spin" },
  { id: "luffy", name: "Luffy", emoji: "🏴‍☠️", catchphrase: "GOMU GOMU NO... PISTOL!", auraColor: "#FF1744", auraColor2: "#FFD600", move: "stretch" },
  { id: "vegeta", name: "Vegeta", emoji: "👑", catchphrase: "FINAL FLASH!", auraColor: "#00E5FF", auraColor2: "#9C27B0", move: "ki-blast" },
  { id: "ichigo", name: "Ichigo", emoji: "⚔️", catchphrase: "GETSUGA TENSHOU!", auraColor: "#000000", auraColor2: "#FF1744", move: "slash" },
  { id: "tanjiro", name: "Tanjiro", emoji: "🗡️", catchphrase: "WATER BREATHING!", auraColor: "#0288D1", auraColor2: "#26C6DA", move: "slash" },
  { id: "gojo", name: "Gojo", emoji: "🌀", catchphrase: "INFINITY!", auraColor: "#00BFFF", auraColor2: "#FFFFFF", move: "spin" },
  { id: "saitama", name: "Saitama", emoji: "👊", catchphrase: "ONE PUNCH!", auraColor: "#FFEB3B", auraColor2: "#F44336", move: "punch" },
  { id: "piccolo", name: "Piccolo", emoji: "🟢", catchphrase: "SPECIAL BEAM CANNON!", auraColor: "#43A047", auraColor2: "#9C27B0", move: "ki-blast" },
  { id: "zoro", name: "Zoro", emoji: "🥷", catchphrase: "ONIGIRI!", auraColor: "#43A047", auraColor2: "#212121", move: "slash" },
];

export function WelcomeAnimation({
  username,
  showGreeting,
  onDone,
}: {
  username?: string;
  showGreeting: boolean;
  onDone: () => void;
}) {
  const [character] = useState<Character>(() => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]);
  const [phase, setPhase] = useState<"enter" | "power" | "exit">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("power"), 1200);
    const t2 = setTimeout(() => setPhase("exit"), 4000);
    const t3 = setTimeout(() => onDone(), 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${character.auraColor}33 0%, ${character.auraColor2}22 40%, rgba(0,0,0,0.85) 100%)`,
          }}
        >
          {/* Energy rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: phase === "power" ? 4 : 2, opacity: 0 }}
              transition={{ duration: 1.6, delay: i * 0.4, repeat: Infinity }}
              className="absolute rounded-full border-4"
              style={{
                width: 300, height: 300,
                borderColor: character.auraColor,
                boxShadow: `0 0 60px ${character.auraColor}`,
              }}
            />
          ))}

          {/* Aura burst */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: phase === "power" ? [1, 1.2, 1.1] : 1,
              opacity: 1,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute rounded-full blur-3xl"
            style={{
              width: 500,
              height: 500,
              background: `radial-gradient(circle, ${character.auraColor} 0%, ${character.auraColor2} 50%, transparent 80%)`,
              opacity: 0.6,
            }}
          />

          {/* Character */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{
              scale: phase === "power" ? [1, 1.15, 1] : 1,
              rotate: 0,
              opacity: 1,
              y: phase === "power" ? [0, -20, 0] : 0,
            }}
            transition={{
              scale: { duration: 0.8, type: "spring" as const, bounce: 0.5 },
              rotate: { duration: 0.8 },
              y: { duration: 1, repeat: phase === "power" ? Infinity : 0, repeatType: "reverse" as const },
            }}
            className="relative flex flex-col items-center"
          >
            <div
              className="text-[200px] md:text-[280px] leading-none select-none"
              style={{
                filter: `drop-shadow(0 0 40px ${character.auraColor}) drop-shadow(0 0 80px ${character.auraColor2})`,
              }}
            >
              {character.emoji}
            </div>

            {/* Catchphrase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: phase === "power" ? 1 : 0, scale: phase === "power" ? [0.8, 1.1, 1] : 0.5 }}
              transition={{ duration: 0.5 }}
              className="mt-4 font-display text-3xl md:text-5xl tracking-widest text-center px-6 py-3 rounded-2xl"
              style={{
                color: "#fff",
                textShadow: `0 0 20px ${character.auraColor}, 0 0 40px ${character.auraColor2}`,
                background: `linear-gradient(135deg, ${character.auraColor}33, ${character.auraColor2}33)`,
                border: `2px solid ${character.auraColor}`,
              }}
            >
              {character.catchphrase}
            </motion.div>

            {/* Welcome cloud bubble (only first time after login) */}
            {showGreeting && username && (
              <motion.div
                initial={{ opacity: 0, x: 80, y: -100, scale: 0 }}
                animate={{ opacity: 1, x: 240, y: -180, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring" as const }}
                className="absolute top-0 right-0 hidden md:block"
              >
                <div className="relative">
                  <div className="bg-white text-black rounded-[40px] px-6 py-4 font-display text-2xl tracking-wider shadow-2xl whitespace-nowrap">
                    Welcome, {username}!
                  </div>
                  {/* cloud puffs */}
                  <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rounded-full" />
                  <div className="absolute -bottom-5 left-2 w-3 h-3 bg-white rounded-full" />
                  <div className="absolute -bottom-7 -left-1 w-2 h-2 bg-white rounded-full" />
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Speed lines */}
          {phase === "power" && Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`line-${i}`}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.6, delay: i * 0.05, repeat: Infinity, repeatDelay: 0.4 }}
              className="absolute h-0.5"
              style={{
                width: 200,
                background: `linear-gradient(90deg, transparent, ${character.auraColor}, transparent)`,
                top: `${10 + (i * 7)}%`,
                left: i % 2 === 0 ? "5%" : "auto",
                right: i % 2 === 1 ? "5%" : "auto",
                transformOrigin: i % 2 === 0 ? "left" : "right",
              }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
