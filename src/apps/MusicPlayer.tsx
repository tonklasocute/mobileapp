import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppShell } from "../components/AppShell";
import playlists from "../data/songs";
import type { Playlist, Song } from "../types";
import dada1 from "../assets/pic/dada1.jpg";

const GREEN = "var(--color-spotify-green)";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IcoChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
function IcoEllipsis() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
    </svg>
  );
}
function IcoHeart({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      stroke={filled ? GREEN : "rgba(255,255,255,0.55)"}
      fill={filled ? GREEN : "none"}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function IcoShuffle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
    </svg>
  );
}
function IcoSkipBack() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  );
}
function IcoSkipForward() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}
function IcoPlay() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="black">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function IcoPause() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
      <rect x="6" y="4" width="4" height="16" rx="1.5" />
      <rect x="14" y="4" width="4" height="16" rx="1.5" />
    </svg>
  );
}
function IcoRepeat() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
function IcoSpeaker() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
function IcoShare() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

// ─── Custom Progress Bar ───────────────────────────────────────────────────────

function ProgressBar({ value, max, onChange }: { value: number; max: number; onChange: (v: number) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const pct = max > 0 ? Math.min(1, value / max) : 0;

  function valueAt(clientX: number) {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    return Math.max(0, Math.min(max, ((clientX - rect.left) / rect.width) * max));
  }

  return (
    <div
      ref={ref}
      className="relative h-1 rounded-full cursor-pointer"
      style={{ background: "rgba(255,255,255,0.18)" }}
      onPointerDown={(e) => {
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        onChange(valueAt(e.clientX));
      }}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        onChange(valueAt(e.clientX));
      }}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-none"
        style={{ width: `${pct * 100}%`, background: GREEN }}
      />
      <div
        className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-md"
        style={{ top: "50%", left: `${pct * 100}%`, transform: "translate(-50%, -50%)" }}
      />
    </div>
  );
}

// ─── Home View ────────────────────────────────────────────────────────────────

