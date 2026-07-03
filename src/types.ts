export type AppId =
  | "memoryIg"
  | "cmbOrigin"
  | "musicPlayer"
  | "dentalGame"
  | "softPosts"
  | "netflix";

export interface AppMeta {
  id: AppId;
  name: string;
  emoji: string;
  gradient: string;
  icon?: string;
  iconFit?: "cover" | "contain";
  iconBg?: string;
}

export interface Memory {
  id: string;
  image: string;
  caption: string;
  location: string;
  likes: number;
  timeAgo: string;
}

export interface Story {
  id: string;
  label: string;
  gradient: string;
  viewed: boolean;
}

export interface ChatMessage {
  id: string;
  from: "dada" | "T";
  text: string;
  time: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  gradient: string;
  cover: string;
  src: string;
}

export interface Playlist {
  id: string;
  name: string;
  mood: string;
  gradient: string;
  songs: Song[];
}

export interface Post {
  id: string;
  author: string;
  handle: string;
  text: string;
  timeAgo: string;
  likes: number;
  reposts: number;
  verified?: boolean;
  avatarGradient?: string;
  replies?: number;
  views?: number;
  quote?: string[];
}

export interface Show {
  id: string;
  title: string;
  gradient: string;
  poster?: string;
  posterPosition?: string;
  banner?: string;
  genre: string;
  match: number;
  year: number;
  rating: string;
  duration: string;
  durationSeconds: number;
  description: string;
}

export interface ShowRow {
  id: string;
  title: string;
  shows: Show[];
}
