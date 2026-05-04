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
          <div
            className="container"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.1fr",
              gap: 80,
              alignItems: "center",
            }}
          >
            <div
              className="img-ph"
              style={{ aspectRatio: "3/4" }}
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
              <div style={{ display: "flex", gap: 16, marginTop: 40 }}>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${departments.length}, 1fr)`,
                gap: 1,
                background: "var(--hairline)",
              }}
            >
              {departments.map((d, i) => (
                <StaggerItem key={d.href}>
                  <Link
                    href={d.href}
                    style={{
                      background: "var(--cream)",
                      padding: "48px 20px",
                      textAlign: "center",
                      transition: "background 0.2s",
                      display: "block",
                      height: "100%",
                    }}
                  >
                    <div
                      className="eyebrow"
                      style={{ color: "var(--muted)", marginBottom: 8 }}
                    >
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
