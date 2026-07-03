import { useState } from "react";
import { motion } from "framer-motion";
import initialPosts from "../data/posts.json";
import forYouPosts from "../data/forYouPosts.json";
import type { Post } from "../types";
import dada2 from "../assets/pic/dada2.jpg";
import x1 from "../assets/x/x1.jpg";
import x2 from "../assets/x/x2.jpg";
import x3 from "../assets/x/x3.jpg";
import x4 from "../assets/x/x4.jpg";

const BLUE = "#7cc4f5";
const postImages: Record<string, string> = { "x1.jpg": x1, "x2.jpg": x2, "x3.jpg": x3, "x4.jpg": x4 };

type Tab = "home" | "search" | "grok" | "notifications" | "messages";

interface NotificationEntry {
  id: string;
  type: "like" | "repost" | "reply" | "follow";
  author: string;
  handle: string;
  avatarGradient: string;
  text: string;
  timeAgo: string;
}

const notifications: NotificationEntry[] = [
  { id: "n1", type: "like", author: "Bua", handle: "@bua_", avatarGradient: "linear-gradient(135deg,#b3d9ff,#c3b6ff)", text: 'liked your post: "small steps still count"', timeAgo: "3m" },
  { id: "n2", type: "follow", author: "Mint", handle: "@mint.k", avatarGradient: "linear-gradient(135deg,#ffd4c2,#ffc2dd)", text: "started following you", timeAgo: "22m" },
  { id: "n3", type: "reply", author: "Ploy", handle: "@ploypim", avatarGradient: "linear-gradient(135deg,#c3b6ff,#b3d9ff)", text: 'replied: "needed to read this today 🤍"', timeAgo: "1h" },
  { id: "n4", type: "repost", author: "Kade", handle: "@kade.d", avatarGradient: "linear-gradient(135deg,#ffc2dd,#ffd4c2)", text: "reposted your post", timeAgo: "3h" },
  { id: "n5", type: "like", author: "Fah", handle: "@fahsai", avatarGradient: "linear-gradient(135deg,#b3d9ff,#ffd4c2)", text: 'liked your post: "rest is productive too"', timeAgo: "5h" },
  { id: "n6", type: "follow", author: "Nan", handle: "@nan_w", avatarGradient: "linear-gradient(135deg,#c3b6ff,#ffc2dd)", text: "started following you", timeAgo: "1d" },
];

interface DirectMessage {
  id: string;
  author: string;
  handle: string;
  avatarGradient: string;
  preview: string;
  timeAgo: string;
  unread?: boolean;
}

const messages: DirectMessage[] = [
  { id: "m1", author: "Bua", handle: "@bua_", avatarGradient: "linear-gradient(135deg,#b3d9ff,#c3b6ff)", preview: "เห็นโพสวันนี้แล้ว หายเหนื่อยเลยอ่ะ 🤍", timeAgo: "2m", unread: true },
  { id: "m2", author: "Ploy", handle: "@ploypim", avatarGradient: "linear-gradient(135deg,#ffc2dd,#c3b6ff)", preview: "เก่งมากนะวันนี้ ไปพักผ่อนบ้างน้า", timeAgo: "1h", unread: true },
  { id: "m3", author: "Kade", handle: "@kade.d", avatarGradient: "linear-gradient(135deg,#ffd4c2,#b3d9ff)", preview: "ส่งเพลงนี้ให้ฟังนะ เพราะดี", timeAgo: "6h" },
  { id: "m4", author: "Mint", handle: "@mint.k", avatarGradient: "linear-gradient(135deg,#c3b6ff,#ffd4c2)", preview: "ขอบคุณที่แชร์นะ ต้องการอ่านพอดีเลย", timeAgo: "1d" },
];

