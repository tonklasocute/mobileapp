import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import memories from "../data/memories.json";
import type { Memory } from "../types";
import tonkla from "../assets/pic/tonkla.jpg";

const stories = [
  { id: "st1", label: "First Day", gradient: "linear-gradient(135deg,#ff9ac2,#8b7bff)" },
  { id: "st2", label: "Trip", gradient: "linear-gradient(135deg,#6ea8ff,#8b7bff)" },
  { id: "st3", label: "Home", gradient: "linear-gradient(135deg,#ffb4a8,#ff9ac2)" },
  { id: "st4", label: "Rain", gradient: "linear-gradient(135deg,#8b7bff,#6ea8ff)" },
  { id: "st5", label: "Us", gradient: "linear-gradient(135deg,#ff9ac2,#ffb4a8)" },
];

const highlights = [
  { id: "h1", label: "2026 🛒", gradient: "linear-gradient(135deg,#ff9ac2,#8b7bff)" },
  { id: "h2", label: "ootd 🛒", gradient: "linear-gradient(135deg,#6ea8ff,#8b7bff)" },
  { id: "h3", label: "makeup 🛒", gradient: "linear-gradient(135deg,#ffb4a8,#ff9ac2)" },
  { id: "h4", label: "🇯🇵🍁", gradient: "linear-gradient(135deg,#8b7bff,#6ea8ff)" },
  { id: "h5", label: "🤿", gradient: "linear-gradient(135deg,#6ea8ff,#ffb4a8)" },
];

const PROFILE = {
  username: "18natnits",
  name: "Nattanit Tippayaratsoontorn",
  pronoun: "she/her",
  posts: 607,
  followers: "103K",
  following: "1,126",
  bio: ["cu102 | shi79", "🍋 @usedbynatnit", "dm for work or"],
  link: "lin.ee/rS4rcBa",
  followedBy: "Followed by niceentp, somjungiixm and 3 others",
};

function VerifiedBadge() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" className="shrink-0">
      <path
        fill="#3897f0"
        d="M12 2l2.4 1.3 2.7-.4 1.3 2.4 2.4 1.3-.4 2.7 1.3 2.4-1.3 2.4.4 2.7-2.4 1.3-1.3 2.4-2.7-.4L12 22l-2.4-1.3-2.7.4-1.3-2.4-2.4-1.3.4-2.7L2.3 12l1.3-2.4-.4-2.7 2.4-1.3 1.3-2.4 2.7.4z"
      />
      <path fill="#fff" d="M9.7 12.9l-1.5-1.5-1.1 1.1 2.6 2.6 5-5-1.1-1.1z" />
    </svg>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-12 left-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-ink/60 text-lg z-10"
      aria-label="Back"
    >
      ‹
    </button>
  );
}

function HighlightCircle({ label, gradient }: { label: string; gradient: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <div className="w-16 h-16 rounded-full p-[2px]" style={{ background: "#0002" }}>
        <div className="w-full h-full rounded-full flex items-center justify-center text-xl" style={{ background: gradient }} />
      </div>
      <span className="text-[11px] text-ink/70">{label}</span>
    </div>
  );
}

