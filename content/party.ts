export const BRIDESMAIDS = [
  { name: "Margaret Krause", role: "Maid of Honour", bio: "Sister of the bride · partner in crime since 1998.", tag: "MOH" },
  { name: "Caroline Whitfield", role: "Bridesmaid", bio: "College roommate · godmother to the future.", tag: "BM" },
  { name: "Eleanor Hayes", role: "Bridesmaid", bio: "Childhood friend · keeper of every secret.", tag: "BM" },
  { name: "Josephine Marlow", role: "Bridesmaid", bio: "The one who introduced them at the party.", tag: "BM" },
  { name: "Vivienne Ashford", role: "Bridesmaid", bio: "Cousin of the bride · always the last on the dance floor.", tag: "BM" },
  { name: "Beatrice Lang", role: "Bridesmaid", bio: "Friend from New York · impeccable taste.", tag: "BM" },
] as const;

export const GROOMSMEN = [
  { name: "Mason Sadrakula", role: "Best Man", bio: "Brother of the groom · speech-writer-in-chief.", tag: "BEST" },
  { name: "Andrew Calloway", role: "Groomsman", bio: "College roommate · unofficial co-founder.", tag: "GM" },
  { name: "Theodore Grant", role: "Groomsman", bio: "Friend since middle school · best laugh in the room.", tag: "GM" },
  { name: "Henry Whitmore", role: "Groomsman", bio: "Engineer · fellow caffeine enthusiast.", tag: "GM" },
  { name: "William Archer", role: "Groomsman", bio: "Cousin of the groom · unmatched fashion sense.", tag: "GM" },
  { name: "Julian Pierce", role: "Groomsman", bio: "Old friend · voice of reason since freshman year.", tag: "GM" },
] as const;

export const FAMILY = [
  { name: "Michael & Stephanie Krause", role: "Parents of the Bride", bio: "Host and hostess of the evening." },
  { name: "The Sadrakula Family", role: "Parents of the Groom", bio: "With gratitude and joy." },
] as const;

export const PRINCIPALS = {
  bride: {
    role: "The Bride",
    fullName: "Sydney Ann Krause",
    nameScript: "Sydney Ann",
    nameAfter: "Krause",
    bio: "Daughter of Michael & Stephanie Krause. Kansas City native, incurable romantic, devoted collector of peonies and first editions.",
    imageLabel: "THE BRIDE · SYDNEY ANN KRAUSE · EDITORIAL PORTRAIT",
  },
  groom: {
    role: "The Groom",
    fullName: "Trenton Logan Sadrakula",
    nameScript: "Trenton Logan",
    nameAfter: "Sadrakula",
    bio: "Engineer by training, romantic by nature. Prefers his coffee black, his Sundays slow, and his bride in every room he enters.",
    imageLabel: "THE GROOM · TRENTON LOGAN SADRAKULA · EDITORIAL PORTRAIT",
  },
} as const;
