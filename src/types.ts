export type AppId =
  | "memoryIg"
  | "cmbOrigin"
  | "musicPlayer"
  | "dentalGame"
  | "softPosts"
  | "comfortAi";

export interface AppMeta {
  id: AppId;
  name: string;
  emoji: string;
  gradient: string;
  icon?: string;
  iconFit?: "cover" | "contain";
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
  from: "dada" | "them";
  text: string;
  time: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  gradient: string;
  lyrics: string[];
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
}

export type Mood = "great" | "okay" | "sad" | "crying";

export interface ComfortEntry {
  mood: Mood;
  responses: string[];
  affirmation: string;
  songSuggestion: string;
}
