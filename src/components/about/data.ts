import type { TrustedCard } from "@/components/shared/CardImageInfoSection";
import type { CategoryTileData } from "@/components/shared/DualImageColumnSection";
import type { ArticleRow } from "@/components/shared/ArticleListSection";

export const PRINCIPLES: TrustedCard[] = [
  {
    img: "/about/philosophy-room.webp",
    title: "Every Room Has a Point of View",
    description:
      "We don\u2019t open venues to fill a gap in the market. Each one begins with a clear idea, whether that\u2019s a cuisine, a sound or a mood, and commits to it completely, from the playlist to the glassware.",
  },
  {
    img: "/about/philosophy-place.webp",
    title: "Every Detail Earns Its Place",
    description:
      "Every drink on the menu, every track in the set, every seat on the floor has to answer one question: does it earn its place in the room? If it doesn\u2019t, it doesn\u2019t stay.",
  },
  {
    img: "/about/philosophy-people.webp",
    title: "It\u2019s Always About the People",
    description:
      "That means our regulars, our bartenders, our chefs, and our DJs. The best nights happen when everyone on both sides of the bar feels they belong. That\u2019s what we build for first.",
  },
];

export const VISION_MISSION: CategoryTileData[] = [
  {
    src: "/about/vision-swillfam.png",
    label: "Vision",
    labelAlign: "top-left",
    description:
      "To become a leading lifestyle and hospitality group by creating experiences that inspire culture, foster connection, and redefine modern hospitality.",
  },
  {
    src: "/about/mission-swillfam.png",
    label: "Mission",
    labelAlign: "bottom-right",
    description:
      "To create memorable hospitality experiences that bring people together through creativity, culture, and exceptional service, while building destinations that inspire connection and community.",
  },
];

export const PRESS_ITEMS: ArticleRow[] = [
  {
    img: "/about/malachi-clark.png",
    date: "22/06/2026",
    title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
  },
  {
    img: "/about/personalities.png",
    date: "22/06/2026",
    title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
  },
  {
    img: "/about/career-swilfam.png",
    date: "22/06/2026",
    title: "Lorem Ipsum Dolor Sit Amet, Consectetur Eiusmod Magna",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.",
  },
];

export const STAND_WORDS_TOP = ["Experience", "Innovation"];
export const STAND_WORDS_BOTTOM = ["Quality", "Growth"];
