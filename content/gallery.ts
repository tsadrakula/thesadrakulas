export type GallerySlide = {
  /** Path under /public, e.g. "/gallery/02.jpg". Null renders a styled placeholder. */
  src: string | null;
  /** Descriptive alt text for screen readers. */
  alt: string;
  /** Label shown inside the placeholder when src is null. */
  label?: string;
  /** Optional object-position override for the cover crop (default "center 32%"). */
  pos?: string;
};

// Engagement photographs, alternating black-and-white and colour.
export const GALLERY: GallerySlide[] = [
  { src: "/gallery/01.jpg", alt: "Sydney and Trenton gazing at one another on the stone steps." },
  { src: "/gallery/02.jpg", alt: "Sydney, in a red dress, kissing Trenton beside the reflecting pond.", pos: "center 82%" },
  { src: "/gallery/03.jpg", alt: "Sydney and Trenton sharing a kiss on the garden steps." },
  { src: "/gallery/04.jpg", alt: "Trenton kissing Sydney on the forehead, her hand resting on his chest." },
  { src: "/gallery/05.jpg", alt: "Sydney and Trenton facing each other on the lawn, the mansion rising behind them." },
  { src: "/gallery/06.jpg", alt: "Sydney in a red dress with Trenton before the spiral columns." },
  { src: "/gallery/07.jpg", alt: "Sydney and Trenton sharing a kiss on the stone steps." },
  { src: "/gallery/08.jpg", alt: "Trenton kissing Sydney on the cheek as she smiles." },
  { src: "/gallery/09.jpg", alt: "A close view of Sydney's engagement ring as they hold hands." },
  { src: "/gallery/10.jpg", alt: "Sydney and Trenton on the steps, the columns rising behind them." },
];
