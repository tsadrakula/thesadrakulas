import { Bodoni_Moda, Cormorant_Garamond, Italianno, Inter } from "next/font/google";

export const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const italianno = Italianno({
  subsets: ["latin"],
  variable: "--font-script",
  weight: ["400"],
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
  display: "swap",
});
