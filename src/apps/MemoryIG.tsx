import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "../components/AppShell";
import { GlassCard } from "../components/GlassCard";
import memories from "../data/memories.json";
import type { Memory } from "../types";

const stories = [
  { id: "st1", label: "First Day", gradient: "linear-gradient(135deg,#ff9ac2,#8b7bff)" },
  { id: "st2", label: "Trip", gradient: "linear-gradient(135deg,#6ea8ff,#8b7bff)" },
  { id: "st3", label: "Home", gradient: "linear-gradient(135deg,#ffb4a8,#ff9ac2)" },
  { id: "st4", label: "Rain", gradient: "linear-gradient(135deg,#8b7bff,#6ea8ff)" },
  { id: "st5", label: "Us", gradient: "linear-gradient(135deg,#ff9ac2,#ffb4a8)" },
];

function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [liked, setLiked] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const likes = initialLikes + (liked ? 1 : 0);

  const toggle = () => {
    setLiked((v) => !v);
    setBurstKey((k) => k + 1);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-[13px] text-white/70 relative"
    >
      <span className="relative inline-flex w-5 h-5 items-center justify-center">
        <motion.span animate={{ scale: liked ? [1, 1.3, 1] : 1 }} className="text-lg">
          {liked ? "❤️" : "🤍"}
        </motion.span>
        <AnimatePresence>
          {liked && (
            <motion.span
              key={burstKey}
              initial={{ scale: 0.3, opacity: 1 }}
              animate={{ scale: 2.2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center text-lg pointer-events-none"
            >
              ❤️
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span>{likes}</span>
    </button>
  );
}

function StoryViewer({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const story = stories[index];

  const next = () => {
    if (index < stories.length - 1) setIndex(index + 1);
    else onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col"
      style={{ background: story.gradient }}
      onClick={next}
    >
      <div className="flex gap-1 px-3 pt-12 shrink-0">
        {stories.map((s, i) => (
          <div key={s.id} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
            {i <= index && (
              <motion.div
                className="h-full bg-white"
                initial={{ width: i < index ? "100%" : "0%" }}
                animate={{ width: i === index ? "100%" : "100%" }}
                transition={{ duration: i === index ? 3 : 0 }}
                onAnimationComplete={() => i === index && next()}
              />
            )}
          </div>
        ))}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-12 right-4 w-8 h-8 rounded-full bg-black/20 text-white"
      >
        ✕
      </button>
      <div className="flex-1 flex items-center justify-center text-white text-xl font-semibold px-8 text-center">
        {story.label}
      </div>
    </motion.div>
  );
}

function ProfileScreen() {
  return (
    <div className="px-5 py-6">
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-20 h-20 rounded-full"
          style={{ background: "linear-gradient(135deg,#ff9ac2,#8b7bff)" }}
        />
        <p className="font-semibold text-lg">Dada</p>
        <p className="text-white/50 text-sm">{memories.length} memories saved</p>
      </div>
      <div className="grid grid-cols-3 gap-1.5 mt-6">
        {(memories as Memory[]).map((m) => (
          <div
            key={m.id}
            className="aspect-square rounded-lg"
            style={{ background: m.image }}
          />
        ))}
      </div>
    </div>
  );
}

export function MemoryIG({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"feed" | "profile">("feed");
  const [storyOpen, setStoryOpen] = useState(false);

  return (
    <div className="absolute inset-0">
      <AppShell
        title={view === "feed" ? "Memory IG" : "Profile"}
        onBack={() => (view === "profile" ? setView("feed") : onClose())}
        action={
          view === "feed" ? (
            <button onClick={() => setView("profile")} className="text-lg">
              👤
            </button>
          ) : undefined
        }
      >
        {view === "feed" ? (
          <>
            <div className="flex gap-4 px-4 py-4 overflow-x-auto no-scrollbar">
              {stories.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStoryOpen(true)}
                  className="flex flex-col items-center gap-1.5 shrink-0"
                >
                  <div
                    className="w-14 h-14 rounded-full p-[2px]"
                    style={{ background: s.gradient }}
                  >
                    <div className="w-full h-full rounded-full bg-ink border-2 border-ink" />
                  </div>
                  <span className="text-[10px] text-white/60">{s.label}</span>
                </button>
              ))}
            </div>

            <div className="px-4 pb-6 flex flex-col gap-5">
              {(memories as Memory[]).map((m) => (
                <GlassCard key={m.id} className="overflow-hidden">
                  <div className="h-56" style={{ background: m.image }} />
                  <div className="p-4 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <LikeButton initialLikes={m.likes} />
                      <span className="text-[11px] text-white/40">{m.timeAgo}</span>
                    </div>
                    <p className="text-[13px] text-white/90 leading-snug">{m.caption}</p>
                    <p className="text-[11px] text-white/40">{m.location}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </>
        ) : (
          <ProfileScreen />
        )}
      </AppShell>

      <AnimatePresence>
        {storyOpen && <StoryViewer onClose={() => setStoryOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
