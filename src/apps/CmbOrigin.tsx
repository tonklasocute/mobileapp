import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { AppShell } from "../components/AppShell";
import { ChatBubble } from "../components/ChatBubble";
import { Button } from "../components/Button";
import chats from "../data/chats.json";
import type { ChatMessage } from "../types";
import tonkla from "../assets/pic/tonkla.jpg";

type Block =
  | { kind: "quote"; title: string; text: string }
  | { kind: "info"; title: string; icon: string; text: string }
  | { kind: "list"; title: string; items: { icon: string; text: string }[] }
  | { kind: "tags"; title: string; tags: string[] }
  | { kind: "photo"; image?: string; gradient?: string; badge?: string }
  | {
      kind: "identity";
      name: string;
      age: number;
      location: string;
      job: string;
      education: string;
    };

interface Profile {
  id: string;
  theOne?: boolean;
  blocks: Block[];
}

const profiles: Profile[] = [
  {
    id: "pr1",
    theOne: true,
    blocks: [
      { kind: "photo", image: tonkla, badge: "Most Likely to Match" },
      {
        kind: "identity",
        name: "T",
        age: 29,
        location: "Khwaeng Wat Arun, Krung Thep Maha Nakhon",
        job: "Kindergarten English Teacher",
        education: "Srinakharinwirot University · Bachelors",
      },
      { kind: "quote", title: "I like…", text: "Slow coffee, no destination walks, home before it gets cold." },
      { kind: "info", title: "What I'm looking for", icon: "🔍", text: "Not sure yet" },
      { kind: "quote", title: "Does “The One” exist?", text: "Does the one exist?" },
      {
        kind: "list",
        title: "More about me",
        items: [
          { icon: "🌐", text: "Thai" },
          { icon: "✳️", text: "Buddhist" },
          { icon: "📏", text: "165cm" },
        ],
      },
      {
        kind: "quote",
        title: "Before we go on a date, you should know…",
        text: "Cheerful, playful, and a little chaotic — I love good food and making people laugh 😊",
      },
      { kind: "tags", title: "Personality", tags: ["✨ Active", "✨ Balanced"] },
      { kind: "quote", title: "What's your legal addiction?", text: "Coffee ☕ and good playlists — I'm mildly addicted" },
    ],
  },
];

function HeartButton({
  active,
  onClick,
  className,
}: {
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className={clsx(
        "w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center shrink-0",
        className,
      )}
      aria-label="Like"
    >
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        animate={{ scale: active ? [1, 1.3, 1] : 1 }}
      >
        <path
          fill={active ? "#ff5a7a" : "#111"}
          d="M12 21s-7.2-4.6-10-9.3C.5 8.4 2 4.6 5.6 4c2-.3 3.9.6 5 2.3C11.7 4.6 13.6 3.7 15.6 4c3.6.6 5.1 4.4 3.6 7.7C16.4 16.4 12 21 12 21z"
        />
      </motion.svg>
    </motion.button>
  );
}

