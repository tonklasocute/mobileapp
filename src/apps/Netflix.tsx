import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "../components/AppShell";
import rows from "../data/shows";
import type { Show } from "../types";

const RED = "var(--color-netflix-red)";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Poster({ show, onOpen }: { show: Show; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="shrink-0 w-28 h-40 rounded-lg overflow-hidden relative flex items-end p-2 text-left"
      style={show.poster ? undefined : { background: show.gradient }}
    >
      {show.poster ? (
        <img
          src={show.poster}
          alt={show.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: show.posterPosition }}
        />
      ) : (
        <span className="relative text-[12px] font-semibold leading-tight drop-shadow">
          {show.title}
        </span>
      )}
    </button>
  );
}

function HomeView({ onOpenShow }: { onOpenShow: (show: Show) => void }) {
  const hero = rows[0].shows[0];
  const heroImage = hero.banner ?? hero.poster;

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div
        className="relative h-56 flex flex-col justify-end p-4 gap-3 overflow-hidden"
        style={heroImage ? undefined : { background: hero.gradient }}
      >
        {heroImage && (
          <>
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: hero.banner ? undefined : hero.posterPosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          </>
        )}
        <p className="relative text-2xl font-bold drop-shadow">{hero.title}</p>
        <div className="relative flex gap-2">
          <button
            onClick={() => onOpenShow(hero)}
            disabled
            className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-white text-black text-sm font-semibold opacity-50 cursor-not-allowed"
          >
            ▶ Play
          </button>
          <button
            onClick={() => onOpenShow(hero)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-md glass text-sm font-semibold"
          >
            ⓘ Info
          </button>
        </div>
      </div>

      {rows.map((row) => (
        <div key={row.id} className="flex flex-col gap-2">
          <p className="px-4 text-[15px] font-semibold">{row.title}</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4">
            {row.shows.map((show) => (
              <Poster key={show.id} show={show} onOpen={() => onOpenShow(show)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DetailView({ show, onPlay }: { show: Show; onPlay: () => void }) {
  const heroImage = show.banner ?? show.poster;
  return (
    <div className="flex flex-col">
      <div
        className="relative h-52 flex items-end p-4 overflow-hidden"
        style={heroImage ? undefined : { background: show.gradient }}
      >
        {heroImage && (
          <>
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: show.banner ? undefined : show.posterPosition }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
          </>
        )}
        <p className="relative text-2xl font-bold drop-shadow">{show.title}</p>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[12px] text-white/60">
          <span style={{ color: "#8fe3a5" }}>{show.match}% match</span>
          <span>{show.year}</span>
          <span className="px-1.5 py-0.5 rounded border border-white/20">
            {show.rating}
          </span>
          <span>{show.duration}</span>
        </div>
        <button
          onClick={onPlay}
          disabled
          className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-white text-black text-sm font-semibold opacity-50 cursor-not-allowed"
        >
          ▶ Play
        </button>
        <p className="text-[13px] text-white/75 leading-relaxed">
          {show.description}
        </p>
      </div>
    </div>
  );
}

function PlayerView({ show, onBack }: { show: Show; onBack: () => void }) {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const done = elapsed >= show.durationSeconds;

  useEffect(() => {
    if (!playing || done) return;
    const id = setInterval(
      () => setElapsed((e) => Math.min(show.durationSeconds, e + 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [playing, done, show.durationSeconds]);

  return (
    <div
      className="absolute inset-0 flex flex-col justify-between p-5"
      style={{ background: show.gradient }}
    >
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full glass flex items-center justify-center text-lg self-start"
      >
        ‹
      </button>

      <div className="flex flex-col items-center gap-3">
        <p className="text-lg font-semibold drop-shadow">{show.title}</p>
        {done ? (
          <button
            onClick={() => {
              setElapsed(0);
              setPlaying(true);
            }}
            disabled
            className="px-5 py-2 rounded-full bg-white text-black text-sm font-semibold opacity-50 cursor-not-allowed"
          >
            ↻ Play Again
          </button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setPlaying((p) => !p)}
            disabled
            className="w-16 h-16 rounded-full bg-white/90 text-black flex items-center justify-center text-2xl opacity-50 cursor-not-allowed"
          >
            {playing ? "❚❚" : "▶"}
          </motion.button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-1 rounded-full bg-white/25 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${(elapsed / show.durationSeconds) * 100}%`,
              background: RED,
            }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-white/70">
          <span>{formatTime(elapsed)}</span>
          <span>{show.duration}</span>
        </div>
      </div>
    </div>
  );
}

export function Netflix({ onClose }: { onClose: () => void }) {
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [playingShow, setPlayingShow] = useState<Show | null>(null);

  if (playingShow) {
    return <PlayerView show={playingShow} onBack={() => setPlayingShow(null)} />;
  }

  return (
    <div className="absolute inset-0">
      <AppShell
        title={selectedShow ? selectedShow.title : "Netflix"}
        transparent
        onBack={() => (selectedShow ? setSelectedShow(null) : onClose())}
      >
        {selectedShow ? (
          <DetailView show={selectedShow} onPlay={() => setPlayingShow(selectedShow)} />
        ) : (
          <HomeView onOpenShow={setSelectedShow} />
        )}
      </AppShell>
    </div>
  );
}
