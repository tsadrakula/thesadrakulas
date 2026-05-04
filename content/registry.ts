export type RegistryItem = {
  name: string;
  tag: string;
  desc: string;
  url: string | null;
};

export const REGISTRIES: RegistryItem[] = [
  { name: "CRATE & BARREL", tag: "The Home", desc: "For the everyday and the entertaining — linens, table, hearth.", url: null },
  { name: "WILLIAMS SONOMA", tag: "The Kitchen", desc: "Copper pots, heirloom knives, and Sunday suppers in mind.", url: null },
  { name: "POTTERY BARN", tag: "The Nest", desc: "For the rooms where the quiet years will happen.", url: null },
  { name: "BLOOMINGDALE'S", tag: "The Registry", desc: "A little of everything — a long list, carefully chosen.", url: null },
  { name: "ZOLA", tag: "Experiences", desc: "Honeymoon contributions, restaurant nights, small adventures.", url: null },
  { name: "THE KNOT", tag: "Cash Fund", desc: "Toward the first home — with our deepest gratitude.", url: null },
];

export const HONEYMOON_FUND: { venmoHandle: string | null; note: string } = {
  venmoHandle: null,
  note: "For those who would prefer, a contribution toward our honeymoon — the first chapter of our life together.",
};
