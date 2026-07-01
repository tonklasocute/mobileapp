import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type Variant = "primary" | "glass" | "ghost";

export function Button({
  variant = "primary",
  className,
  ...props
}: HTMLMotionProps<"button"> & { variant?: Variant }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={clsx(
        "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
        variant === "primary" &&
          "bg-gradient-to-r from-dada-purple to-dada-pink text-white",
        variant === "glass" && "glass text-white",
        variant === "ghost" && "text-white/70 hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
