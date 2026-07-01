import { useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { AppShell } from "../components/AppShell";
import { ChatBubble } from "../components/ChatBubble";
import { Button } from "../components/Button";
import chats from "../data/chats.json";
import type { ChatMessage } from "../types";

interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  gradient: string;
  theOne?: boolean;
}

const profiles: Profile[] = [
  {
    id: "pr1",
    name: "Wren",
    age: 27,
    bio: "Plant parent. Bad at small talk, good at long walks.",
    gradient: "linear-gradient(160deg,#6ea8ff,#8b7bff)",
  },
  {
    id: "pr2",
    name: "Sam",
    age: 29,
    bio: "Slow coffee, no destination walks, home before it gets cold.",
    gradient: "linear-gradient(160deg,#ff9ac2,#8b7bff)",
    theOne: true,
  },
  {
    id: "pr3",
    name: "Iris",
    age: 25,
    bio: "Currently reading four books at once, finishing none.",
    gradient: "linear-gradient(160deg,#ffb4a8,#ff9ac2)",
  },
];

function SwipeCard({
  profile,
  onSwiped,
  isTop,
}: {
  profile: Profile;
  onSwiped: (liked: boolean) => void;
  isTop: boolean;
}) {
  const controls = useAnimation();

  return (
    <motion.div
      className="absolute inset-0 rounded-card overflow-hidden shadow-xl"
      style={{ background: profile.gradient }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      animate={controls}
      whileDrag={{ scale: 1.02 }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 100) {
          controls
            .start({ x: 500, rotate: 20, opacity: 0, transition: { duration: 0.35 } })
            .then(() => onSwiped(true));
        } else if (info.offset.x < -100) {
          controls
            .start({ x: -500, rotate: -20, opacity: 0, transition: { duration: 0.35 } })
            .then(() => onSwiped(false));
        } else {
          controls.start({ x: 0, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
      }}
    >
      <div className="absolute inset-0 flex flex-col justify-end p-5 bg-gradient-to-t from-black/60 via-black/0 to-black/0">
        <h2 className="text-2xl font-semibold">
          {profile.name}, {profile.age}
        </h2>
        <p className="text-sm text-white/85 mt-1">{profile.bio}</p>
      </div>
    </motion.div>
  );
}

function SwipeScreen({ onMatched }: { onMatched: () => void }) {
  const [stack, setStack] = useState(profiles);

  const handleSwiped = (profile: Profile, liked: boolean) => {
    setStack((s) => s.filter((p) => p.id !== profile.id));
    if (liked && profile.theOne) onMatched();
  };

  return (
    <div className="flex flex-col h-full px-5 pt-4 pb-6">
      <div className="relative flex-1">
        {stack.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm text-center px-8">
            That's everyone for now. Try liking Sam — the story continues there.
          </div>
        )}
        {stack.map((p, i) => (
          <SwipeCard
            key={p.id}
            profile={p}
            isTop={i === stack.length - 1}
            onSwiped={(liked) => handleSwiped(p, liked)}
          />
        ))}
      </div>
      <div className="flex justify-center gap-6 mt-5 shrink-0">
        <button
          onClick={() => stack.length && handleSwiped(stack[stack.length - 1], false)}
          className="w-14 h-14 rounded-full glass text-2xl"
        >
          ✕
        </button>
        <button
          onClick={() => stack.length && handleSwiped(stack[stack.length - 1], true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-dada-purple to-dada-pink text-2xl"
        >
          ❤
        </button>
      </div>
    </div>
  );
}

function MatchScreen({ onContinue }: { onContinue: () => void }) {
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
      <p className="text-white/70 text-sm">You and Sam liked each other.</p>
      <Button onClick={onContinue}>Say hello</Button>
    </motion.div>
  );
}

function ChatScreen() {
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
          placeholder="Message Sam…"
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
  const [stage, setStage] = useState<"swipe" | "match" | "chat">("swipe");

  return (
    <div className="absolute inset-0">
      <AppShell
        title={stage === "chat" ? "Sam" : "CMB Origin"}
        onBack={() => (stage === "chat" ? setStage("swipe") : onClose())}
      >
        {stage === "swipe" && <SwipeScreen onMatched={() => setStage("match")} />}
        {stage === "chat" && <ChatScreen />}
      </AppShell>

      <AnimatePresence>
        {stage === "match" && (
          <MatchScreen onContinue={() => setStage("chat")} />
        )}
      </AnimatePresence>
    </div>
  );
}
