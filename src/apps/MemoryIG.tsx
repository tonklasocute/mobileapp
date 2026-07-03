import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import memories from "../data/memories.json";
import otherPostsData from "../data/otherPosts.json";
import type { Memory } from "../types";
import dada1 from "../assets/pic/dada1.jpg";
import dada2 from "../assets/pic/dada2.jpg";
import dada3 from "../assets/pic/dada3.jpg";
import dada4 from "../assets/pic/dada4.jpg";
import dada5 from "../assets/pic/dada5.jpg";
import dada6 from "../assets/pic/dada6.jpg";

const dadaPhotos = [dada1, dada2, dada3, dada4, dada5, dada6];

const CLOSE_FRIENDS_GREEN = "#3ad16a";
const IG_BLUE = "#3897f0";

const stories = [
  { id: "st1", label: "First Day", gradient: "linear-gradient(135deg,#ff9ac2,#8b7bff)", closeFriend: false },
  { id: "st2", label: "Trip", gradient: "linear-gradient(135deg,#6ea8ff,#8b7bff)", closeFriend: false },
  { id: "st3", label: "Home", gradient: "linear-gradient(135deg,#ffb4a8,#ff9ac2)", closeFriend: true },
  { id: "st4", label: "Rain", gradient: "linear-gradient(135deg,#8b7bff,#6ea8ff)", closeFriend: false },
  { id: "st5", label: "Us", gradient: "linear-gradient(135deg,#ff9ac2,#ffb4a8)", closeFriend: true },
];

const highlights = [
  { id: "h1", label: "2026 🛒", gradient: "linear-gradient(135deg,#ff9ac2,#8b7bff)" },
  { id: "h2", label: "ootd 🛒", gradient: "linear-gradient(135deg,#6ea8ff,#8b7bff)" },
  { id: "h3", label: "makeup 🛒", gradient: "linear-gradient(135deg,#ffb4a8,#ff9ac2)" },
  { id: "h4", label: "🇯🇵🍁", gradient: "linear-gradient(135deg,#8b7bff,#6ea8ff)" },
  { id: "h5", label: "🤿", gradient: "linear-gradient(135deg,#6ea8ff,#ffb4a8)" },
];

const FOLLOWED_BY = "Followed by niceentp, somjungiixm and 3 others";

interface ProfileInfo {
  username: string;
  name: string;
  pronoun: string;
  followers: string;
  following: string;
  bio: string[];
  link: string;
}

const PROFILE: ProfileInfo = {
  username: "18natnits",
  name: "Nattanit Tippayaratsoontorn",
  pronoun: "she/her",
  followers: "103K",
  following: "1,126",
  bio: ["cu102 | shi79", "🍋 @usedbynatnit", "dm for work or"],
  link: "lin.ee/rS4rcBa",
};

interface FeedItem {
  id: string;
  photo: string;
  caption: string;
  location: string;
  likes: number;
  timeAgo: string;
}

interface OtherPost {
  id: string;
  username: string;
  avatarGradient: string;
  photoGradient: string;
  caption: string;
  location: string;
  likes: number;
  timeAgo: string;
}

const otherPosts = otherPostsData as OtherPost[];

type FeedEntry = { kind: "own"; data: FeedItem } | { kind: "other"; data: OtherPost };

function buildHomeFeed(own: FeedItem[]): FeedEntry[] {
  const feed: FeedEntry[] = [];
  let oi = 0;
  own.forEach((post, i) => {
    feed.push({ kind: "own", data: post });
    const perOwnPost = i === 0 ? 2 : 1;
    for (let n = 0; n < perOwnPost && oi < otherPosts.length; n++, oi++) {
      feed.push({ kind: "other", data: otherPosts[oi] });
    }
  });
  while (oi < otherPosts.length) feed.push({ kind: "other", data: otherPosts[oi++] });
  return feed;
}

function buildInitialPosts(): FeedItem[] {
  return (memories as Memory[]).map((m, i) => ({
    id: m.id,
    photo: dadaPhotos[i % dadaPhotos.length],
    caption: m.caption,
    location: m.location,
    likes: m.likes,
    timeAgo: m.timeAgo,
  }));
}