const trends = [
  { id: "t1", category: "Self-care · Trending", topic: "#เหนื่อยแต่ไม่ยอมแพ้", posts: "12.4K posts" },
  { id: "t2", category: "Music · Trending", topic: "small steps still count", posts: "3,201 posts" },
  { id: "t3", category: "Trending in Thailand", topic: "#restisproductive", posts: "8,904 posts" },
  { id: "t4", category: "For you", topic: "you've got this", posts: "1,532 posts" },
  { id: "t5", category: "For you", topic: "เธอเก่งกว่าที่เธอคิดนะ", posts: "2,048 posts" },
  { id: "t6", category: "Trending in Thailand", topic: "#วันนี้ก็สู้ๆนะ", posts: "9,320 posts" },
  { id: "t7", category: "Self-care · Trending", topic: "you are enough today", posts: "4,510 posts" },
  { id: "t8", category: "For you", topic: "ไม่ต้องรีบ ค่อยๆไปก็ถึง", posts: "1,780 posts" },
];

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

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
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
      {post.handle === "@dada" ? (
        <img src={dada2} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-full shrink-0" style={{ background: post.avatarGradient }} />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 text-[15px] leading-none">
          <span className="font-bold truncate">{post.author}</span>
          {post.verified && <VerifiedBadge />}
          <span className="text-white/50 truncate">{post.handle} · {post.timeAgo}</span>
        </div>
        <p className="text-[15px] leading-snug mt-1.5 whitespace-pre-wrap">{post.text}</p>
        {post.image && (
          <img src={postImages[post.image]} alt="" className="mt-3 rounded-2xl w-full max-h-96 object-cover" />
        )}
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

function NotificationItem({ n }: { n: NotificationEntry }) {
  const color = n.type === "like" ? "#f91880" : n.type === "repost" ? "#00ba7c" : BLUE;
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-white/10">
      <div className="w-6 pt-0.5 flex justify-center shrink-0" style={{ color }}>
        {n.type === "like" && <HeartIcon filled />}
        {n.type === "repost" && <RepostIcon />}
        {n.type === "reply" && <ReplyIcon />}
        {n.type === "follow" && <PersonIcon />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full mb-2" style={{ background: n.avatarGradient }} />
        <p className="text-[14px] leading-snug">
          <span className="font-bold">{n.author}</span> <span className="text-white/50">{n.handle}</span>{" "}
          <span className="text-white/80">{n.text}</span>
        </p>
        <p className="text-[12px] text-white/40 mt-1">{n.timeAgo}</p>
      </div>
    </div>
  );
}

function MessageItem({ m }: { m: DirectMessage }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3 border-b border-white/10 text-left">
      <div className="w-12 h-12 rounded-full shrink-0" style={{ background: m.avatarGradient }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-[15px] truncate">
            {m.author} <span className="font-normal text-white/50">{m.handle}</span>
          </span>
          <span className="text-[12px] text-white/40 shrink-0">{m.timeAgo}</span>
        </div>
        <p className={`text-[13px] truncate mt-0.5 ${m.unread ? "text-white" : "text-white/50"}`}>{m.preview}</p>
      </div>
      {m.unread && <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: BLUE }} />}
    </button>
  );
}

function TrendItem({ t }: { t: (typeof trends)[number] }) {
  return (
    <div className="px-4 py-3 border-b border-white/10">
      <p className="text-[13px] text-white/50">{t.category}</p>
      <p className="font-bold text-[15px] mt-0.5">{t.topic}</p>
      <p className="text-[13px] text-white/50 mt-0.5">{t.posts}</p>
    </div>
  );
}

