// Default character images shown when a seat is selected.
// Matched fuzzily against the screening title (case-insensitive substring).
// Admins can override per-screening via the `characterImage` field.

const DEFAULTS: Array<{ match: RegExp; image: string; alt: string }> = [
  {
    match: /avengers.*doom|doomsday/i,
    image: "https://image.tmdb.org/t/p/w200/9HwQ24OUuiMVMHRFhxrIs1cnimx.jpg", // Doctor Doom / RDJ
    alt: "Doctor Doom",
  },
  {
    match: /spider.?man.*(brand new day|new day)|spider.?man/i,
    image: "https://image.tmdb.org/t/p/w200/zZqpAXxVSBtxV9qPBcscfXBy3M.jpg", // Tom Holland Spidey
    alt: "Spider-Man",
  },
  {
    match: /dune.*part.*3|dune/i,
    image: "https://image.tmdb.org/t/p/w200/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg", // Paul Atreides
    alt: "Paul Atreides",
  },
  {
    match: /odyssey/i,
    image: "https://image.tmdb.org/t/p/w200/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg", // Christopher Nolan
    alt: "Christopher Nolan",
  },
  {
    match: /werewolf|werevulf|werevolf/i,
    image: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=200&q=80", // werewolf moody
    alt: "Werewolf",
  },
  {
    match: /disclosure day|spaceship|ufo/i,
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=200&q=80", // spaceship
    alt: "Spaceship",
  },
  {
    match: /dhurandhar/i,
    image: "https://images.unsplash.com/photo-1542204625-ca960696eed1?w=200&q=80",
    alt: "Dhurandhar",
  },
  {
    match: /interstellar/i,
    image: "https://image.tmdb.org/t/p/w200/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    alt: "Cooper",
  },
  {
    match: /dark knight|batman/i,
    image: "https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    alt: "Batman",
  },
];

export function getCharacterForTitle(title: string, override?: string): string | undefined {
  if (override) return override;
  const hit = DEFAULTS.find((d) => d.match.test(title));
  return hit?.image;
}
