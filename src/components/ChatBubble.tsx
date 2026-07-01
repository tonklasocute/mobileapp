import { motion } from "framer-motion";
import clsx from "clsx";
import type { ChatMessage } from "../types";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isDada = message.from === "dada";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={clsx("flex flex-col mb-2", isDada ? "items-end" : "items-start")}
    >
      <div
        className={clsx(
          "max-w-[75%] px-4 py-2.5 rounded-3xl text-[14px] leading-snug",
          isDada
            ? "bg-gradient-to-br from-dada-purple to-dada-pink text-white rounded-br-md"
            : "glass rounded-bl-md",
        )}
      >
        {message.text}
      </div>
      <span className="text-[10px] text-white/40 mt-1 px-1">{message.time}</span>
    </motion.div>
  );
}
