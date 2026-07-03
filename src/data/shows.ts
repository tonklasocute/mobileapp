import type { ShowRow } from "../types";
import strangerThings from "../assets/netfilx/Stranger Things.jpg";
import strangerThingsBanner from "../assets/netfilx/ Stranger Things banner.jpg";
import bridgerton from "../assets/netfilx/Bridgerton.webp";
import bridgertonBanner from "../assets/netfilx/ Bridgerton banner.jpg";
import squidGame from "../assets/netfilx/Squid Game.avif";
import squidGameBanner from "../assets/netfilx/ Squid Game banner.webp";
import wednesday from "../assets/netfilx/Wednesday.jpg";
import wednesdayBanner from "../assets/netfilx/ Wednesday banner.jpeg";
import theCrown from "../assets/netfilx/The Crown.webp";
import theCrownBanner from "../assets/netfilx/ The Crown banner.jpg";
import toAllTheBoys from "../assets/netfilx/To All the Boys I've Loved Before.jpg";
import toAllTheBoysBanner from "../assets/netfilx/To All the Boys I've Loved Before banner.avif";
import emilyInParis from "../assets/netfilx/Emily in Paris.jpg";
import emilyInParisBanner from "../assets/netfilx/emily poster.webp";
import frozen from "../assets/netfilx/Frozen.webp";
import frozenBanner from "../assets/netfilx/Frozen banner.jpg";
import encanto from "../assets/netfilx/Encanto.webp";
import encantoBanner from "../assets/netfilx/Encanto banner.webp";
import moana from "../assets/netfilx/Moana.jpg";
import moanaBanner from "../assets/netfilx/moana banner.jpg";

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
        banner: strangerThingsBanner,
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
        banner: bridgertonBanner,
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
        banner: squidGameBanner,
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
        banner: wednesdayBanner,
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
        banner: theCrownBanner,
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
        banner: toAllTheBoysBanner,
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
        banner: emilyInParisBanner,
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
        id: "frozen",
        title: "Frozen",
        gradient: "linear-gradient(135deg,#b3d9ff,#e8f4ff)",
        poster: frozen,
        banner: frozenBanner,
        genre: "Animation",
        match: 95,
        year: 2013,
        rating: "G",
        duration: "1h 42m",
        durationSeconds: 40,
        description:
          "Two royal sisters, one accidental eternal winter, and a snowman who just wants a hug. Elsa runs from a power she can't control while Anna treks across the mountains to bring her home, picking up a reindeer and an overly optimistic ice harvester along the way.",
      },
      {
        id: "encanto",
        title: "Encanto",
        gradient: "linear-gradient(135deg,#ffd4c2,#ffc2dd)",
        poster: encanto,
        banner: encantoBanner,
        genre: "Animation",
        match: 97,
        year: 2021,
        rating: "PG",
        duration: "1h 42m",
        durationSeconds: 40,
        description:
          "Every Madrigal gets a magical gift except Mirabel, which turns out to be the least interesting thing about her. When the family's enchanted house starts cracking, she's the only one who notices — and the only one willing to ask why.",
      },
      {
        id: "moana",
        title: "Moana",
        gradient: "linear-gradient(135deg,#7cc4f5,#c3b6ff)",
        poster: moana,
        posterPosition: "center 20%",
        banner: moanaBanner,
        genre: "Animation",
        match: 96,
        year: 2016,
        rating: "PG",
        duration: "1h 47m",
        durationSeconds: 40,
        description:
          "A chief's daughter sails past the reef to save her island, drags a washed-up demigod along for the ride, and gets a lot of unsolicited singing along the way. Turns out the ocean picked her for a reason.",
      },
    ],
  },
];

export default rows;
