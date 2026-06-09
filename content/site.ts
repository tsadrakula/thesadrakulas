export const SITE = {
  bride: "Sydney Ann Krause",
  groom: "Trenton Logan Sadrakula",
  brideShort: "Sydney",
  groomShort: "Trenton",
  weddingDateISO: "2026-11-07T17:00:00-06:00",
  weddingDateDisplay: "Saturday, 7 November 2026",
  weddingDateShort: "November 7, 2026",
  weddingDateRoman: "VII · XI · MMXXVI",
  rsvpDeadlineISO: "2026-10-01T23:59:59-06:00",
  rsvpDeadlineDisplay: "the first of October, two thousand twenty-six",
  city: "Kansas City, Missouri",
  ceremony: {
    name: "Country Club Christian Church",
    address: "6101 Ward Parkway · Kansas City, Missouri",
    arrival: "4:45 in the afternoon",
    start: "5:00 p.m.",
    attire: "Black Tie Optional",
  },
  reception: {
    name: "Indian Hills Country Club",
    address: "6847 Tomahawk Road · Mission Hills, Kansas",
    start: "6:00 p.m.",
    "cocktail hour": "6:00 p.m.",
    dinner: "7:15 p.m.",
    "speeches & first dances": "8:00 p.m.",
    dancing: "8:30 p.m.",
    sendoff: "11:00 p.m.",
  },
} as const;

export const PAGES = [
  { href: "/", label: "Home" },
  { href: "/details", label: "Details" },
  { href: "/party", label: "Bridal Party" },
  { href: "/registry", label: "Registry" },
  { href: "/rsvp", label: "R.S.V.P." },
] as const;
