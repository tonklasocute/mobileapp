import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "../components/AppShell";
import { GlassCard } from "../components/GlassCard";
import playlists from "../data/songs.json";
import type { Playlist, Song } from "../types";

const SONG_SECONDS = 20;

function NowPlaying({ song, onBack }: { song: Song; onBack: () => void }) {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => (p >= 1 ? 0 : p + 1 / (SONG_SECONDS * 5)));
    }, 200);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: song.gradient, filter: "blur(60px)" }}
      />
      <AppShell title="Now Playing" onBack={onBack} transparent>
        <div className="flex flex-col items-center px-8 pt-6 gap-6">
          <motion.div
            className="w-56 h-56 rounded-full shadow-2xl flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #2a2440 0%, #0d0b18 55%, #05040a 100%)",
            }}
            animate={{ rotate: playing ? 360 : 0 }}
            transition={
              playing
                ? { repeat: Infinity, duration: 6, ease: "linear" }
                : { duration: 0.3 }
            }
          >
            <div
              className="w-20 h-20 rounded-full"
              style={{ background: song.gradient }}
            />
          </motion.div>

          <div className="text-center">
            <p className="text-lg font-semibold">{song.title}</p>
            <p className="text-sm text-white/60">{song.artist}</p>
          </div>

          <div className="w-full">
            <div className="h-1 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button className="text-2xl text-white/50">⏮</button>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="w-16 h-16 rounded-full bg-white text-ink text-2xl flex items-center justify-center"
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <button className="text-2xl text-white/50">⏭</button>
          </div>

          <button
            onClick={() => setShowLyrics((v) => !v)}
            className="text-xs text-white/60 underline underline-offset-2"
          >
            {showLyrics ? "hide lyrics" : "show lyrics"}
          </button>

          {showLyrics && (
            <GlassCard className="w-full p-4 flex flex-col gap-1.5">
              {song.lyrics.map((line, i) => (
                <p
                  key={i}
                  className={`text-sm ${i === Math.floor(progress * song.lyrics.length) ? "text-white" : "text-white/40"}`}
                >
                  {line}
                </p>
              ))}
            </GlassCard>
          )}
        </div>
      </AppShell>
    </div>
  );
}

export function MusicPlayer({ onClose }: { onClose: () => void }) {
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [activeSong, setActiveSong] = useState<Song | null>(null);

  if (activeSong) {
    return <NowPlaying song={activeSong} onBack={() => setActiveSong(null)} />;
  }

  return (
    <div className="absolute inset-0">
      <AppShell
        title={activePlaylist ? activePlaylist.name : "Music"}
        onBack={() => (activePlaylist ? setActivePlaylist(null) : onClose())}
      >
        {!activePlaylist ? (
          <div className="px-4 py-4 flex flex-col gap-3">
            {(playlists as Playlist[]).map((pl) => (
              <button
                key={pl.id}
                onClick={() => setActivePlaylist(pl)}
                className="flex items-center gap-3 text-left"
              >
                <div
                  className="w-16 h-16 rounded-xl shrink-0"
                  style={{ background: pl.gradient }}
                />
                <div>
                  <p className="font-semibold text-[15px]">{pl.name}</p>
                  <p className="text-[12px] text-white/50">{pl.mood}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="px-4 py-4 flex flex-col gap-2">
            {activePlaylist.songs.map((song) => (
              <button
                key={song.id}
                onClick={() => setActiveSong(song)}
                className="flex items-center gap-3 text-left glass rounded-xl p-2.5"
              >
                <div
                  className="w-11 h-11 rounded-lg shrink-0"
                  style={{ background: song.gradient }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium truncate">{song.title}</p>
                  <p className="text-[12px] text-white/50 truncate">{song.artist}</p>
                </div>
                <span className="text-[11px] text-white/40">{song.duration}</span>
              </button>
            ))}
          </div>
        )}
      </AppShell>
    </div>
  );
}
