import { motion } from "framer-motion";
import { Button } from "../../components/Button";
import type { Patient } from "./types";

const confettiEmoji = ["✨", "🎉", "⭐", "💫"];

export function Result({
  patient,
  stars,
  coins,
  onBackToLobby,
}: {
  patient: Patient;
  stars: number;
  coins: number;
  onBackToLobby: () => void;
}) {
  const happiness = 60 + stars * 13;

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-5 px-8 text-center overflow-hidden">
      {stars === 3 &&
        confettiEmoji.map((e, i) => (
          <motion.span
            key={i}
            className="absolute text-2xl top-1/3"
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
            animate={{
              opacity: 0,
              x: (i - 1.5) * 60,
              y: -80 - i * 10,
              scale: 1.2,
              rotate: 180,
            }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            {e}
          </motion.span>
        ))}

      <p className="text-white/60 text-sm">
        {patient.name}'s treatment complete
      </p>
      <div className="flex gap-2 text-4xl">
        {[1, 2, 3].map((n) => (
          <motion.span
            key={n}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: n * 0.15, type: "spring", stiffness: 260, damping: 14 }}
          >
            {n <= stars ? "⭐" : "☆"}
          </motion.span>
        ))}
      </div>

      <div className="w-full glass rounded-2xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/60">Happiness</span>
          <span className="font-semibold">{happiness}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-dada-purple to-dada-pink"
            initial={{ width: 0 }}
            animate={{ width: `${happiness}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-1.5 text-lg font-semibold text-dada-rose"
        >
          🪙 +{coins} coins
        </motion.div>
      </div>

      <Button onClick={onBackToLobby}>Back to lobby</Button>
    </div>
  );
}
