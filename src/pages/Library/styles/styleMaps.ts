import { StyleSlug } from './styleGroups';

export const styleClasses = {
  minimal: {
    card: "bg-white/2 border-white/10",
    accent: "text-white",
    deco: "",
    button: "bg-white/10 hover:bg-white/20 text-white border-white/20",
    text: "text-white/90",
    heading: "text-white",
  },
  luxury: {
    card: "bg-white/5 border-white/15 shadow-[0_6px_24px_rgba(0,0,0,.25)]",
    accent: "text-yellow-300",
    deco: "shadow-[0_6px_24px_rgba(0,0,0,.25)]",
    button: "bg-yellow-300/20 hover:bg-yellow-300/30 text-yellow-300 border-yellow-300/30",
    text: "text-white/90",
    heading: "text-white",
  },
  playful: {
    card: "bg-white/5 border-white/10 rounded-2xl",
    accent: "text-pink-300",
    deco: "rounded-2xl",
    button: "bg-pink-300/20 hover:bg-pink-300/30 text-pink-300 border-pink-300/30 rounded-2xl",
    text: "text-white/90",
    heading: "text-white",
  },
  corporate: {
    card: "bg-white/3 border-white/12",
    accent: "text-blue-300",
    deco: "",
    button: "bg-blue-300/20 hover:bg-blue-300/30 text-blue-300 border-blue-300/30",
    text: "text-white/90",
    heading: "text-white",
  },
  brutalist: {
    card: "bg-black/60 border-white/20 border-2 rounded-none",
    accent: "text-white",
    deco: "border-2 rounded-none",
    button: "bg-white hover:bg-white/90 text-black border-white border-2 rounded-none",
    text: "text-white",
    heading: "text-white font-bold",
  },
  glass: {
    card: "backdrop-blur-md bg-white/6 border-white/15",
    accent: "text-white",
    deco: "",
    button: "backdrop-blur-md bg-white/10 hover:bg-white/20 text-white border-white/20",
    text: "text-white/90",
    heading: "text-white",
  },
  gradient: {
    card: "bg-gradient-to-br from-violet-600/20 to-cyan-500/10 border-white/10",
    accent: "text-white",
    deco: "",
    button: "bg-gradient-to-r from-violet-600/30 to-cyan-500/30 hover:from-violet-600/40 hover:to-cyan-500/40 text-white border-white/20",
    text: "text-white/90",
    heading: "text-white",
  },
  mono: {
    card: "bg-white/4 border-white/12",
    accent: "text-white",
    deco: "",
    button: "bg-white/10 hover:bg-white/20 text-white border-white/20",
    text: "text-white/90",
    heading: "text-white",
  },
  editorial: {
    card: "bg-white/3 border-white/10",
    accent: "italic",
    deco: "",
    button: "bg-white/10 hover:bg-white/20 text-white border-white/20 italic",
    text: "text-white/90 italic",
    heading: "text-white italic",
  },
  neumorphic: {
    card: "bg-white/8 border-white/8 shadow-[inset_0_1px_2px_rgba(255,255,255,.15),0_8px_24px_rgba(0,0,0,.25)] rounded-2xl",
    accent: "text-white",
    deco: "shadow-[inset_0_1px_2px_rgba(255,255,255,.15),0_8px_24px_rgba(0,0,0,.25)] rounded-2xl",
    button: "bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,.15),0_8px_24px_rgba(0,0,0,.25)] rounded-2xl",
    text: "text-white/90",
    heading: "text-white",
  },
} as const;

export const getStyleClasses = (style: StyleSlug) => {
  return styleClasses[style] || styleClasses.minimal;
};

export type StyleClasses = typeof styleClasses[StyleSlug];
