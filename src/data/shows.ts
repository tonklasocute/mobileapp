import type { ShowRow } from "../types";
import strangerThings from "../assets/netfilx/Stranger Things.jpg";
import bridgerton from "../assets/netfilx/Bridgerton.webp";
import squidGame from "../assets/netfilx/Squid Game.avif";
import wednesday from "../assets/netfilx/Wednesday.jpg";
import theCrown from "../assets/netfilx/The Crown.webp";
import toAllTheBoys from "../assets/netfilx/To All the Boys I've Loved Before.jpg";
import emilyInParis from "../assets/netfilx/Emily in Paris.jpg";
import movieNight from "../assets/netfilx/Movie Night, For Us.webp";

const rows: ShowRow[] = [
  {
    id: "continue-watching",
    title: "Continue Watching",
    shows: [
      {
        id: "stranger-things",
        title: "Stranger Things",
        gradient: "linear-gradient(135deg,#2e2640,#c3b6ff)",
        poster: strangerThings,
        genre: "Sci-Fi",
        match: 97,
        year: 2024,
        rating: "16+",
        duration: "51m",
        durationSeconds: 40,
        description:
          "A small town, a secret lab, and kids who won't stop finding trouble in the Upside Down. What started as one missing boy has spiraled into interdimensional monsters, government cover-ups, and a group of friends who keep saving the world on bikes. Every season raises the stakes and somehow also the walkie-talkie count.",
      },
      {
        id: "bridgerton",
        title: "Bridgerton",
        gradient: "linear-gradient(135deg,#ffc2dd,#ffd4c2)",
        poster: bridgerton,
        genre: "Romance",
        match: 94,
        year: 2024,
        rating: "16+",
        duration: "58m",
        durationSeconds: 40,
        description:
          "Regency-era romance, string-quartet pop covers, and entirely too much scheming. The Bridgerton siblings take turns falling in love while their mother and an anonymous gossip columnist do their best to ruin (or arrange) it. Expect ballrooms, backhanded compliments, and at least one soaking-wet declaration of love.",
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
        poster: squidGame,
        genre: "Thriller",
        match: 91,
        year: 2024,
        rating: "18+",
        duration: "55m",
        durationSeconds: 40,
        description:
          "456 players, one deadly game, and a prize that isn't worth what it costs. Deep in debt and out of options, strangers accept an invitation to compete in twisted versions of childhood games where losing means elimination — permanently. Alliances form and break fast, and nobody who says \"just one more round\" means it.",
      },
      {
        id: "wednesday",
        title: "Wednesday",
        gradient: "linear-gradient(135deg,#2e2640,#b3d9ff)",
        poster: wednesday,
        genre: "Comedy",
        match: 96,
        year: 2023,
        rating: "13+",
        duration: "46m",
        durationSeconds: 40,
        description:
          "Deadpan sleuthing at Nevermore Academy, one raised eyebrow at a time. Wednesday Addams gets exiled to a school for outcasts and immediately starts solving a murder mystery nobody asked her to solve, all while barely tolerating a roommate who is far too cheerful for her taste. Monsters, mean girls, and a cello solo are all part of the curriculum.",
      },
      {
        id: "the-crown",
        title: "The Crown",
        gradient: "linear-gradient(135deg,#c3b6ff,#ffd4c2)",
        poster: theCrown,
        genre: "Drama",
        match: 89,
        year: 2023,
        rating: "16+",
        duration: "1h 2m",
        durationSeconds: 40,
        description:
          "Crowns are heavy. This is basically a whole show about that. Decades of British royal history play out through quiet corridors and quieter arguments, as duty keeps winning fights against personal happiness. Lavish sets, career-best performances, and just enough real history to make you want to look things up afterward.",
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
        poster: toAllTheBoys,
        genre: "Romance",
        match: 98,
        year: 2018,
        rating: "13+",
        duration: "1h 40m",
        durationSeconds: 40,
        description:
          "Five secret love letters get mailed by accident. Chaos, obviously, follows. Lara Jean never meant for anyone to read the letters she wrote to every boy she ever loved, so obviously they all get delivered on the same day. A fake relationship to cover the fallout somehow turns real, in the most wholesome way physically possible.",
      },
      {
        id: "emily-in-paris",
        title: "Emily in Paris",
        gradient: "linear-gradient(135deg,#b3d9ff,#ffc2dd)",
        poster: emilyInParis,
        genre: "Comedy",
        match: 90,
        year: 2024,
        rating: "13+",
        duration: "30m",
        durationSeconds: 40,
        description:
          "One American, one impossible amount of croissants, and zero chill in group chats. Emily moves to Paris for a marketing job she's wildly underqualified for by local standards, and spends every episode charming, annoying, or accidentally outshining her new coworkers. Somewhere between the outfits and the love triangles, she starts to actually fit in.",
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
        poster: movieNight,
        genre: "Cozy",
        match: 100,
        year: 2026,
        rating: "Us",
        duration: "always",
        durationSeconds: 40,
        description:
          "Blanket, snacks, phone on silent. Press play whenever you're ready. No script, no runtime, just the two of us picking something to half-watch while we actually talk. A 100% match rating because it's the one show on here that's ours, not the algorithm's.",
      },
    ],
  },
];

export default rows;
