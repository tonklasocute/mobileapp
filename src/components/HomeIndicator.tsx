import { motion } from "framer-motion";

export function HomeIndicator({
  light = false,
  onSwipeUp,
}: {
  light?: boolean;
  onSwipeUp?: () => void;
}) {
  return (
    <motion.div
      className={`absolute bottom-0 inset-x-0 h-7 flex items-end justify-center pb-1.5 z-40 ${
        onSwipeUp ? "cursor-grab active:cursor-grabbing" : ""
      }`}
      drag={onSwipeUp ? "y" : false}
      dragConstraints={{ top: -80, bottom: 0 }}
      dragElastic={{ top: 0.3, bottom: 0 }}
      dragSnapToOrigin
      onDragEnd={
        onSwipeUp
          ? (_, info) => {
              if (info.offset.y < -50 || info.velocity.y < -400) onSwipeUp();
            }
          : undefined
      }
    >
      <div
        className={`w-32 h-[5px] rounded-full ${light ? "bg-black/60" : "bg-white/70"}`}
      />
    </motion.div>
  );
}
