import { useRef, useState } from "react";
import { AppShell } from "../components/AppShell";
import playlists from "../data/songs";
import type { Playlist, Song } from "../types";

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
        <div
          className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[13px] font-bold"
          style={{ background: "#ff6a3d" }}
        >
          D
        </div>
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
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: song.gradient, filter: "blur(60px)" }}
      />
      <AppShell title={playlistName ?? "Now Playing"} onBack={onBack} transparent>
        <div className="flex flex-col items-center px-6 pt-6 gap-6">
          <img
            src={song.cover}
            alt=""
            className="w-56 h-56 rounded-xl shadow-2xl object-cover"
          />

          <div className="text-center w-full">
            <p className="text-lg font-bold truncate">{song.title}</p>
            <p className="text-sm text-white/60 truncate">{song.artist}</p>
          </div>

          <div className="w-full flex flex-col gap-1">
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: GREEN }}
              aria-label="Seek"
            />
            <div className="flex justify-between text-[11px] text-white/40">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onToggleShuffle}
              className="text-lg"
              style={{ color: shuffle ? GREEN : "rgba(255,255,255,0.5)" }}
              aria-label="Shuffle"
            >
              🔀
            </button>
            <button onClick={onPrev} className="text-2xl text-white/80" aria-label="Previous">
              ⏮
            </button>
            <button
              onClick={onTogglePlay}
              className="w-16 h-16 rounded-full bg-white text-ink text-2xl flex items-center justify-center"
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <button onClick={onNext} className="text-2xl text-white/80" aria-label="Next">
              ⏭
            </button>
            <button
              onClick={onToggleRepeat}
              className="text-lg"
              style={{ color: repeat ? GREEN : "rgba(255,255,255,0.5)" }}
              aria-label="Repeat"
            >
              🔁
            </button>
          </div>
        </div>
      </AppShell>
    </div>
  );
}

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
