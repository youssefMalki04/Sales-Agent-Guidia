import {
  Bot,
  CircleHelp,
  Headphones,
  Heart,
  Info,
  Lightbulb,
  Mail,
  MessageCircle,
  Phone,
  Smile,
  Sparkles,
  Star,
  User,
} from "lucide-react";

export type Tab = "brand" | "features" | "media" | "embed";
export type Persona = "female" | "male" | "none";
export type Position =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "right-rail"
  | "left-rail";
export type Shape = "rounded" | "square";
export type IconName =
  | "sparkles"
  | "bot"
  | "message"
  | "mail"
  | "headphones"
  | "info"
  | "help"
  | "smile"
  | "user"
  | "heart"
  | "phone"
  | "light"
  | "star";

export type Settings = {
  title: string;
  persona: Persona;
  voice: string;
  welcome: string;
  color: string;
  position: Position;
  shape: Shape;
  icon: IconName;
  deployment: "embedded" | "marketing";
  display: "closed" | "open";
  conversationStart: "visitor" | "arrival";
  language: string;
  tone: string;
  humor: string;
  address: string;
  personaDescription: string;
  signaturePhrases: string[];
  forbiddenPhrases: string[];
  token: string;
  tokenCreatedAt: string;
  allowedDomain: string;
};

export type Asset = {
  id: string;
  kind: "pdf" | "video" | "image" | "link";
  name: string;
};

export const STORAGE_KEY = "guidia-branding-v1";
export const AGENTS_STORAGE_KEY = "guidia-agent-profiles-v1";
export const makeToken = () =>
  `gda_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
export const cx = (...v: Array<string | false | null | undefined>) =>
  v.filter(Boolean).join(" ");

export const initial: Settings = {
  title: "Super assistant",
  persona: "female",
  voice: "kore",
  welcome: "Bonjour, c'est moi. Comment ça va ?",
  color: "#ac03fc",
  position: "right-rail",
  shape: "rounded",
  icon: "star",
  deployment: "marketing",
  display: "closed",
  conversationStart: "visitor",
  language: "English",
  tone: "warm",
  humor: "light",
  address: "automatic",
  personaDescription: "",
  signaturePhrases: [],
  forbiddenPhrases: [],
  token: makeToken(),
  tokenCreatedAt: new Date().toISOString(),
  allowedDomain: "",
};

export const iconOptions = [
  ["sparkles", Sparkles],
  ["bot", Bot],
  ["message", MessageCircle],
  ["mail", Mail],
  ["headphones", Headphones],
  ["info", Info],
  ["help", CircleHelp],
  ["smile", Smile],
  ["user", User],
  ["heart", Heart],
  ["phone", Phone],
  ["light", Lightbulb],
  ["star", Star],
] as const;

export const voices = [
  ["kore", "Kore (feminine, clear)"],
  ["puck", "Puck (masculine, dynamic)"],
  ["charon", "Charon (masculine, deep)"],
  ["fenrir", "Fenrir (masculine, calm)"],
  ["aoede", "Aoede (feminine, warm)"],
  ["leda", "Leda (feminine, soft)"],
  ["orus", "Orus (masculine, steady)"],
  ["zephyr", "Zephyr (masculine, light)"],
];
