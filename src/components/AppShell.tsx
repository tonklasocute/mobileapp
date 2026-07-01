import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function AppShell({
  title,
  onBack,
  children,
  transparent = false,
  action,
}: {
  title: string;
  onBack: () => void;
  children: ReactNode;
  transparent?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div
        className={`flex items-center justify-between px-4 pt-12 pb-3 shrink-0 ${
          transparent ? "" : "border-b border-white/10"
        }`}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-9 h-9 rounded-full glass flex items-center justify-center text-lg"
          aria-label="Back to home"
        >
          ‹
        </motion.button>
        <span className="text-[15px] font-semibold">{title}</span>
        <div className="w-9 h-9 flex items-center justify-center">{action}</div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
}
