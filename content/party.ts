export const BRIDESMAIDS = [
  { name: "Chloe Krause", role: "Maid of Honour" },
  { name: "Stephanie Wilcox", role: "Bridesmaid" },
  { name: "Lauren Merritt", role: "Bridesmaid" },
  { name: "Kennedy Montgomery", role: "Bridesmaid" },
  { name: "Natalie Matchell", role: "Bridesmaid" },
  { name: "Frances Wentz", role: "Bridesmaid" },
  { name: "Gabrielle Lintner", role: "Bridesmaid" },
  { name: "Taylor Wolf", role: "Bridesmaid" },
] as const;

export const GROOMSMEN = [
  { name: "Evan Sadrakula", role: "Best Man" },
  { name: "Stephen Nachtsheim", role: "Groomsman" },
  { name: "Joel Zuniga", role: "Groomsman" },
  { name: "Charles Kump", role: "Groomsman" },
  { name: "Zach Ramirez", role: "Groomsman" },
  { name: "Clayton Lucas", role: "Groomsman" },
  { name: "Andy Mikesic", role: "Groomsman" },
  { name: "Joe Krause", role: "Groomsman" },
] as const;

export const FAMILY = [
  { side: "Trenton’s Side", names: ["John Sadrakula", "Melissa Sadrakula"] },
  { side: "Sydney’s Side", names: ["Michael & Stephanie Krause"] },
] as const;

export const PRINCIPALS = {
  bride: {
    role: "The Bride",
    fullName: "Sydney Ann Krause",
    nameScript: "Sydney Ann",
    nameAfter: "Krause",
  },
  groom: {
    role: "The Groom",
    fullName: "Trenton Logan Sadrakula",
    nameScript: "Trenton Logan",
    nameAfter: "Sadrakula",
  },
} as const;