function HomeView({
  onOpenPlaylist,
  onPlaySong,
}: {
  onOpenPlaylist: (pl: Playlist) => void;
  onPlaySong: (pl: Playlist, song: Song) => void;
}) {
  const rotation = (playlists as Playlist[]).flatMap((pl) =>
    pl.songs.map((song) => ({ pl, song })),
  );

  return (
    <div className="flex flex-col gap-6 pb-4">
      <p className="px-4 pt-3 text-xl font-bold">{greeting()}</p>

      <div className="px-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <img
          src={dada1}
          alt="D"
          className="w-8 h-8 rounded-full shrink-0 object-cover"
        />
        <button
          className="px-4 py-1.5 rounded-full text-[13px] font-semibold shrink-0 text-black"
          style={{ background: GREEN }}
        >
          All
        </button>
        <button className="glass px-4 py-1.5 rounded-full text-[13px] font-semibold shrink-0">
          Music
        </button>
        <button className="glass px-4 py-1.5 rounded-full text-[13px] font-semibold shrink-0">
          Podcasts
        </button>
      </div>

      <div className="px-4 grid grid-cols-2 gap-2">
        {(playlists as Playlist[]).map((pl) => (
          <button
            key={pl.id}
            onClick={() => onOpenPlaylist(pl)}
            className="glass flex items-center gap-2 rounded-md overflow-hidden pr-2"
          >
            <img
              src={pl.songs[0]?.cover}
              alt=""
              className="w-14 h-14 object-cover shrink-0"
            />
            <span className="text-[13px] font-semibold text-left line-clamp-2">
              {pl.name}
            </span>
          </button>
        ))}
      </div>

      <div className="px-4 flex flex-col gap-1">
        <p className="text-lg font-bold mb-1">Your recent rotation</p>
        {rotation.map(({ pl, song }) => (
          <button
            key={song.id}
            onClick={() => onPlaySong(pl, song)}
            className="flex items-center gap-3 py-1.5 text-left"
          >
            <img
              src={song.cover}
              alt=""
              className="w-12 h-12 rounded object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium truncate">{song.title}</p>
              <p className="text-[12px] text-white/50 truncate">
                {song.artist}
              </p>
            </div>
            <span className="text-white/50 text-lg px-1">⋯</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-lg font-bold px-4">Albums featuring songs you like</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4">
          {(playlists as Playlist[]).map((pl) => (
            <button
              key={pl.id}
              onClick={() => onOpenPlaylist(pl)}
              className="w-32 shrink-0 flex flex-col gap-2 text-left"
            >
              <img
                src={pl.songs[0]?.cover}
                alt=""
                className="w-32 h-32 rounded-md object-cover shadow-lg"
              />
              <p className="text-[12px] font-medium truncate">{pl.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Playlist View ────────────────────────────────────────────────────────────

function PlaylistView({
  playlist,
  currentSong,
  playing,
  onPlaySong,
  onTogglePlay,
}: {
  playlist: Playlist;
  currentSong: Song | null;
  playing: boolean;
  onPlaySong: (song: Song) => void;
  onTogglePlay: () => void;
}) {
  const isQueued = playlist.songs.some((s) => s.id === currentSong?.id);

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-2 pb-4 flex flex-col items-center gap-3">
        <div
          className="w-40 h-40 rounded-lg shadow-2xl"
          style={{ background: playlist.gradient }}
        />
        <div className="text-center">
          <p className="text-lg font-bold">{playlist.name}</p>
          <p className="text-[12px] text-white/50">{playlist.mood}</p>
        </div>
        <button
          onClick={() => {
            const first = playlist.songs[0];
            if (!first) return;
            if (isQueued) onTogglePlay();
            else onPlaySong(first);
          }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-black text-lg"
          style={{ background: GREEN }}
        >
          {isQueued && playing ? "❚❚" : "▶"}
        </button>
      </div>
      <div className="px-4 pb-4 flex flex-col gap-1">
        {playlist.songs.map((song) => {
          const active = currentSong?.id === song.id;
          return (
            <button
              key={song.id}
              onClick={() => (active ? onTogglePlay() : onPlaySong(song))}
              className="flex items-center gap-3 text-left rounded-xl p-2"
            >
              <img
                src={song.cover}
                alt=""
                className="w-11 h-11 rounded-lg shrink-0 object-cover"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-[14px] font-medium truncate"
                  style={{ color: active ? GREEN : undefined }}
                >
                  {song.title}
                </p>
                <p className="text-[12px] text-white/50 truncate">
                  {song.artist}
                </p>
              </div>
              {active && (
                <span className="text-[11px]" style={{ color: GREEN }}>
                  {playing ? "❚❚" : "▶"}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mini Player ──────────────────────────────────────────────────────────────

function MiniPlayer({
  song,
  playing,
  onToggle,
  onOpen,
}: {
  song: Song;
  playing: boolean;
  onToggle: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="shrink-0 mx-3 mb-3 glass rounded-xl flex items-center gap-3 p-2">
      <button
        onClick={onOpen}
        className="flex items-center gap-3 flex-1 min-w-0 text-left"
      >
        <img
          src={song.cover}
          alt=""
          className="w-10 h-10 rounded-md shrink-0 object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium truncate">{song.title}</p>
          <p className="text-[11px] text-white/50 truncate">{song.artist}</p>
        </div>
      </button>
      <button
        onClick={onToggle}
        className="w-8 h-8 flex items-center justify-center text-lg shrink-0"
      >
        {playing ? "❚❚" : "▶"}
      </button>
    </div>
  );
}

// ─── Now Playing View (redesigned) ────────────────────────────────────────────

function NowPlayingView({
  song,
  playlistName,
  playing,
  currentTime,
  duration,
  shuffle,
  repeat,
  onBack,
  onTogglePlay,
  onSeek,
  onPrev,
  onNext,
  onToggleShuffle,
  onToggleRepeat,
}: {
  song: Song;
  playlistName?: string;
  playing: boolean;
  currentTime: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  onBack: () => void;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
}) {
  const [liked, setLiked] = useState(false);
  const glowColor = song.gradient.match(/#[a-f0-9]{6}/i)?.[0] ?? "#c3b6ff";

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden">
      {/* Dynamic blurred gradient background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={song.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: song.gradient,
            filter: "blur(90px)",
            transform: "scale(1.5)",
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative flex flex-col h-full px-6 pt-12 pb-7 gap-5">

        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center -ml-1 text-white"
          >
            <IcoChevronDown />
          </motion.button>

          <div className="text-center flex-1 px-3">
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/45 leading-none">
              Playing From Playlist
            </p>
            <p className="text-[13px] font-semibold mt-1">
              {playlistName ?? "Now Playing"}
            </p>
          </div>

          <button className="w-8 h-8 flex items-center justify-center -mr-1 text-white/60">
            <IcoEllipsis />
          </button>
        </div>

        {/* Album Art */}
        <motion.div
          className="w-full aspect-square rounded-2xl overflow-hidden shrink-0"
          animate={{ scale: playing ? 1 : 0.84 }}
          transition={{ type: "spring", stiffness: 75, damping: 18 }}
          style={{
            boxShadow: `0 24px 70px rgba(0,0,0,0.6), 0 0 50px ${glowColor}44`,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={song.id}
              src={song.cover}
              alt=""
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            />
          </AnimatePresence>
        </motion.div>

        {/* Song Info + Heart */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex-1 min-w-0">
            <p className="text-[18px] font-bold truncate leading-snug">{song.title}</p>
            <p className="text-[13px] text-white/55 mt-0.5 truncate">{song.artist}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.78 }}
            onClick={() => setLiked((v) => !v)}
            className="w-10 h-10 flex items-center justify-center shrink-0"
          >
            <IcoHeart filled={liked} />
          </motion.button>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2 shrink-0">
          <ProgressBar value={currentTime} max={duration} onChange={onSeek} />
          <div className="flex justify-between text-[11px] text-white/38">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between shrink-0 px-1">
          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={onToggleShuffle}
            className="w-10 h-10 flex items-center justify-center"
            style={{ color: shuffle ? GREEN : "rgba(255,255,255,0.42)" }}
          >
            <IcoShuffle />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={onPrev}
            className="w-10 h-10 flex items-center justify-center text-white"
          >
            <IcoSkipBack />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.91 }}
            onClick={onTogglePlay}
            className="w-[62px] h-[62px] rounded-full bg-white flex items-center justify-center"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.45)" }}
          >
            {playing ? <IcoPause /> : <IcoPlay />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={onNext}
            className="w-10 h-10 flex items-center justify-center text-white"
          >
            <IcoSkipForward />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.82 }}
            onClick={onToggleRepeat}
            className="w-10 h-10 flex items-center justify-center"
            style={{ color: repeat ? GREEN : "rgba(255,255,255,0.42)" }}
          >
            <IcoRepeat />
          </motion.button>
        </div>

        {/* Footer: device output + share */}
        <div className="flex items-center justify-between px-1 mt-auto shrink-0">
          <button className="w-9 h-9 flex items-center justify-center text-white/32">
            <IcoSpeaker />
          </button>
          <button className="w-9 h-9 flex items-center justify-center text-white/32">
            <IcoShare />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Root Component ───────────────────────────────────────────────────────────

export function MusicPlayer({ onClose }: { onClose: () => void }) {
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [queuePlaylist, setQueuePlaylist] = useState<Playlist | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  function playSong(playlist: Playlist, song: Song) {
    setQueuePlaylist(playlist);
    setCurrentSong(song);
    const audio = audioRef.current;
    if (audio) {
      audio.src = song.src;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }

  function advance(direction: 1 | -1) {
    if (!queuePlaylist || !currentSong) return;
    const songs = queuePlaylist.songs;
    if (direction === 1 && shuffle) {
      const others = songs.filter((s) => s.id !== currentSong.id);
      const pick = others[Math.floor(Math.random() * others.length)];
      if (pick) playSong(queuePlaylist, pick);
      return;
    }
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    const target = songs[idx + direction];
    if (target) playSong(queuePlaylist, target);
  }

  function handlePrev() {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    advance(-1);
  }

  function handleEnded() {
    const audio = audioRef.current;
    if (repeat && audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      return;
    }
    advance(1);
  }

  function seek(time: number) {
    const audio = audioRef.current;
    if (audio) audio.currentTime = time;
    setCurrentTime(time);
  }

  return (
    <div className="absolute inset-0">
      <audio
        ref={audioRef}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
        className="hidden"
      />

      {nowPlayingOpen && currentSong ? (
        <NowPlayingView
          song={currentSong}
          playlistName={queuePlaylist?.name}
          playing={playing}
          currentTime={currentTime}
          duration={duration}
          shuffle={shuffle}
          repeat={repeat}
          onBack={() => setNowPlayingOpen(false)}
          onTogglePlay={togglePlay}
          onSeek={seek}
          onPrev={handlePrev}
          onNext={() => advance(1)}
          onToggleShuffle={() => setShuffle((v) => !v)}
          onToggleRepeat={() => setRepeat((v) => !v)}
        />
      ) : (
        <AppShell
          title={activePlaylist ? activePlaylist.name : "Music"}
          onBack={() => (activePlaylist ? setActivePlaylist(null) : onClose())}
          bottomBar={
            currentSong && (
              <MiniPlayer
                song={currentSong}
                playing={playing}
                onToggle={togglePlay}
                onOpen={() => setNowPlayingOpen(true)}
              />
            )
          }
        >
          {!activePlaylist ? (
            <HomeView onOpenPlaylist={setActivePlaylist} onPlaySong={playSong} />
          ) : (
            <PlaylistView
              playlist={activePlaylist}
              currentSong={currentSong}
              playing={playing}
              onPlaySong={(song) => playSong(activePlaylist, song)}
              onTogglePlay={togglePlay}
            />
          )}
        </AppShell>
      )}
    </div>
  );
}
