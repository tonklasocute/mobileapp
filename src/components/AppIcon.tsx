import { motion } from "framer-motion";
import type { AppMeta } from "../types";

export function AppIcon({
  app,
  jiggling,
  onOpen,
}: {
  app: AppMeta;
  jiggling: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className="flex flex-col items-center gap-1.5"
      whileTap={{ scale: 0.88 }}
      animate={
        jiggling
          ? { rotate: [-1.5, 1.5, -1.5], transition: { repeat: Infinity, duration: 0.28 } }
          : { rotate: 0 }
      }
    >
      <motion.div
        className="w-16 h-16 rounded-app flex items-center justify-center text-3xl shadow-lg shadow-black/40 overflow-hidden"
        style={{ background: app.icon && app.iconFit === "contain" ? "#fff" : app.gradient }}
      >
        {app.icon ? (
          <img
            src={app.icon}
            alt=""
            className={`w-full h-full ${app.iconFit === "contain" ? "object-contain p-2.5" : "object-cover"}`}
          />
        ) : (
          app.emoji
        )}
      </motion.div>
      <span className="text-[11px] text-white/85 font-medium drop-shadow">
        {app.name}
      </span>
    </motion.button>
  );
}