function GrokScreen() {
  return (
    <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-3 px-10 text-center">
      <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center text-white/70">
        <GrokIcon />
      </div>
      <p className="text-[15px] font-bold text-white">Grok</p>
      <p className="text-[13px] text-white/50">Ask anything, get answers, have fun.</p>
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
        <img src={dada2} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
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

const tabTitles: Partial<Record<Tab, string>> = {
  notifications: "Notifications",
  messages: "Messages",
  grok: "Grok",
};

export function SoftPosts({ onClose }: { onClose: () => void }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts as Post[]);
  const [composing, setComposing] = useState(false);
  const [feedTab, setFeedTab] = useState<"forYou" | "following">("following");
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [query, setQuery] = useState("");

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
              avatarGradient: "linear-gradient(135deg,#c3b6ff,#ffc2dd)",
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
      <div className="flex items-center gap-3 px-4 pt-8 shrink-0">
        <button
          onClick={onClose}
          aria-label="Back to home screen"
          className="w-8 h-8 -ml-1.5 rounded-full bg-white/10 flex items-center justify-center text-white/70 text-lg shrink-0"
        >
          ‹
        </button>
        {activeTab === "home" ? (
          <div className="relative w-8 h-8 ml-auto">
            <img src={dada2} alt="" className="w-full h-full rounded-full object-cover" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-black" style={{ background: BLUE }} />
          </div>
        ) : (
          tabTitles[activeTab] && <span className="font-bold text-[17px]">{tabTitles[activeTab]}</span>
        )}
      </div>

      {activeTab === "home" && (
        <>
          <div className="flex items-center justify-center gap-8 pt-3 text-[15px] shrink-0">
            <button
              onClick={() => setFeedTab("forYou")}
              className={`pb-3 ${feedTab === "forYou" ? "font-bold text-white border-b-2" : "text-white/50"}`}
              style={feedTab === "forYou" ? { borderColor: BLUE } : undefined}
            >
              For you
            </button>
            <button
              onClick={() => setFeedTab("following")}
              className={`pb-3 ${feedTab === "following" ? "font-bold text-white border-b-2" : "text-white/50"}`}
              style={feedTab === "following" ? { borderColor: BLUE } : undefined}
            >
              Following
            </button>
          </div>
          <div className="border-b border-white/10 shrink-0" />
        </>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        {activeTab === "home" && (
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-4 relative">
            {(feedTab === "following" ? posts : (forYouPosts as Post[])).map((post) => (
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
        )}

        {activeTab === "search" && (
          <>
            <div className="px-4 pt-3 pb-2 shrink-0">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2.5">
                <SearchIcon />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-white/40"
                />
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-4">
              <p className="px-4 py-2 font-bold text-[18px]">Trends for you</p>
              {trends.map((t) => (
                <TrendItem key={t.id} t={t} />
              ))}
            </div>
          </>
        )}

        {activeTab === "grok" && <GrokScreen />}

        {activeTab === "notifications" && (
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-4">
            {notifications.map((n) => (
              <NotificationItem key={n.id} n={n} />
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-4">
            {messages.map((m) => (
              <MessageItem key={m.id} m={m} />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-around bg-black border-t border-white/10 pt-2.5 pb-6 shrink-0">
        <button aria-label="Home" onClick={() => setActiveTab("home")} className={activeTab === "home" ? "text-white" : "text-white/60"}>
          <HomeIcon active={activeTab === "home"} />
        </button>
        <button aria-label="Search" onClick={() => setActiveTab("search")} className={activeTab === "search" ? "text-white" : "text-white/60"}>
          <SearchIcon />
        </button>
        <button aria-label="Grok" onClick={() => setActiveTab("grok")} className={activeTab === "grok" ? "text-white" : "text-white/60"}>
          <GrokIcon />
        </button>
        <button
          aria-label="Notifications"
          onClick={() => setActiveTab("notifications")}
          className={`relative ${activeTab === "notifications" ? "text-white" : "text-white/60"}`}
        >
          <BellIcon />
          <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#7cc4f5] text-white text-[10px] leading-4 text-center font-semibold">
            {notifications.length}
          </span>
        </button>
        <button
          aria-label="Messages"
          onClick={() => setActiveTab("messages")}
          className={`relative ${activeTab === "messages" ? "text-white" : "text-white/60"}`}
        >
          <MessageIcon />
          {messages.some((m) => m.unread) && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#7cc4f5] border-2 border-black" />
          )}
        </button>
      </div>
    </div>
  );
}
