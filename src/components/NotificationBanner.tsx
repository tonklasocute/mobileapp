import { AnimatePresence, motion } from "framer-motion";

export interface Notification {
  id: number;
  app: string;
  emoji: string;
  message: string;
}

export function NotificationBanner({
  notification,
  onDismiss,
  onOpen,
}: {
  notification: Notification | null;
  onDismiss: () => void;
  onOpen?: () => void;
}) {
  return (
    <div className="absolute top-3 inset-x-3 z-50 pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            key={notification.id}
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.4, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -20) onDismiss();
            }}
            onClick={onOpen}
            className="glass rounded-2xl px-3.5 py-3 flex items-center gap-3 pointer-events-auto"
          >
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-base shrink-0">
              {notification.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold">{notification.app}</p>
              <p className="text-[12px] text-white/70 truncate">
                {notification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
