import Link from "next/link";
import { HomeHero } from "@/components/hero/HomeHero";
import { Countdown } from "@/components/Countdown";
import { Gallery } from "@/components/Gallery";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { PAGES } from "@/content/site";
import { GALLERY } from "@/content/gallery";

export default function HomePage() {
  const departments = PAGES.filter((p) => p.href !== "/");

  return (
    <>
      <HomeHero />
      <Countdown />

      <section className="section">
        <div className="container">
          <FadeIn>
            <div
              className="eyebrow"
              style={{
                textAlign: "center",
                color: "var(--muted)",
                marginBottom: 40,
              }}
            >
              ── Moments ──
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Gallery slides={GALLERY} />
          </FadeIn>
        </div>
      </section>

      <section
        className="section-tight"
        style={{
          background: "var(--cream)",
          borderTop: "1px solid var(--ink)",
          borderBottom: "1px solid var(--ink)",
        }}
      >
        <div className="container">
          <FadeIn>
            <div
              className="eyebrow"
              style={{
                textAlign: "center",
                color: "var(--muted)",
                marginBottom: 40,
              }}
            >
              Explore
            </div>
          </FadeIn>
          <Stagger>
            <div className="grid-explore">
              {departments.map((d, i) => (
                <StaggerItem key={d.href}>
                  <Link href={d.href} className="explore-card">
                    <div className="eyebrow">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="display" style={{ fontSize: 26 }}>
                      {d.label}
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </div>
      </section>
    </>
  );
}
