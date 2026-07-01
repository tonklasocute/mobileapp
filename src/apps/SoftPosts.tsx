import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "../components/AppShell";
import { GlassCard } from "../components/GlassCard";
import { Button } from "../components/Button";
import initialPosts from "../data/posts.json";
import type { Post } from "../types";

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);

  return (
    <GlassCard className="p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full"
          style={{ background: "linear-gradient(135deg,#8b7bff,#ff9ac2)" }}
        />
        <div>
          <p className="text-[13px] font-semibold leading-none">{post.author}</p>
          <p className="text-[11px] text-white/40">{post.handle} · {post.timeAgo}</p>
        </div>
      </div>
      <p className="text-[14px] text-white/90 leading-snug">{post.text}</p>
      <div className="flex items-center gap-5 mt-1 text-[12px] text-white/60">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setLiked((v) => !v)}
          className="flex items-center gap-1"
        >
          <motion.span animate={{ scale: liked ? [1, 1.4, 1] : 1 }}>
            {liked ? "❤️" : "🤍"}
          </motion.span>
          {post.likes + (liked ? 1 : 0)}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setReposted((v) => !v)}
          className="flex items-center gap-1"
        >
          <motion.span animate={{ rotate: reposted ? 360 : 0 }} transition={{ duration: 0.4 }}>
            🔁
          </motion.span>
          {post.reposts + (reposted ? 1 : 0)}
        </motion.button>
      </div>
    </GlassCard>
  );
}

const dailyQuotes = [
  "You are doing better than you think you are.",
  "Soft days are still productive days.",
  "Whatever today held, you showed up for it.",
];

function ComposeScreen({ onPost }: { onPost: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="flex flex-col h-full px-4 py-4 gap-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share something soft…"
        rows={5}
        className="glass rounded-2xl p-4 text-sm outline-none placeholder:text-white/40 resize-none"
      />
      <Button
        disabled={!text.trim()}
        className="self-end disabled:opacity-40"
        onClick={() => text.trim() && onPost(text.trim())}
      >
        Post
      </Button>
    </div>
  );
}

export function SoftPosts({ onClose }: { onClose: () => void }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts as Post[]);
  const [composing, setComposing] = useState(false);
  const [quoteIndex] = useState(() => Math.floor(Math.random() * dailyQuotes.length));

  return (
    <div className="absolute inset-0">
      <AppShell
        title={composing ? "New Post" : "Soft Posts"}
        onBack={() => (composing ? setComposing(false) : onClose())}
        action={
          !composing ? (
            <button onClick={() => setComposing(true)} className="text-xl">
              +
            </button>
          ) : undefined
        }
      >
        {composing ? (
          <ComposeScreen
            onPost={(text) => {
              setPosts((p) => [
                {
                  id: `local-${Date.now()}`,
                  author: "Dada",
                  handle: "@dada",
                  text,
                  timeAgo: "now",
                  likes: 0,
                  reposts: 0,
                },
                ...p,
              ]);
              setComposing(false);
            }}
          />
        ) : (
          <div className="px-4 py-4 flex flex-col gap-3">
            <GlassCard className="p-4 text-center text-[13px] text-white/80 italic">
              "{dailyQuotes[quoteIndex]}"
            </GlassCard>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </AppShell>
    </div>
  );
}
