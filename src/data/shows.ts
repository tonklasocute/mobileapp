import type { ShowRow } from "../types";

const rows: ShowRow[] = [
  {
    id: "continue-watching",
    title: "Continue Watching",
    shows: [
      {
        id: "stranger-things",
        title: "Stranger Things",
        gradient: "linear-gradient(135deg,#2e2640,#c3b6ff)",
        genre: "Sci-Fi",
        match: 97,
        year: 2024,
        rating: "16+",
        duration: "51m",
        durationSeconds: 40,
        description:
          "A small town, a secret lab, and kids who won't stop finding trouble in the Upside Down.",
      },
      {
        id: "bridgerton",
        title: "Bridgerton",
        gradient: "linear-gradient(135deg,#ffc2dd,#ffd4c2)",
        genre: "Romance",
        match: 94,
        year: 2024,
        rating: "16+",
        duration: "58m",
        durationSeconds: 40,
        description:
          "Regency-era romance, string-quartet pop covers, and entirely too much scheming.",
      },
    ],
  },
  {
    id: "trending",
    title: "Trending Now",
    shows: [
      {
        id: "squid-game",
        title: "Squid Game",
        gradient: "linear-gradient(135deg,#ff8aa8,#2e2640)",
        genre: "Thriller",
        match: 91,
        year: 2024,
        rating: "18+",
        duration: "55m",
        durationSeconds: 40,
        description:
          "456 players, one deadly game, and a prize that isn't worth what it costs.",
      },
      {
        id: "wednesday",
        title: "Wednesday",
        gradient: "linear-gradient(135deg,#2e2640,#b3d9ff)",
        genre: "Comedy",
        match: 96,
        year: 2023,
        rating: "13+",
        duration: "46m",
        durationSeconds: 40,
        description:
          "Deadpan sleuthing at Nevermore Academy, one raised eyebrow at a time.",
      },
      {
        id: "the-crown",
        title: "The Crown",
        gradient: "linear-gradient(135deg,#c3b6ff,#ffd4c2)",
        genre: "Drama",
        match: 89,
        year: 2023,
        rating: "16+",
        duration: "1h 2m",
        durationSeconds: 40,
        description: "Crowns are heavy. This is basically a whole show about that.",
      },
    ],
  },
  {
    id: "rom-coms",
    title: "Rom-Coms For Movie Night",
    shows: [
      {
        id: "to-all-the-boys",
        title: "To All the Boys I've Loved Before",
        gradient: "linear-gradient(135deg,#ffc2dd,#c3b6ff)",
        genre: "Romance",
        match: 98,
        year: 2018,
        rating: "13+",
        duration: "1h 40m",
        durationSeconds: 40,
        description:
          "Five secret love letters get mailed by accident. Chaos, obviously, follows.",
      },
      {
        id: "emily-in-paris",
        title: "Emily in Paris",
        gradient: "linear-gradient(135deg,#b3d9ff,#ffc2dd)",
        genre: "Comedy",
        match: 90,
        year: 2024,
        rating: "13+",
        duration: "30m",
        durationSeconds: 40,
        description:
          "One American, one impossible amount of croissants, and zero chill in group chats.",
      },
    ],
  },
  {
    id: "dadas-list",
    title: "Dada's List",
    shows: [
      {
        id: "our-movie-night",
        title: "Movie Night, For Us",
        gradient: "linear-gradient(135deg,#c3b6ff,#ffc2dd)",
        genre: "Cozy",
        match: 100,
        year: 2026,
        rating: "Us",
        duration: "always",
        durationSeconds: 40,
        description:
          "Blanket, snacks, phone on silent. Press play whenever you're ready.",
      },
    ],
  },
];

export default rows;