interface ActivityEntry {
  id: string;
  name: string;
  text: string;
  timeAgo: string;
  gradient: string;
  type: "like" | "comment" | "follow";
}

const activityItems: ActivityEntry[] = [
  { id: "a1", name: "niceentp", text: "liked your photo.", timeAgo: "2m", gradient: "linear-gradient(135deg,#ff9ac2,#8b7bff)", type: "like" },
  { id: "a2", name: "somjungiixm", text: "started following you.", timeAgo: "18m", gradient: "linear-gradient(135deg,#6ea8ff,#8b7bff)", type: "follow" },
  { id: "a3", name: "usedbynatnit", text: "commented: “this is so pretty 😍”", timeAgo: "1h", gradient: "linear-gradient(135deg,#ffb4a8,#ff9ac2)", type: "comment" },
  { id: "a4", name: "kade.d", text: "liked your photo.", timeAgo: "3h", gradient: "linear-gradient(135deg,#8b7bff,#6ea8ff)", type: "like" },
  { id: "a5", name: "ploypim", text: "started following you.", timeAgo: "1d", gradient: "linear-gradient(135deg,#ff9ac2,#ffb4a8)", type: "follow" },
  { id: "a6", name: "mint.k", text: "liked your photo.", timeAgo: "2d", gradient: "linear-gradient(135deg,#6ea8ff,#ffb4a8)", type: "like" },
];

function VerifiedBadge() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" className="shrink-0">
      <path
        fill={IG_BLUE}
        d="M12 2l2.4 1.3 2.7-.4 1.3 2.4 2.4 1.3-.4 2.7 1.3 2.4-1.3 2.4.4 2.7-2.4 1.3-1.3 2.4-2.7-.4L12 22l-2.4-1.3-2.7.4-1.3-2.4-2.4-1.3.4-2.7L2.3 12l1.3-2.4-.4-2.7 2.4-1.3 1.3-2.4 2.7.4z"
      />
      <path fill="#fff" d="M9.7 12.9l-1.5-1.5-1.1 1.1 2.6 2.6 5-5-1.1-1.1z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#ff3040" : "none"} stroke={filled ? "#ff3040" : "currentColor"} strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 21s-7.5-4.6-10-9.3C.4 8.2 2 4.3 5.8 3.8c2-.3 4 .6 5.1 2.3 1.1-1.7 3.1-2.6 5.1-2.3 3.8.5 5.4 4.4 3.8 7.9C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 3C6.5 3 2 6.6 2 11c0 2.4 1.3 4.5 3.4 6L4 21l4.2-2c1.2.3 2.5.5 3.8.5 5.5 0 10-3.6 10-8S17.5 3 12 3z" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4.5L6 21V3z" />
    </svg>
  );
}

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-8.5z" />
    </svg>
  );
}

function ReelsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M10 8.3l6 3.7-6 3.7V8.3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CreateIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.3" y2="16.3" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.4 : 1.8} strokeLinecap="round">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-4 3.2-6.5 7-6.5s7 2.5 7 6.5" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

function GridIcon({ active }: { active?: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <rect x="3" y="3" width="5.5" height="5.5" rx="1" />
      <rect x="9.25" y="3" width="5.5" height="5.5" rx="1" />
      <rect x="15.5" y="3" width="5.5" height="5.5" rx="1" />
      <rect x="3" y="9.25" width="5.5" height="5.5" rx="1" />
      <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="1" />
      <rect x="15.5" y="9.25" width="5.5" height="5.5" rx="1" />
      <rect x="3" y="15.5" width="5.5" height="5.5" rx="1" />
      <rect x="9.25" y="15.5" width="5.5" height="5.5" rx="1" />
      <rect x="15.5" y="15.5" width="5.5" height="5.5" rx="1" />
    </svg>
  );
}

