import Link from "next/link";
import { HomeHero } from "@/components/hero/HomeHero";
import { Countdown } from "@/components/Countdown";
import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { PAGES } from "@/content/site";

export default function HomePage() {
  const departments = PAGES.filter((p) => p.href !== "/");

  return (
    <>
      <HomeHero />
      <Countdown />

      <section className="section">
        <FadeIn>
          <div className="container grid-2 grid-2-wide">
            <div
              className="img-ph"
              style={{ aspectRatio: "3/4", width: "100%", maxWidth: 480 }}
              data-label="COUPLE PORTRAIT · FULL-LENGTH · B&W"
            />
            <div>
              <h2
                className="display"
                style={{ fontSize: "clamp(40px, 5vw, 72px)", marginBottom: 32 }}
              >
                Two souls,
                <br />
                <span className="script" style={{ fontSize: "1.5em" }}>
                  one November evening,
                </span>
                <br />
                in the heart of Kansas City.
              </h2>
              <p
                className="body-serif"
                style={{ color: "var(--muted)", maxWidth: 460 }}
              >
                Join us for an evening of vows, champagne, and dancing into the
                small hours. Ceremony at Country Club Christian Church —
                reception immediately following at Indian Hills Country Club.
              </p>
              <div className="hero-cta-row">
                <Link href="/story" className="btn">
                  Our Story
                </Link>
                <Link href="/details" className="btn btn-ghost">
                  Event Details
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
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