function QuoteCard({
  title,
  text,
  liked,
  onLike,
}: {
  title: string;
  text: string;
  liked: boolean;
  onLike: () => void;
}) {
  return (
    <div className="bg-white text-ink rounded-3xl p-4">
      <h3 className="font-bold text-[17px] mb-3">{title}</h3>
      <div className="relative flex items-center gap-3 bg-dada-purple/10 rounded-2xl pl-4 pr-5 py-4">
        <div className="flex-1">
          <span className="block text-dada-purple/50 text-2xl leading-none mb-0.5">“</span>
          <p className="text-[15px] leading-snug">{text}</p>
        </div>
        <HeartButton active={liked} onClick={onLike} className="absolute -right-3 top-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}

function InfoCard({ title, icon, text }: { title: string; icon: string; text: string }) {
  return (
    <div className="bg-white text-ink rounded-3xl p-4">
      <h3 className="font-bold text-[17px] mb-2">{title}</h3>
      <div className="flex items-center gap-2 text-[15px] text-ink/70">
        <span className="grayscale">{icon}</span>
        {text}
      </div>
    </div>
  );
}

function ListCard({ title, items }: { title: string; items: { icon: string; text: string }[] }) {
  return (
    <div className="bg-white text-ink rounded-3xl p-4">
      <h3 className="font-bold text-[17px] mb-3">{title}</h3>
      <div className="flex flex-col gap-2.5">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3 text-[15px] text-ink/80">
            <span className="grayscale w-4 text-center">{it.icon}</span>
            {it.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function TagsCard({ title, tags }: { title: string; tags: string[] }) {
  return (
    <div className="bg-white text-ink rounded-3xl p-4">
      <h3 className="font-bold text-[17px] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="rounded-full border border-black/10 px-3.5 py-1.5 text-[13px]">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function PhotoCard({
  image,
  gradient,
  badge,
  liked,
  onLike,
}: {
  image?: string;
  gradient?: string;
  badge?: string;
  liked: boolean;
  onLike: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {badge && (
        <div className="flex items-center gap-3 bg-dada-purple/10 rounded-2xl p-3">
          <span
            className="w-9 h-9 rounded-full shrink-0"
            style={{ background: "linear-gradient(135deg,#ff9ac2,#8b7bff)" }}
          />
          <div className="text-[13px] leading-snug">
            <p className="font-bold text-ink">{badge}</p>
            <p className="text-ink/60">Based on your recent activity, you two could have something special.</p>
          </div>
        </div>
      )}
      <div className="relative rounded-3xl overflow-hidden aspect-[4/5]" style={image ? undefined : { background: gradient }}>
        {image && <img src={image} alt="" className="w-full h-full object-cover" />}
        <span className="absolute top-3 left-3 bg-black/40 text-white text-[11px] rounded-full px-2 py-0.5">
          1/6
        </span>
        <HeartButton active={liked} onClick={onLike} className="absolute right-3 bottom-3" />
      </div>
    </div>
  );
}

function IdentityCard({ name, age, location, job, education }: {
  name: string;
  age: number;
  location: string;
  job: string;
  education: string;
}) {
  return (
    <div className="bg-white text-ink rounded-3xl p-4">
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <div className="flex flex-col gap-2 text-[14px] text-ink/70">
        <div className="flex items-center gap-2">
          <span className="grayscale">🎂</span>
          {age}
          <span className="grayscale ml-2">📍</span>
          <span className="truncate">{location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="grayscale">💼</span>
          {job}
        </div>
        <div className="flex items-center gap-2">
          <span className="grayscale">🎓</span>
          {education}
        </div>
      </div>
    </div>
  );
}

function Countdown() {
  const [secs, setSecs] = useState(23 * 3600 + 59 * 60 + 59);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center gap-1.5 bg-black/5 rounded-full pl-1 pr-2.5 py-1">
      <span className="w-5 h-5 rounded-full bg-dada-blue flex items-center justify-center text-white text-[10px]">
        ⏱
      </span>
      <span className="text-[12px] font-semibold text-ink tabular-nums">
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}

function SuggestedFeed({ onMatched }: { onMatched: (name: string) => void }) {
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleLike = (key: string) => setLikes((l) => ({ ...l, [key]: !l[key] }));

  const handlePhotoLike = (profile: Profile, key: string) => {
    toggleLike(key);
    if (profile.theOne) {
      const identity = profile.blocks.find((b) => b.kind === "identity");
      onMatched(identity && identity.kind === "identity" ? identity.name : "them");
    }
  };

  const skip = () => {
    scrollRef.current?.scrollBy({ top: scrollRef.current.clientHeight * 0.9, behavior: "smooth" });
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-white text-ink">
      <div className="flex items-center justify-between px-4 pt-12 pb-3 shrink-0">
        <h1 className="text-2xl font-extrabold">Suggested</h1>
        <div className="flex items-center gap-2">
          <Countdown />
          <button className="w-8 h-8 flex items-center justify-center text-lg text-ink/70" aria-label="History">
            ↺
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-ink/70" aria-label="Filters">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="5" y1="5" x2="5" y2="19" />
              <circle cx="5" cy="9" r="2.2" fill="currentColor" stroke="none" />
              <line x1="12" y1="5" x2="12" y2="19" />
              <circle cx="12" cy="15" r="2.2" fill="currentColor" stroke="none" />
              <line x1="19" y1="5" x2="19" y2="19" />
              <circle cx="19" cy="7" r="2.2" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pb-4 flex flex-col gap-3">
        {profiles.map((profile) =>
          profile.blocks.map((block, i) => {
            const key = `${profile.id}-${i}`;
            switch (block.kind) {
              case "quote":
                return (
                  <QuoteCard key={key} title={block.title} text={block.text} liked={!!likes[key]} onLike={() => toggleLike(key)} />
                );
              case "info":
                return <InfoCard key={key} {...block} />;
              case "list":
                return <ListCard key={key} {...block} />;
              case "tags":
                return <TagsCard key={key} {...block} />;
              case "photo":
                return (
                  <PhotoCard
                    key={key}
                    image={block.image}
                    gradient={block.gradient}
                    badge={block.badge}
                    liked={!!likes[key]}
                    onLike={() => handlePhotoLike(profile, key)}
                  />
                );
              case "identity":
                return <IdentityCard key={key} {...block} />;
            }
          }),
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={skip}
        className="absolute left-4 bottom-24 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-ink z-10"
        aria-label="Skip"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </svg>
      </motion.button>
    </div>
  );
}

const TABS = [
  { id: "suggested", label: "Suggested", icon: "◉", badge: 31 },
  { id: "likes", label: "Likes You", icon: "♡", badge: 3 },
  { id: "discover", label: "Discover", icon: "⌕", dot: true },
  { id: "chats", label: "Chats", icon: "💬" },
  { id: "me", label: "Me", icon: "👤" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function TabBar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <div className="flex items-center justify-around border-t border-black/10 bg-white pt-2 pb-6 shrink-0">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={clsx("relative flex flex-col items-center gap-0.5 text-[11px]", active === t.id ? "text-ink font-bold" : "text-ink/40")}
        >
          <span className="text-lg leading-none">{t.icon}</span>
          {t.label}
          {"badge" in t && t.badge && (
            <span className="absolute -top-1 right-1.5 bg-red-500 text-white text-[9px] rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1">
              {t.badge}
            </span>
          )}
          {"dot" in t && t.dot && <span className="absolute -top-0.5 right-2 w-2 h-2 rounded-full bg-red-500" />}
        </button>
      ))}
    </div>
  );
}

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white text-ink">
      <div className="px-4 pt-12 pb-3 shrink-0">
        <h1 className="text-2xl font-extrabold">{label}</h1>
      </div>
      <div className="flex-1 flex items-center justify-center text-ink/40 text-sm">Coming soon</div>
    </div>
  );
}

function MatchScreen({ name, onContinue }: { name: string; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 px-8 text-center"
      style={{ background: "radial-gradient(120% 80% at 50% 20%,#3a2a63,#0d0b18 70%)" }}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        className="text-6xl"
      >
        ❤️
      </motion.div>
      <motion.h1
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold text-gradient-dada"
      >
        It's a Match!
      </motion.h1>
      <p className="text-white/70 text-sm">You and {name} liked each other.</p>
      <Button onClick={onContinue}>Say hello</Button>
    </motion.div>
  );
}

function ChatScreen({ name }: { name: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>(chats as ChatMessage[]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);

  const send = () => {
    if (!draft.trim()) return;
    const msg: ChatMessage = {
      id: `local-${Date.now()}`,
      from: "dada",
      text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    };
    setMessages((m) => [...m, msg]);
    setDraft("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: `reply-${Date.now()}`,
          from: "them",
          text: ":)",
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
        },
      ]);
    }, 1400);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4">
        {messages.map((m) => (
          <ChatBubble key={m.id} message={m} />
        ))}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass w-14 px-3 py-2 rounded-3xl rounded-bl-md text-[11px] text-white/50"
            >
              typing…
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 p-3 border-t border-white/10 shrink-0">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={`Message ${name}…`}
          className="flex-1 glass rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-white/40"
        />
        <button
          onClick={send}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-dada-purple to-dada-pink flex items-center justify-center"
        >
          ↑
        </button>
      </div>
    </div>
  );
}

