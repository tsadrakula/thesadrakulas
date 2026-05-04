import type { Metadata } from "next";
import { bodoniModa, cormorant, italianno, inter } from "./fonts";
import "./globals.css";
import { Masthead } from "@/components/Masthead";
import { Footer } from "@/components/Footer";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: `${SITE.brideShort} & ${SITE.groomShort} · ${SITE.weddingDateRoman}`,
  description: `Sydney Ann Krause and Trenton Logan Sadrakula are getting married on ${SITE.weddingDateDisplay} in ${SITE.city}.`,
  metadataBase: new URL("https://thesadrakulas.com"),
  openGraph: {
    title: `${SITE.brideShort} & ${SITE.groomShort}`,
    description: `${SITE.weddingDateDisplay} · ${SITE.city}`,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bodoniModa.variable} ${cormorant.variable} ${italianno.variable} ${inter.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <Masthead />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
