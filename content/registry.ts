export type RegistryItem = {
  name: string;
  tag: string;
  url: string | null;
};

export const REGISTRIES: RegistryItem[] = [
  {
    name: "CRATE & BARREL",
    tag: "The Home",
    url: "https://www.crateandbarrel.com/gift-registry/sydney-krause-and-trenton-sadrakula/r7554477",
  },
  {
    name: "WILLIAMS SONOMA",
    tag: "The Kitchen",
    url: "https://www.williams-sonoma.com/registry/l7t6lwdsd5/registry-list.html",
  },
  {
    name: "HUDSON & GRACE",
    tag: "The Table",
    url: "https://hudsongracesf.com/apps/giftregistry/registry/433469?_r=1&utm_source=gift_reggie&utm_medium=gift_reggie&utm_campaign=gift_reggie&utm_content=433469",
  },
];

export const HONEYMOON_FUND: { venmoHandle: string | null; note: string } = {
  venmoHandle: null,
  note: "For those who would prefer, a contribution toward our honeymoon — the first chapter of our life together.",
};