function ProfileScreen({ onOpenStory }: { onOpenStory: () => void }) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="px-4 pt-12 pb-8">
      <div className="flex items-center justify-between pb-2 pl-10">
        <div className="flex items-center gap-1.5">
          <h1 className="text-[19px] font-bold">{PROFILE.username}</h1>
          <VerifiedBadge />
        </div>
        <span className="text-xl px-2">⋯</span>
      </div>

      <div className="flex items-center gap-6 mb-3">
        <div
          className="w-[74px] h-[74px] rounded-full p-[2px] shrink-0"
          style={{ background: "linear-gradient(135deg,#ff9ac2,#8b7bff)" }}
        >
          <img src={tonkla} alt="" className="w-full h-full rounded-full object-cover border-2 border-white" />
        </div>
        <div className="flex-1 flex justify-around text-center">
          <div>
            <p className="font-bold text-[16px]">{PROFILE.posts}</p>
            <p className="text-[12px] text-ink/60">posts</p>
          </div>
          <div>
            <p className="font-bold text-[16px]">{PROFILE.followers}</p>
            <p className="text-[12px] text-ink/60">followers</p>
          </div>
          <div>
            <p className="font-bold text-[16px]">{PROFILE.following}</p>
            <p className="text-[12px] text-ink/60">following</p>
          </div>
        </div>
      </div>

      <div className="text-[14px] leading-snug mb-3">
        <p className="font-semibold">
          {PROFILE.name} <span className="font-normal text-ink/50">{PROFILE.pronoun}</span>
        </p>
        {PROFILE.bio.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className="text-dada-purple font-medium">🔗 {PROFILE.link}</p>
      </div>

      <p className="text-[13px] text-ink/60 mb-3">{PROFILE.followedBy}</p>

      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setFollowing((v) => !v)}
          className={clsx(
            "flex-1 rounded-xl py-2 text-[14px] font-semibold",
            following ? "bg-black/5 text-ink" : "bg-dada-purple text-white",
          )}
        >
          {following ? "Following" : "Follow"}
        </button>
        <button className="flex-1 rounded-xl py-2 text-[14px] font-semibold bg-black/5 text-ink">Message</button>
        <button className="w-9 h-9 rounded-xl bg-black/5 flex items-center justify-center text-[15px]" aria-label="Add friend">
          👤
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar mb-5">
        {highlights.map((h) => (
          <button key={h.id} onClick={onOpenStory} aria-label={`Highlight: ${h.label}`}>
            <HighlightCircle label={h.label} gradient={h.gradient} />
          </button>
        ))}
      </div>

      <div className="flex items-center justify-around border-t border-black/10 mb-1">
        <div className="py-2.5 border-b-2 border-ink text-lg">▦</div>
        <div className="py-2.5 text-ink/40 text-lg">▶</div>
        <div className="py-2.5 text-ink/40 text-lg">👤</div>
      </div>

      <div className="grid grid-cols-3 gap-0.5">
        {(memories as Memory[]).map((m, i) => (
          <div key={m.id} className="relative aspect-square" style={i === 0 ? undefined : { background: m.image }}>
            {i === 0 && <img src={tonkla} alt="" className="w-full h-full object-cover" />}
            {i === (memories as Memory[]).length - 1 && (
              <span className="absolute top-1.5 right-1.5 text-white text-sm drop-shadow">▶</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PostActions({ likes }: { likes: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const count = likes + (liked ? 1 : 0);

  return (
    <div className="px-1 pt-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => setLiked((v) => !v)} aria-label="Like">
            <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? "#ff3040" : "none"} stroke={liked ? "#ff3040" : "currentColor"} strokeWidth="1.8" strokeLinejoin="round">
              <path d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2 4.3 5.8 3.8c2-.3 4 .6 5.1 2.3 1.1-1.7 3.1-2.6 5.1-2.3 3.8.5 5.4 4.4 3.8 7.9C19.5 16.4 12 21 12 21z" />
            </svg>
          </motion.button>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.5 3.4 6L4 21l4.2-2c1.2.3 2.5.5 3.8.5 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSaved((v) => !v)} aria-label="Save">
          <svg width="22" height="22" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M6 3h12v18l-6-4.5L6 21V3z" />
          </svg>
        </motion.button>
      </div>
      <p className="text-[13px] font-semibold mt-1.5">{count.toLocaleString()} likes</p>
    </div>
  );
}

function FeedPost({ memory }: { memory: Memory }) {
  return (
    <div className="pb-1">
      <div className="flex items-center gap-2.5 px-1 py-2">
        <img src={tonkla} alt="" className="w-8 h-8 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold truncate">{PROFILE.username}</p>
          <p className="text-[11px] text-ink/50 truncate">{memory.location}</p>
        </div>
        <span className="text-lg text-ink/60">⋯</span>
      </div>
      <div className="aspect-[4/5]" style={{ background: memory.image }} />
      <PostActions likes={memory.likes} />
      <p className="px-1 text-[13px] mt-1">
        <span className="font-semibold">{PROFILE.username}</span> {memory.caption}
      </p>
      <p className="px-1 text-[11px] text-ink/40 mt-1">{memory.timeAgo} ago</p>
    </div>
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

export function MemoryIG({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"feed" | "profile">("feed");
  const [storyOpen, setStoryOpen] = useState(false);

  return (
    <div className="absolute inset-0 bg-white text-ink">
      {view === "feed" ? (
        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-center justify-between px-4 pt-12 pb-2 shrink-0">
            <span className="w-8" />
            <h1 className="text-2xl font-serif italic">Instagram</h1>
            <button onClick={() => setView("profile")} aria-label="Profile">
              <img src={tonkla} alt="" className="w-8 h-8 rounded-full object-cover" />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
            <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar border-b border-black/10">
              {stories.map((s) => (
                <button key={s.id} onClick={() => setStoryOpen(true)} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="w-14 h-14 rounded-full p-[2px]" style={{ background: s.gradient }}>
                    <div className="w-full h-full rounded-full bg-white border-2 border-white" />
                  </div>
                  <span className="text-[10px] text-ink/60">{s.label}</span>
                </button>
              ))}
            </div>

            <div className="px-3">
              {(memories as Memory[]).map((m) => (
                <FeedPost key={m.id} memory={m} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 overflow-y-auto no-scrollbar">
          <ProfileScreen onOpenStory={() => setStoryOpen(true)} />
        </div>
      )}

      <BackButton onClick={() => (view === "profile" ? setView("feed") : onClose())} />

      <AnimatePresence>{storyOpen && <StoryViewer onClose={() => setStoryOpen(false)} />}</AnimatePresence>
    </div>
  );
}