export function CmbOrigin({ onClose }: { onClose: () => void }) {
  const [stage, setStage] = useState<"main" | "match" | "chat">("main");
  const [tab, setTab] = useState<TabId>("suggested");
  const [matchName, setMatchName] = useState("them");

  if (stage === "chat") {
    return (
      <div className="absolute inset-0">
        <AppShell title={matchName} onBack={() => setStage("main")}>
          <ChatScreen name={matchName} />
        </AppShell>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {tab === "suggested" && (
        <SuggestedFeed
          onMatched={(name) => {
            setMatchName(name);
            setStage("match");
          }}
        />
      )}
      {tab !== "suggested" && tab !== "chats" && <PlaceholderTab label={TABS.find((t) => t.id === tab)!.label} />}
      {tab === "chats" && (
        <div className="absolute inset-0 flex flex-col">
          <div className="flex-1 min-h-0">
            <ChatScreen name={matchName} />
          </div>
        </div>
      )}
      {tab !== "chats" && (
        <div className="absolute inset-x-0 bottom-0">
          <TabBar active={tab} onChange={setTab} />
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-12 left-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-ink/60 text-lg z-10"
        aria-label="Close CMB"
      >
        ‹
      </button>

      <AnimatePresence>
        {stage === "match" && <MatchScreen name={matchName} onContinue={() => setStage("chat")} />}
      </AnimatePresence>
    </div>
  );
}
