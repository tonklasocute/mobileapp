import { useState } from "react";
import { motion } from "framer-motion";
import initialPosts from "../data/posts.json";
import type { Post } from "../types";

const BLUE = "#1d9bf0";

function VerifiedBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
      <path
        fill={BLUE}
        d="M12 2l2.4 1.3 2.7-.4 1.3 2.4 2.4 1.3-.4 2.7 1.3 2.4-1.3 2.4.4 2.7-2.4 1.3-1.3 2.4-2.7-.4L12 22l-2.4-1.3-2.7.4-1.3-2.4-2.4-1.3.4-2.7L2.3 12l1.3-2.4-.4-2.7 2.4-1.3 1.3-2.4 2.7.4z"
      />
      <path fill="#fff" d="M9.7 12.9l-1.5-1.5-1.1 1.1 2.6 2.6 5-5-1.1-1.1z" />
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3 .6-4.4A8 8 0 1 1 21 12z" />
    </svg>
  );
}

function RepostIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7h10v4l4-5-4-5v4H5v6h2V7z" />
      <path d="M17 17H7v-4l-4 5 4 5v-4h12v-6h-2v4z" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#f91880" : "none"} stroke={filled ? "#f91880" : "currentColor"} strokeWidth="2" strokeLinejoin="round">
      <path d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2 4.3 5.8 3.8c2-.3 4 .6 5.1 2.3 1.1-1.7 3.1-2.6 5.1-2.3 3.8.5 5.4 4.4 3.8 7.9C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

function ViewsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 19V10M10 19V5M16 19v-7M22 19v-3" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4.5L6 21V3z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4M7 8l5-5 5 5" />
      <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-8.5z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.3" y2="16.3" />
    </svg>
  );
}

function GrokIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <line x1="6.5" y1="17.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M3 5h18v11H8l-5 4V5z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function StatChip({ icon, count, onClick, active }: { icon: React.ReactNode; count?: number; onClick?: () => void; active?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className={`flex items-center gap-1 ${active ? "text-[#f91880]" : "text-white/50"}`}
    >
      {icon}
      {count !== undefined && <span className="text-[13px]">{count}</span>}
    </motion.button>
  );
}

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);

  return (
    <div className="px-4 py-3 border-b border-white/10 flex gap-3">
      <div className="w-10 h-10 rounded-full shrink-0" style={{ background: post.avatarGradient ?? "linear-gradient(135deg,#8b7bff,#ff9ac2)" }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-[15px] leading-none">
          <span className="font-bold truncate">{post.author}</span>
          {post.verified && <VerifiedBadge />}
          <span className="text-white/50 truncate">{post.handle} · {post.timeAgo}</span>
        </div>
        <p className="text-[15px] leading-snug mt-1.5 whitespace-pre-wrap">{post.text}</p>
        {post.quote && (
          <div className="mt-3 bg-white text-black rounded-2xl px-6 py-7 text-center">
            {post.quote.map((line, i) => (
              <p key={i} className="font-serif italic text-[15px] leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between mt-3 max-w-[320px]">
          <StatChip icon={<ReplyIcon />} count={post.replies} />
          <StatChip
            icon={<RepostIcon />}
            count={(post.reposts ?? 0) + (reposted ? 1 : 0)}
            active={reposted}
            onClick={() => setReposted((v) => !v)}
          />
          <StatChip
            icon={<HeartIcon filled={liked} />}
            count={post.likes + (liked ? 1 : 0)}
            active={liked}
            onClick={() => setLiked((v) => !v)}
          />
          <StatChip icon={<ViewsIcon />} count={post.views} />
          <StatChip icon={<BookmarkIcon />} />
          <StatChip icon={<ShareIcon />} />
        </div>
      </div>
    </div>
  );
}

function ComposeScreen({ onCancel, onPost }: { onCancel: () => void; onPost: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="absolute inset-0 bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 pt-12 pb-3">
        <button onClick={onCancel} className="text-[15px] text-white/80">
          Cancel
        </button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          disabled={!text.trim()}
          onClick={() => text.trim() && onPost(text.trim())}
          className="rounded-full px-4 py-1.5 text-[14px] font-bold text-white disabled:opacity-40"
          style={{ background: BLUE }}
        >
          Post
        </motion.button>
      </div>
      <div className="flex gap-3 px-4">
        <div className="w-10 h-10 rounded-full shrink-0" style={{ background: "linear-gradient(135deg,#8b7bff,#ff9ac2)" }} />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
          rows={6}
          autoFocus
          className="flex-1 bg-transparent outline-none text-[17px] placeholder:text-white/40 resize-none"
        />
      </div>
    </div>
  );
}

export function SoftPosts({ onClose }: { onClose: () => void }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts as Post[]);
  const [composing, setComposing] = useState(false);
  const [tab, setTab] = useState<"forYou" | "following">("following");

  if (composing) {
    return (
      <ComposeScreen
        onCancel={() => setComposing(false)}
        onPost={(text) => {
          setPosts((p) => [
            {
              id: `local-${Date.now()}`,
              author: "Dada",
              handle: "@dada",
              verified: true,
              avatarGradient: "linear-gradient(135deg,#8b7bff,#ff9ac2)",
              timeAgo: "now",
              text,
              likes: 0,
              reposts: 0,
              replies: 0,
              views: 1,
            },
            ...p,
          ]);
          setComposing(false);
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 bg-black text-white flex flex-col">
      <div className="flex items-center justify-between px-4 pt-8 shrink-0">
        <button
          onClick={onClose}
          aria-label="Back to home screen"
          className="w-8 h-8 -ml-1.5 rounded-full bg-white/10 flex items-center justify-center text-white/70 text-lg"
        >
          ‹
        </button>
        <div className="relative w-8 h-8">
          <div className="w-full h-full rounded-full" style={{ background: "linear-gradient(135deg,#8b7bff,#ff9ac2)" }} />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black" style={{ background: BLUE }} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 pt-3 text-[15px] shrink-0">
        <button
          onClick={() => setTab("forYou")}
          className={`pb-3 ${tab === "forYou" ? "font-bold text-white border-b-2" : "text-white/50"}`}
          style={tab === "forYou" ? { borderColor: BLUE } : undefined}
        >
          For you
        </button>
        <button
          onClick={() => setTab("following")}
          className={`pb-3 ${tab === "following" ? "font-bold text-white border-b-2" : "text-white/50"}`}
          style={tab === "following" ? { borderColor: BLUE } : undefined}
        >
          Following
        </button>
        <span className="pb-3 text-white/50 flex items-center gap-0.5">
          Add
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </div>
      <div className="border-b border-white/10 shrink-0" />

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-4 relative">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setComposing(true)}
          aria-label="New post"
          className="fixed right-4 bottom-24 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-black/50"
          style={{ background: BLUE }}
        >
          <PlusIcon />
        </motion.button>
      </div>

      <div className="flex items-center justify-around bg-black border-t border-white/10 pt-2.5 pb-6 shrink-0">
        <button aria-label="Home" className="text-white">
          <HomeIcon active />
        </button>
        <button aria-label="Search" className="text-white/60">
          <SearchIcon />
        </button>
        <button aria-label="Grok" className="text-white/60">
          <GrokIcon />
        </button>
        <button aria-label="Notifications" className="relative text-white/60">
          <BellIcon />
          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#1d9bf0] text-white text-[10px] leading-4 text-center font-semibold">
            20
          </span>
        </button>
        <button aria-label="Messages" className="text-white/60">
          <MessageIcon />
        </button>
      </div>
    </div>
  );
}
