export const STYLE_GROUPS = [
  { name: "Minimal", slug: "minimal" },
  { name: "Luxury", slug: "luxury" },
  { name: "Playful", slug: "playful" },
  { name: "Corporate", slug: "corporate" },
  { name: "Brutalist", slug: "brutalist" },
  { name: "Glass", slug: "glass" },
  { name: "Gradient", slug: "gradient" },
  { name: "Monochrome", slug: "mono" },
  { name: "Editorial", slug: "editorial" },
  { name: "Neumorphic", slug: "neumorphic" },
] as const;

export type StyleSlug = typeof STYLE_GROUPS[number]["slug"];
export type StyleName = typeof STYLE_GROUPS[number]["name"];

export const getStyleName = (slug: StyleSlug): StyleName => {
  return STYLE_GROUPS.find(group => group.slug === slug)?.name || "Minimal";
};

export const getStyleSlug = (name: StyleName): StyleSlug => {
  return STYLE_GROUPS.find(group => group.name === name)?.slug || "minimal";
};
