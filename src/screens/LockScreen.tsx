import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatusBar } from "../components/StatusBar";
import { HomeIndicator } from "../components/HomeIndicator";

function greeting(hour: number) {
  if (hour < 12) return "Good morning Dada ☀️";
  if (hour < 18) return "Good afternoon Dada 🌤️";
  return "Good evening Dada 🌙";
}

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, #241a3d 0%, #0d0b18 55%, #05040a 100%)",
      }}
    >
      <StatusBar />
      <div className="absolute inset-0 flex flex-col items-center pt-28 gap-2">
        <p className="text-sm text-white/60">{date}</p>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-7xl font-semibold tracking-tight"
        >
          {time}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base text-white/80 mt-4"
        >
          {greeting(now.getHours())}
        </motion.p>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 pb-8 cursor-grab active:cursor-grabbing"
        drag="y"
        dragConstraints={{ top: -220, bottom: 0 }}
        dragElastic={{ top: 0.15, bottom: 0.3 }}
        onDragEnd={(_, info) => {
          if (info.offset.y < -70 || info.velocity.y < -400) onUnlock();
        }}
      >
        <motion.span
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/50 text-xs tracking-wide"
        >
          swipe up to unlock
        </motion.span>
        <div className="w-32 h-1 rounded-full bg-white/60" />
      </motion.div>

      <HomeIndicator />
    </motion.div>
  );
}
