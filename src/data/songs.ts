import trackUrls from "./musicFiles";
import bannerUrls from "./bannerFiles";
import type { Playlist, Song } from "../types";

function track(
  id: string,
  file: string,
  title: string,
  artist: string,
  gradient: string,
  banner: string,
): Song {
  const src = trackUrls[file];
  if (!src) throw new Error(`Missing music file: ${file}`);
  const cover = bannerUrls[banner];
  if (!cover) throw new Error(`Missing banner image: ${banner}`);
  return { id, title, artist, gradient, cover, src };
}

const playlists: Playlist[] = [
  {
    id: "pl-for-dada",
    name: "For Dada",
    mood: "the whole story, softly",
    gradient: "linear-gradient(135deg,#c3b6ff,#ffc2dd)",
    songs: [
      track(
        "s1",
        "เมื่อถูกค้นพบ (Finally She Found.) - FREEHANDAnother Version.mp3",
        "เมื่อถูกค้นพบ (Finally She Found)",
        "FREEHAND",
        "linear-gradient(135deg,#c3b6ff,#b3d9ff)",
        "เมื่อถูกค้นพบ.jpeg",
      ),
      track(
        "s2",
        "PUN - ขอแค่นี้ (Forever n ever)  Official Lyric Video.mp3",
        "ขอแค่นี้ (Forever n Ever)",
        "PUN",
        "linear-gradient(135deg,#ffc2dd,#c3b6ff)",
        "ขอแค่นี้.jpeg",
      ),
    ],
  },
  {
    id: "pl-late-night",
    name: "Late Night",
    mood: "for the hours after midnight",
    gradient: "linear-gradient(135deg,#2e2640,#b3d9ff)",
    songs: [
      track(
        "s3",
        "LANY - Thru These Tears (lyric video).mp3",
        "Thru These Tears",
        "LANY",
        "linear-gradient(135deg,#2e2640,#c3b6ff)",
        "thur these tears.jpeg",
      ),
      track(
        "s4",
        "Taylor Swift - Opalite (Lyric Video).mp3",
        "Opalite",
        "Taylor Swift",
        "linear-gradient(135deg,#b3d9ff,#2e2640)",
        "opalite.jpeg",
      ),
    ],
  },
  {
    id: "pl-rain-mood",
    name: "Rain Mood",
    mood: "grey skies, soft heart",
    gradient: "linear-gradient(135deg,#b3d9ff,#c3b6ff)",
    songs: [
      track(
        "s5",
        "Taylor Swift - White Horse (Taylor's Version) (Lyric Video).mp3",
        "White Horse (Taylor's Version)",
        "Taylor Swift",
        "linear-gradient(135deg,#b3d9ff,#ffd4c2)",
        "white horse.jpeg",
      ),
      track(
        "s6",
        "ย้าย่ายะ - อูโน่ หลาวทอง [Official MV].mp3",
        "อูโน่ หลาวทอง",
        "ย้าย่ายะ",
        "linear-gradient(135deg,#c3b6ff,#b3d9ff)",
        "ย้าย่ายะ.jpeg",
      ),
    ],
  },
  {
    id: "pl-happy-days",
    name: "Happy Days",
    mood: "for the good ones",
    gradient: "linear-gradient(135deg,#ffd4c2,#ffc2dd)",
    songs: [
      track(
        "s7",
        "LANY - 'Cause You Have To (Official Lyric Video).mp3",
        "'Cause You Have To",
        "LANY",
        "linear-gradient(135deg,#ffd4c2,#ffc2dd)",
        "cause u have to.jpeg",
      ),
    ],
  },
];

export default playlists;