function TaggedIcon({ active }: { active?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M7 17c0-3 2.3-4.8 5-4.8s5 1.8 5 4.8" />
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

function PostActions({ likes }: { likes: number }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const count = likes + (liked ? 1 : 0);

  return (
    <div className="px-1 pt-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <motion.button whileTap={{ scale: 0.85 }} onClick={() => setLiked((v) => !v)} aria-label="Like">
            <HeartIcon filled={liked} />
          </motion.button>
          <button aria-label="Comment">
            <CommentIcon />
          </button>
          <button aria-label="Share">
            <SendIcon />
          </button>
        </div>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSaved((v) => !v)} aria-label="Save">
          <BookmarkIcon filled={saved} />
        </motion.button>
      </div>
      <p className="text-[13px] font-semibold mt-1.5">{count.toLocaleString()} likes</p>
    </div>
  );
}

function FeedPost({ post, avatar, username }: { post: FeedItem; avatar: string; username: string }) {
  return (
    <div className="pb-1">
      <div className="flex items-center gap-2.5 px-1 py-2">
        <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold truncate">{username}</p>
          {post.location && <p className="text-[11px] text-ink/50 truncate">{post.location}</p>}
        </div>
        <span className="text-lg text-ink/60">⋯</span>
      </div>
      <img src={post.photo} alt="" className="w-full aspect-[4/5] object-cover" />
      <PostActions likes={post.likes} />
      <p className="px-1 text-[13px] mt-1">
        <span className="font-semibold">{username}</span> {post.caption}
      </p>
      <p className="px-1 text-[11px] text-ink/40 mt-1">{post.timeAgo} ago</p>
    </div>
  );
}

function OtherFeedPost({ post }: { post: OtherPost }) {
  return (
    <div className="pb-1">
      <div className="flex items-center gap-2.5 px-1 py-2">
        <div className="w-8 h-8 rounded-full shrink-0" style={{ background: post.avatarGradient }} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold truncate">{post.username}</p>
          {post.location && <p className="text-[11px] text-ink/50 truncate">{post.location}</p>}
        </div>
        <span className="text-lg text-ink/60">⋯</span>
      </div>
      <div className="w-full aspect-[4/5]" style={{ background: post.photoGradient }} />
      <PostActions likes={post.likes} />
      <p className="px-1 text-[13px] mt-1">
        <span className="font-semibold">{post.username}</span> {post.caption}
      </p>
      <p className="px-1 text-[11px] text-ink/40 mt-1">{post.timeAgo} ago</p>
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

function ReelItem({ entry, avatar, username }: { entry: FeedEntry; avatar: string; username: string }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const { data: post } = entry;
  const displayUsername = entry.kind === "own" ? username : post.username;

  return (
    <div className="relative h-full w-full shrink-0 snap-start overflow-hidden">
      {entry.kind === "own" ? (
        <img src={post.photo} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 w-full h-full" style={{ background: post.photoGradient }} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

      <div className="absolute right-3 bottom-44 flex flex-col items-center gap-5">
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setLiked((v) => !v)} aria-label="Like" className="flex flex-col items-center gap-1">
          <HeartIcon filled={liked} />
          <span className="text-[11px]">{(post.likes + (liked ? 1 : 0)).toLocaleString()}</span>
        </motion.button>
        <button aria-label="Comment" className="flex flex-col items-center gap-1">
          <CommentIcon />
        </button>
        <button aria-label="Share" className="flex flex-col items-center gap-1">
          <SendIcon />
        </button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSaved((v) => !v)} aria-label="Save">
          <BookmarkIcon filled={saved} />
        </motion.button>
      </div>

      <div className="absolute left-4 right-16 bottom-24">
        <div className="flex items-center gap-2 mb-2">
          {entry.kind === "own" ? (
            <img src={avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/40" />
          ) : (
            <div className="w-8 h-8 rounded-full border border-white/40" style={{ background: post.avatarGradient }} />
          )}
          <span className="text-[14px] font-semibold">{displayUsername}</span>
        </div>
        <p className="text-[13px] leading-snug">{post.caption}</p>
      </div>
    </div>
  );
}

function ReelsScreen({ feed, avatar, username }: { feed: FeedEntry[]; avatar: string; username: string }) {
  return (
    <div className="absolute inset-0 bg-black text-white overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      <div className="absolute top-12 left-4 z-10 pointer-events-none">
        <h1 className="text-lg font-semibold drop-shadow">Reels</h1>
      </div>
      {feed.map((entry) => (
        <ReelItem key={entry.data.id} entry={entry} avatar={avatar} username={username} />
      ))}
    </div>
  );
}

function SearchScreen({ posts, onOpenPost }: { posts: FeedItem[]; onOpenPost: (index: number) => void }) {
  const [query, setQuery] = useState("");
  const tiles = Array.from({ length: 12 }, (_, i) => posts[i % posts.length]);
  const filtered = query.trim()
    ? tiles.filter((p) => `${p.caption} ${p.location}`.toLowerCase().includes(query.trim().toLowerCase()))
    : tiles;

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-ink">
      <div className="px-4 pt-12 pb-2 shrink-0">
        <div className="flex items-center gap-2 bg-black/5 rounded-xl px-3 py-2">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-ink/40"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search" className="text-ink/40 text-sm">
              ✕
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-24">
        {filtered.length === 0 ? (
          <p className="text-center text-ink/40 text-[14px] mt-10">No results for “{query}”</p>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {filtered.map((p, i) => (
              <button
                key={`${p.id}-${i}`}
                onClick={() => onOpenPost(posts.indexOf(p))}
                aria-label={`Open explore result ${i + 1}`}
                className="relative aspect-square"
              >
                <img src={p.photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActivityRow({ item, index }: { item: ActivityEntry; index: number }) {
  const [following, setFollowing] = useState(false);
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-11 h-11 rounded-full shrink-0" style={{ background: item.gradient }} />
      <p className="flex-1 text-[14px] leading-snug">
        <span className="font-semibold">{item.name}</span> <span className="text-ink/70">{item.text}</span>{" "}
        <span className="text-ink/40">{item.timeAgo}</span>
      </p>
      {item.type === "follow" ? (
        <button
          onClick={() => setFollowing((v) => !v)}
          className="px-3.5 py-1.5 rounded-lg text-[13px] font-semibold shrink-0"
          style={following ? { background: "#0000000d", color: "#111" } : { background: IG_BLUE, color: "#fff" }}
        >
          {following ? "Following" : "Follow"}
        </button>
      ) : (
        <img src={dadaPhotos[index % dadaPhotos.length]} alt="" className="w-10 h-10 rounded shrink-0 object-cover" />
      )}
    </div>
  );
}

function ActivityScreen({ onBack }: { onBack: () => void }) {
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      className="absolute inset-0 z-30 bg-white text-ink flex flex-col"
    >
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 shrink-0 border-b border-black/10">
        <button onClick={onBack} aria-label="Back" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-ink/60 text-lg">
          ‹
        </button>
        <h1 className="text-[17px] font-bold">Activity</h1>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-10">
        <p className="px-4 pt-3 pb-1 text-[13px] font-semibold text-ink/60">This week</p>
        {activityItems.map((item, i) => (
          <ActivityRow key={item.id} item={item} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function CreateScreen({ onCancel, onShare }: { onCancel: () => void; onShare: (item: { photo: string; caption: string }) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="absolute inset-0 z-30 bg-white text-ink flex flex-col"
    >
      <div className="flex items-center justify-between px-4 pt-12 pb-3 border-b border-black/10 shrink-0">
        <button onClick={onCancel} className="text-[15px] text-ink/70">
          Cancel
        </button>
        <h1 className="text-[16px] font-bold">New post</h1>
        <button
          disabled={!selected}
          onClick={() => selected && onShare({ photo: selected, caption })}
          className="text-[15px] font-bold disabled:opacity-30"
          style={{ color: IG_BLUE }}
        >
          Share
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        <div className="aspect-square bg-black/5 flex items-center justify-center">
          {selected ? (
            <img src={selected} alt="" className="w-full h-full object-cover" />
          ) : (
            <p className="text-ink/40 text-[14px]">Choose a photo below</p>
          )}
        </div>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption…"
          rows={3}
          className="w-full px-4 py-3 text-[14px] outline-none resize-none placeholder:text-ink/40"
        />

        <p className="px-4 pb-1 text-[12px] font-semibold text-ink/50">Gallery</p>
        <div className="grid grid-cols-3 gap-0.5">
          {dadaPhotos.map((photo) => (
            <button key={photo} onClick={() => setSelected(photo)} className="relative aspect-square">
              <img src={photo} alt="" className="w-full h-full object-cover" />
              {selected === photo && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-sm font-bold" style={{ color: IG_BLUE }}>
                    ✓
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function EditProfileScreen({
  profile,
  avatar,
  onCancel,
  onSave,
}: {
  profile: ProfileInfo;
  avatar: string;
  onCancel: () => void;
  onSave: (profile: ProfileInfo) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio.join("\n"));
  const [link, setLink] = useState(profile.link);

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="absolute inset-0 z-30 bg-white text-ink flex flex-col"
    >
      <div className="flex items-center justify-between px-4 pt-12 pb-3 border-b border-black/10 shrink-0">
        <button onClick={onCancel} className="text-[15px] text-ink/70">
          Cancel
        </button>
        <h1 className="text-[16px] font-bold">Edit profile</h1>
        <button
          onClick={() => onSave({ ...profile, name, username, bio: bio.split("\n").filter(Boolean), link })}
          className="text-[15px] font-bold"
          style={{ color: IG_BLUE }}
        >
          Done
        </button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-5">
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src={avatar} alt="" className="w-20 h-20 rounded-full object-cover" />
          <button className="text-[14px] font-semibold" style={{ color: IG_BLUE }}>
            Edit picture
          </button>
        </div>
        <label className="block text-[12px] font-semibold text-ink/50 mb-1">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border-b border-black/10 pb-2 mb-4 text-[15px] outline-none" />
        <label className="block text-[12px] font-semibold text-ink/50 mb-1">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border-b border-black/10 pb-2 mb-4 text-[15px] outline-none" />
        <label className="block text-[12px] font-semibold text-ink/50 mb-1">Bio</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full border-b border-black/10 pb-2 mb-4 text-[15px] outline-none resize-none" />
        <label className="block text-[12px] font-semibold text-ink/50 mb-1">Link</label>
        <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full border-b border-black/10 pb-2 mb-4 text-[15px] outline-none" />
      </div>
    </motion.div>
  );
}

function OptionsSheet({ onClose, onLogOut }: { onClose: () => void; onLogOut: () => void }) {
  const items = ["Saved", "Your activity", "QR code", "Settings and privacy"];
  return (
    <motion.div className="absolute inset-0 z-30 flex flex-col justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button aria-label="Dismiss" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        className="relative bg-white rounded-t-2xl overflow-hidden text-ink pb-8"
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mt-2.5 mb-1" />
        {items.map((label) => (
          <button key={label} onClick={onClose} className="w-full text-left px-5 py-3.5 text-[15px] border-b border-black/5">
            {label}
          </button>
        ))}
        <button onClick={onLogOut} className="w-full text-left px-5 py-3.5 text-[15px] text-red-500 font-semibold">
          Log out
        </button>
      </motion.div>
    </motion.div>
  );
}

function ShareSheet({ onClose }: { onClose: () => void }) {
  const options = [
    { label: "Copy Link", icon: "🔗" },
    { label: "Share to…", icon: "📤" },
    { label: "WhatsApp", icon: "💬" },
    { label: "Messages", icon: "✉️" },
  ];
  return (
    <motion.div className="absolute inset-0 z-30 flex flex-col justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button aria-label="Dismiss" onClick={onClose} className="absolute inset-0 bg-black/40" />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        className="relative bg-white rounded-t-2xl overflow-hidden text-ink pb-8"
      >
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mt-2.5 mb-3" />
        <p className="text-center text-[13px] text-ink/50 mb-3">Share profile</p>
        {options.map((o) => (
          <button key={o.label} onClick={onClose} className="w-full flex items-center gap-3 px-5 py-3 text-[15px] border-b border-black/5">
            <span className="text-xl">{o.icon}</span>
            {o.label}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}

function PostViewer({
  posts,
  index,
  avatar,
  username,
  onClose,
  onChangeIndex,
}: {
  posts: FeedItem[];
  index: number;
  avatar: string;
  username: string;
  onClose: () => void;
  onChangeIndex: (index: number) => void;
}) {
  const post = posts[index];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 bg-white text-ink overflow-y-auto no-scrollbar"
    >
      <div className="flex items-center gap-3 px-4 pt-12 pb-2">
        <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-ink/60 text-lg">
          ‹
        </button>
        <h2 className="font-semibold text-[15px]">Post</h2>
      </div>
      <FeedPost post={post} avatar={avatar} username={username} />
      {posts.length > 1 && (
        <div className="flex items-center justify-between px-4 py-4 text-[13px] text-ink/60">
          <button disabled={index === 0} onClick={() => onChangeIndex(index - 1)} className="disabled:opacity-30">
            ‹ Previous
          </button>
          <button disabled={index === posts.length - 1} onClick={() => onChangeIndex(index + 1)} className="disabled:opacity-30">
            Next ›
          </button>
        </div>
      )}
    </motion.div>
  );
}

type ProfileTab = "posts" | "reels" | "tagged";

function ProfileScreen({
  profile,
  postCount,
  avatar,
  posts,
  onOpenStory,
  onOpenPost,
  onEditProfile,
  onShareProfile,
  onOpenMenu,
}: {
  profile: ProfileInfo;
  postCount: number;
  avatar: string;
  posts: FeedItem[];
  onOpenStory: () => void;
  onOpenPost: (index: number) => void;
  onEditProfile: () => void;
  onShareProfile: () => void;
  onOpenMenu: () => void;
}) {
  const [tab, setTab] = useState<ProfileTab>("posts");

  return (
    <div className="px-4 pt-12 pb-8">
      <div className="flex items-center justify-between pb-2 pl-10">
        <div className="flex items-center gap-1.5">
          <h1 className="text-[19px] font-bold">{profile.username}</h1>
          <VerifiedBadge />
        </div>
        <button onClick={onOpenMenu} aria-label="Menu" className="p-2 -mr-2 text-ink/80">
          <HamburgerIcon />
        </button>
      </div>

      <div className="flex items-center gap-6 mb-3">
        <div className="w-[74px] h-[74px] rounded-full p-[2px] shrink-0" style={{ background: "linear-gradient(135deg,#ff9ac2,#8b7bff)" }}>
          <img src={avatar} alt="" className="w-full h-full rounded-full object-cover border-2 border-white" />
        </div>
        <div className="flex-1 flex justify-around text-center">
          <div>
            <p className="font-bold text-[16px]">{postCount.toLocaleString()}</p>
            <p className="text-[12px] text-ink/60">posts</p>
          </div>
          <div>
            <p className="font-bold text-[16px]">{profile.followers}</p>
            <p className="text-[12px] text-ink/60">followers</p>
          </div>
          <div>
            <p className="font-bold text-[16px]">{profile.following}</p>
            <p className="text-[12px] text-ink/60">following</p>
          </div>
        </div>
      </div>

      <div className="text-[14px] leading-snug mb-3">
        <p className="font-semibold">
          {profile.name} <span className="font-normal text-ink/50">{profile.pronoun}</span>
        </p>
        {profile.bio.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className="text-dada-purple font-medium">🔗 {profile.link}</p>
      </div>

      <p className="text-[13px] text-ink/60 mb-3">{FOLLOWED_BY}</p>

      <div className="flex items-center gap-2 mb-5">
        <button onClick={onEditProfile} className="flex-1 rounded-xl py-2 text-[14px] font-semibold bg-black/5 text-ink">
          Edit profile
        </button>
        <button onClick={onShareProfile} className="flex-1 rounded-xl py-2 text-[14px] font-semibold bg-black/5 text-ink">
          Share profile
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
        <button
          onClick={() => setTab("posts")}
          aria-label="Posts"
          className={`flex-1 flex justify-center py-2.5 border-b-2 ${tab === "posts" ? "border-ink text-ink" : "border-transparent text-ink/40"}`}
        >
          <GridIcon active={tab === "posts"} />
        </button>
        <button
          onClick={() => setTab("reels")}
          aria-label="Reels"
          className={`flex-1 flex justify-center py-2.5 border-b-2 ${tab === "reels" ? "border-ink text-ink" : "border-transparent text-ink/40"}`}
        >
          <ReelsIcon />
        </button>
        <button
          onClick={() => setTab("tagged")}
          aria-label="Tagged"
          className={`flex-1 flex justify-center py-2.5 border-b-2 ${tab === "tagged" ? "border-ink text-ink" : "border-transparent text-ink/40"}`}
        >
          <TaggedIcon active={tab === "tagged"} />
        </button>
      </div>

      {tab === "posts" && (
        <div className="grid grid-cols-3 gap-0.5">
          {posts.map((p, i) => (
            <button key={p.id} onClick={() => onOpenPost(i)} aria-label={`Open post ${i + 1}`} className="relative aspect-square">
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
              {i === posts.length - 1 && <span className="absolute top-1.5 right-1.5 text-white text-sm drop-shadow">▶</span>}
            </button>
          ))}
        </div>
      )}

      {tab === "reels" && (
        <div className="grid grid-cols-3 gap-0.5">
          {posts.slice(0, 3).map((p, i) => (
            <button key={p.id} onClick={() => onOpenPost(i)} aria-label={`Open reel ${i + 1}`} className="relative aspect-square">
              <img src={p.photo} alt="" className="w-full h-full object-cover" />
              <span className="absolute bottom-1.5 left-1.5 text-white text-[11px] font-semibold drop-shadow">▶ {Math.max(1, Math.round(p.likes / 10))}k</span>
            </button>
          ))}
        </div>
      )}

      {tab === "tagged" && (
        <div className="flex flex-col items-center gap-2 py-16 text-ink/40">
          <TaggedIcon />
          <p className="text-[14px] font-semibold text-ink/60">No Photos</p>
          <p className="text-[13px] text-center px-10">Photos and videos that people tag you in will appear here.</p>
        </div>
      )}
    </div>
  );
}

function TabBar({
  view,
  theme = "light",
  onHome,
  onReels,
  onCreate,
  onSearch,
  onProfile,
}: {
  view: "feed" | "profile" | "reels" | "search";
  theme?: "light" | "dark";
  onHome: () => void;
  onReels: () => void;
  onCreate: () => void;
  onSearch: () => void;
  onProfile: () => void;
}) {
  const base = theme === "dark" ? "bg-black/40 backdrop-blur border-white/10" : "bg-white border-black/10";
  const active = theme === "dark" ? "text-white" : "text-ink";
  const inactive = theme === "dark" ? "text-white/50" : "text-ink/40";

  return (
    <div className={`absolute inset-x-0 bottom-0 flex items-center justify-around border-t pt-2.5 pb-6 z-10 ${base}`}>
      <button onClick={onHome} aria-label="Home" className={view === "feed" ? active : inactive}>
        <HomeIcon active={view === "feed"} />
      </button>
      <button onClick={onReels} aria-label="Reels" className={view === "reels" ? active : inactive}>
        <ReelsIcon />
      </button>
      <button onClick={onCreate} aria-label="Create" className={inactive}>
        <CreateIcon />
      </button>
      <button onClick={onSearch} aria-label="Search" className={view === "search" ? active : inactive}>
        <SearchIcon />
      </button>
      <button onClick={onProfile} aria-label="Profile" className={view === "profile" ? active : inactive}>
        <ProfileIcon active={view === "profile"} />
      </button>
    </div>
  );
}

export function MemoryIG({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<"feed" | "profile" | "reels" | "search">("feed");
  const [posts, setPosts] = useState<FeedItem[]>(buildInitialPosts);
  const [profile, setProfile] = useState<ProfileInfo>(PROFILE);
  const [postCount, setPostCount] = useState(607);

  const [storyOpen, setStoryOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const avatar = dada2;
  const homeFeed = buildHomeFeed(posts);

  const handleShare = ({ photo, caption }: { photo: string; caption: string }) => {
    setPosts((p) => [
      { id: `local-${Date.now()}`, photo, caption: caption || "New post", location: "", likes: 0, timeAgo: "now" },
      ...p,
    ]);
    setPostCount((c) => c + 1);
    setCreateOpen(false);
  };

  return (
    <div className="absolute inset-0 bg-white text-ink overflow-hidden">
      {view === "feed" && (
        <div className="absolute inset-0 flex flex-col">
          <div className="pt-8 px-4 shrink-0">
            <button onClick={onClose} aria-label="Back to home screen" className="w-8 h-8 -ml-1.5 rounded-full bg-black/5 flex items-center justify-center text-ink/60 text-lg">
              ‹
            </button>
          </div>
          <div className="flex items-center justify-between px-4 pt-1 pb-2 shrink-0">
            <button aria-label="New post" onClick={() => setCreateOpen(true)}>
              <PlusIcon />
            </button>
            <h1 className="text-2xl font-serif italic flex items-center gap-1">
              Instagram <span className="text-sm">⌄</span>
            </h1>
            <button aria-label="Activity" onClick={() => setActivityOpen(true)}>
              <HeartIcon />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-20">
            <div className="flex gap-4 px-4 py-3 overflow-x-auto no-scrollbar border-b border-black/10">
              <button onClick={() => setCreateOpen(true)} className="flex flex-col items-center gap-1.5 shrink-0" aria-label="Add to your story">
                <div className="relative w-14 h-14">
                  <img src={avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-ink text-white text-[11px] leading-none flex items-center justify-center border-2 border-white">
                    +
                  </span>
                </div>
                <span className="text-[10px] text-ink/60">Your story</span>
              </button>
              {stories.map((s) => (
                <button key={s.id} onClick={() => setStoryOpen(true)} className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="w-14 h-14 rounded-full p-[2px]" style={{ background: s.closeFriend ? CLOSE_FRIENDS_GREEN : s.gradient }}>
                    <div className="w-full h-full rounded-full bg-white border-2 border-white" />
                  </div>
                  <span className="text-[10px] text-ink/60">{s.label}</span>
                </button>
              ))}
            </div>

            <div className="px-3">
              {homeFeed.map((item) =>
                item.kind === "own" ? (
                  <FeedPost key={item.data.id} post={item.data} avatar={avatar} username={profile.username} />
                ) : (
                  <OtherFeedPost key={item.data.id} post={item.data} />
                )
              )}
            </div>
          </div>
        </div>
      )}

      {view === "reels" && <ReelsScreen feed={homeFeed} avatar={avatar} username={profile.username} />}

      {view === "search" && <SearchScreen posts={posts} onOpenPost={(i) => setViewerIndex(i)} />}

      {view === "profile" && (
        <>
          <div className="absolute inset-0 overflow-y-auto no-scrollbar pb-20">
            <ProfileScreen
              profile={profile}
              postCount={postCount}
              avatar={avatar}
              posts={posts}
              onOpenStory={() => setStoryOpen(true)}
              onOpenPost={(i) => setViewerIndex(i)}
              onEditProfile={() => setEditOpen(true)}
              onShareProfile={() => setShareOpen(true)}
              onOpenMenu={() => setMenuOpen(true)}
            />
          </div>
          <BackButton onClick={() => setView("feed")} />
        </>
      )}

      <TabBar
        view={view}
        theme={view === "reels" ? "dark" : "light"}
        onHome={() => (view === "feed" ? onClose() : setView("feed"))}
        onReels={() => setView("reels")}
        onCreate={() => setCreateOpen(true)}
        onSearch={() => setView("search")}
        onProfile={() => setView("profile")}
      />

      <AnimatePresence>
        {storyOpen && <StoryViewer onClose={() => setStoryOpen(false)} />}
        {createOpen && <CreateScreen onCancel={() => setCreateOpen(false)} onShare={handleShare} />}
        {activityOpen && <ActivityScreen onBack={() => setActivityOpen(false)} />}
        {editOpen && (
          <EditProfileScreen
            profile={profile}
            avatar={avatar}
            onCancel={() => setEditOpen(false)}
            onSave={(p) => {
              setProfile(p);
              setEditOpen(false);
            }}
          />
        )}
        {menuOpen && <OptionsSheet onClose={() => setMenuOpen(false)} onLogOut={onClose} />}
        {shareOpen && <ShareSheet onClose={() => setShareOpen(false)} />}
        {viewerIndex !== null && (
          <PostViewer
            posts={posts}
            index={viewerIndex}
            avatar={avatar}
            username={profile.username}
            onClose={() => setViewerIndex(null)}
            onChangeIndex={setViewerIndex}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
