import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dada1 from "../assets/pic/dada1.jpg";
import dada2 from "../assets/pic/dada2.jpg";
import dada3 from "../assets/pic/dada3.jpg";
import dada4 from "../assets/pic/dada4.jpg";
import dada5 from "../assets/pic/dada5.jpg";
import dada6 from "../assets/pic/dada6.jpg";

const photos = [dada1, dada2, dada3, dada4, dada5, dada6];

function greeting(hour: number) {
  if (hour < 12) return "Good morning Dada ☀️";
  if (hour < 18) return "Good afternoon Dada 🌤️";
  return "Good evening Dada 🌙";
}

export function DadaWidget() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 4000);
    return () => clearInterval(id);
  }, []);

  const date = new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="relative w-full h-40 rounded-card overflow-hidden shadow-lg shadow-black/10 ring-1 ring-white/60">
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={photos[index]}
          alt=""
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 40%, rgba(74,59,99,0.55) 100%)" }}
      />
      <span className="absolute top-2.5 right-3 text-base">🩷</span>
      <div className="absolute bottom-2.5 left-3.5 right-3.5">
        <p className="text-white text-[13px] font-semibold drop-shadow">{greeting(new Date().getHours())}</p>
        <p className="text-white/80 text-[11px] drop-shadow">{date}</p>
      </div>
    </div>
  );
}
