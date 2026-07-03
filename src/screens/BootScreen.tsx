import { motion } from "framer-motion";

export function BootScreen() {
  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-10"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 30%, #ffe9f2 0%, #e7dcff 60%, #d8ecff 100%)",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{
          opacity: 1,
          scale: 1,
          textShadow: [
            "0 0 20px rgba(195,182,255,0.3)",
            "0 0 40px rgba(195,182,255,0.7)",
            "0 0 20px rgba(195,182,255,0.3)",
          ],
        }}
        transition={{
          opacity: { duration: 1 },
          scale: { duration: 1 },
          textShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
        className="text-3xl font-semibold tracking-wide text-gradient-dada"
      >
        DadaOS
      </motion.h1>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-[#4a3b63]/50"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
