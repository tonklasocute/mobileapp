import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { AppShell } from "../components/AppShell";
import { ChatBubble } from "../components/ChatBubble";
import { Button } from "../components/Button";
import chats from "../data/chats.json";
import type { ChatMessage } from "../types";
import dada1 from "../assets/pic/dada1.jpg";
import dada2 from "../assets/pic/dada2.jpg";
import dada3 from "../assets/pic/dada3.jpg";
import dada4 from "../assets/pic/dada4.jpg";
import dada5 from "../assets/pic/dada5.jpg";
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
        age: 26,
        location: "Khwaeng Bang Khen, Krung Thep Maha Nakhon",
        job: "Programmer",
        education: "King Mongkut's Institute of Technology Ladkrabang · Bachelors",
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
            style={{ background: "linear-gradient(135deg,#ffc2dd,#c3b6ff)" }}
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
  { id: "suggested", label: "Suggested", badge: 31 },
  { id: "likes", label: "Likes You", badge: "99+" },
  { id: "discover", label: "Discover", dot: true },
  { id: "chats", label: "Chats" },
  { id: "me", label: "Me" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function TabIcon({ id, active }: { id: TabId; active: boolean }) {
  const stroke = active ? "#111" : "#9a9a9a";
  if (id === "suggested") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3.2" fill={active ? stroke : "none"} stroke={stroke} strokeWidth="1.8" />
      </svg>
    );
  }
  if (id === "likes") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path
          fill={active ? stroke : "none"}
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
          d="M12 20.2s-7.5-4.6-9.9-9.2C.6 7.6 2.2 4 5.7 3.4c2-.3 4 .6 5 2.3C11.7 4 13.7 3.1 15.7 3.4c3.5.6 5.1 4.2 3.6 7.6-2.4 4.6-9.9 9.2-9.9 9.2z"
        />
      </svg>
    );
  }
  if (id === "discover") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="10.5" cy="10.5" r="7" />
        <line x1="20" y1="20" x2="15.5" y2="15.5" />
      </svg>
    );
  }
  if (id === "chats") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path
          fill={active ? stroke : "none"}
          stroke={stroke}
          strokeWidth="1.8"
          strokeLinejoin="round"
          d="M12 3.5c-5 0-9 3.4-9 7.6 0 2.6 1.5 4.9 3.8 6.3-.1 1-.4 2-1 2.9-.1.2.1.4.3.3 1.5-.4 2.8-1 3.9-1.8.6.1 1.3.2 2 .2 5 0 9-3.4 9-7.6s-4-7.9-9-7.9z"
        />
        {active && (
          <>
            <circle cx="8.5" cy="11.2" r="1" fill="#fff" />
            <circle cx="12" cy="11.2" r="1" fill="#fff" />
            <circle cx="15.5" cy="11.2" r="1" fill="#fff" />
          </>
        )}
      </svg>
    );
  }
  return (
    <img
      src={tonkla}
      alt=""
      className={clsx("w-[22px] h-[22px] rounded-full object-cover", active && "ring-2 ring-dada-blue")}
    />
  );
}

function TabBar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <div className="flex items-center justify-around border-t border-black/10 bg-white pt-2 pb-6 shrink-0">
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={clsx("relative flex flex-col items-center gap-1 text-[11px]", active === t.id ? "text-ink font-bold" : "text-ink/40")}
        >
          <TabIcon id={t.id} active={active === t.id} />
          {t.label}
          {"badge" in t && t.badge && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] rounded-full min-w-[18px] h-[15px] flex items-center justify-center px-1">
              {t.badge}
            </span>
          )}
          {"dot" in t && t.dot && <span className="absolute -top-0.5 right-2 w-2 h-2 rounded-full bg-red-500" />}
        </button>
      ))}
    </div>
  );
}

const LOCKED_LIKES = [
  { photo: dada1, caption: "Mystery admirer" },
  { photo: dada3, caption: "Someone nearby" },
  { photo: dada4, caption: "New here" },
  { photo: dada5, caption: "Liked you" },
];

function LikesYouTab({ matchedName, matchedPhoto }: { matchedName: string; matchedPhoto: string }) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white text-ink">
      <div className="px-4 pt-12 pb-3 shrink-0">
        <h1 className="text-2xl font-extrabold">Likes You</h1>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 bg-dada-purple/10 rounded-2xl p-4">
          <span className="text-2xl">💎</span>
          <div className="text-[13px] leading-snug flex-1">
            <p className="font-bold text-ink">Unlock 99+ likes</p>
            <p className="text-ink/60">See everyone who liked you with Premium.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
            <img src={matchedPhoto} alt="" className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 bg-black/50 text-white text-[11px] rounded-full px-2 py-0.5">Matched</span>
            <span className="absolute bottom-2 left-2 right-2 text-white text-[13px] font-semibold drop-shadow">{matchedName}</span>
          </div>
          {LOCKED_LIKES.map((l, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img src={l.photo} alt="" className="w-full h-full object-cover blur-lg scale-110" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <span className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-base">🔒</span>
              </div>
              <span className="absolute bottom-2 left-2 right-2 text-white text-[12px] font-medium drop-shadow text-center">
                {l.caption}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const DISCOVER_CARDS = [
  { photo: dada1, caption: "Still her." },
  { photo: dada3, caption: "Yep, her again." },
  { photo: dada4, caption: "No one else." },
  { photo: dada5, caption: "Obviously her." },
  { photo: dada2, caption: "Always will be." },
];

function DiscoverTab() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="absolute inset-0 flex flex-col bg-white text-ink">
      <div className="px-4 pt-12 pb-3 shrink-0">
        <h1 className="text-2xl font-extrabold">Discover</h1>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 grid grid-cols-2 gap-3 content-start">
        {DISCOVER_CARDS.map((c, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            className="relative rounded-2xl overflow-hidden aspect-[4/5]"
          >
            <img src={c.photo} alt="" className="w-full h-full object-cover" />
            <span className="absolute bottom-2 left-2 right-2 text-white text-[12px] font-semibold drop-shadow text-left">
              {c.caption}
            </span>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/90 flex flex-col items-center justify-center gap-4 px-8"
            onClick={() => setOpen(null)}
          >
            <img src={DISCOVER_CARDS[open].photo} alt="" className="w-full rounded-3xl object-cover max-h-[70%]" />
            <p className="text-white font-semibold">{DISCOVER_CARDS[open].caption}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MeTab() {
  return (
    <div className="absolute inset-0 flex flex-col bg-white text-ink">
      <div className="px-4 pt-12 pb-3 shrink-0">
        <h1 className="text-2xl font-extrabold">Me</h1>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 flex flex-col gap-3">
        <div className="bg-white rounded-3xl p-4 flex items-center gap-4 border border-black/5">
          <img src={dada2} alt="" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <h2 className="text-lg font-bold">You</h2>
            <p className="text-ink/60 text-sm">Looking for: her, apparently</p>
          </div>
        </div>
        <ListCard
          title="Settings"
          items={[
            { icon: "🔔", text: "Notifications" },
            { icon: "🔒", text: "Privacy" },
            { icon: "💳", text: "Subscription" },
            { icon: "❓", text: "Help" },
          ]}
        />
      </div>
    </div>
  );
}

function ChatRow({
  name,
  photo,
  preview,
  pill,
  onClick,
}: {
  name: string;
  photo: string;
  preview: string;
  pill?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx("flex items-start gap-3 px-4 py-3", onClick && "active:bg-black/[0.02] cursor-pointer")}
    >
      <img src={photo} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-dada-blue shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[15px] text-ink truncate">
          <span className="font-semibold">{name}</span>
          <span className="text-dada-purple font-medium"> · Liked you back!</span>
        </p>
        <p className={clsx("text-[14px] mt-0.5", onClick ? "text-ink/80" : "text-ink/45")}>{preview}</p>
      </div>
      {pill && (
        <span className="shrink-0 mt-0.5 bg-dada-purple/15 text-dada-purple text-[12px] font-medium rounded-full px-3 py-1 whitespace-nowrap">
          {pill}
        </span>
      )}
    </div>
  );
}

function ChatsListTab({
  matchName,
  matchPhoto,
  onOpenChat,
}: {
  matchName: string;
  matchPhoto: string;
  onOpenChat: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col bg-white text-ink">
      <div className="px-4 pt-12 pb-3 shrink-0">
        <h1 className="text-2xl font-extrabold">Chats</h1>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <ChatRow
          name={matchName}
          photo={matchPhoto}
          preview={`Your chat with ${matchName} has been extended for 3 days`}
          pill="Your move"
          onClick={onOpenChat}
        />
        <div className="bg-black/5 px-4 py-2 text-[13px] text-ink/50">Expired Conversations</div>
        <ChatRow name="Mystery match" photo={dada3} preview="Would you like to extend this chat?" />
        <ChatRow name="Mystery match" photo={dada4} preview="Would you like to extend this chat?" />
      </div>
    </div>
  );
}

const CONFETTI = [
  { x: "12%", y: "18%", color: "#ffc2dd", delay: 0 },
  { x: "82%", y: "14%", color: "#c3b6ff", delay: 0.3 },
  { x: "20%", y: "70%", color: "#b3d9ff", delay: 0.6 },
  { x: "78%", y: "68%", color: "#ffc2dd", delay: 0.9 },
  { x: "50%", y: "10%", color: "#c3b6ff", delay: 1.2 },
  { x: "90%", y: "45%", color: "#b3d9ff", delay: 0.45 },
];

function MatchScreen({
  name,
  onContinue,
  onKeepSwiping,
}: {
  name: string;
  onContinue: () => void;
  onKeepSwiping: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 px-8 text-center overflow-hidden"
      style={{ background: "radial-gradient(120% 80% at 50% 20%,#4a3968,#2e2640 70%)" }}
    >
      {CONFETTI.map((c, i) => (
        <motion.span
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ left: c.x, top: c.y, background: c.color }}
          initial={{ opacity: 0, y: -10, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], y: 30, scale: 1 }}
          transition={{ delay: c.delay, duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
        />
      ))}

      <motion.h1
        initial={{ y: -12, opacity: 0, scale: 1.3 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 14 }}
        className="text-4xl font-extrabold italic tracking-tight text-gradient-dada -rotate-2"
      >
        It's a Match!
      </motion.h1>

      <div className="relative w-36 h-24 my-2">
        <motion.img
          src={tonkla}
          initial={{ x: 30, rotate: 10, opacity: 0 }}
          animate={{ x: 0, rotate: -6, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
          className="absolute left-0 top-0 w-24 h-24 rounded-full object-cover border-[3px] border-white/90 shadow-xl"
        />
        <motion.img
          src={dada2}
          initial={{ x: -30, rotate: -10, opacity: 0 }}
          animate={{ x: 0, rotate: 6, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }}
          className="absolute right-0 top-0 w-24 h-24 rounded-full object-cover border-[3px] border-white/90 shadow-xl"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 320, damping: 14 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-dada-purple to-dada-pink flex items-center justify-center text-base shadow-lg"
        >
          ❤️
        </motion.div>
      </div>

      <motion.p
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/70 text-sm"
      >
        You and {name} liked each other.
      </motion.p>

      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center gap-3 mt-1"
      >
        <Button onClick={onContinue} className="px-10 py-3 text-base">
          Say hello
        </Button>
        <Button variant="ghost" onClick={onKeepSwiping}>
          Keep swiping
        </Button>
      </motion.div>
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
      {tab === "likes" && <LikesYouTab matchedName={matchName} matchedPhoto={dada2} />}
      {tab === "discover" && <DiscoverTab />}
      {tab === "me" && <MeTab />}
      {tab === "chats" && (
        <ChatsListTab matchName={matchName} matchPhoto={dada2} onOpenChat={() => setStage("chat")} />
      )}
      <div className="absolute inset-x-0 bottom-0">
        <TabBar active={tab} onChange={setTab} />
      </div>

      <button
        onClick={onClose}
        className="absolute top-12 left-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-ink/60 text-lg z-10"
        aria-label="Close CMB"
      >
        ‹
      </button>

      <AnimatePresence>
        {stage === "match" && (
          <MatchScreen
            name={matchName}
            onContinue={() => setStage("chat")}
            onKeepSwiping={() => setStage("main")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
