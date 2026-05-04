import { FadeIn } from "@/components/motion/FadeIn";
import { ScrollScale } from "@/components/motion/Parallax";
import { Monogram } from "@/components/Monogram";
import { STORY } from "@/content/story";

export default function StoryPage() {
  return (
    <section className="section">
      <div className="container">
        <FadeIn>
          <div className="dept-label">
            <div className="no" />
            <div className="ti">Our Story</div>
            <div className="rt">A Love Letter</div>
          </div>
        </FadeIn>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div
              className="eyebrow"
              style={{ color: "var(--muted)", marginBottom: 24 }}
            >
              ── {STORY.hero.eyebrow} ──
            </div>
            <h1
              className="display"
              style={{ fontSize: "clamp(56px, 9vw, 130px)", marginBottom: 20 }}
            >
              {STORY.hero.title}{" "}
              <span className="script" style={{ fontSize: "1.4em" }}>
                {STORY.hero.titleScript}
              </span>
            </h1>
            <p
              className="italic"
              style={{
                fontSize: 22,
                color: "var(--muted)",
                maxWidth: 620,
                margin: "0 auto",
              }}
            >
              {STORY.hero.subtitle}
            </p>
          </div>
        </FadeIn>

        <ScrollScale>
          <div
            className="img-ph"
            style={{ aspectRatio: "16/8", marginBottom: 80 }}
            data-label={STORY.heroImageLabel}
          />
        </ScrollScale>

        {STORY.chapters.map((c, idx) => {
          const isRight = c.side === "right";
          return (
            <FadeIn key={c.number}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isRight ? "1fr 1.4fr" : "1.4fr 1fr",
                  gap: 80,
                  marginBottom: 120,
                  alignItems: "start",
                }}
              >
                {isRight ? (
                  <>
                    <ChapterTitle chapter={c} />
                    <ChapterBody chapter={c} dropCap={idx === 0} />
                  </>
                ) : (
                  <>
                    <ChapterBody chapter={c} dropCap={false} />
                    <ChapterTitle chapter={c} />
                  </>
                )}
              </div>
              {idx === 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 20,
                    marginBottom: 120,
                  }}
                >
                  {STORY.galleryLabels.map((label) => (
                    <div
                      key={label}
                      className="img-ph"
                      style={{ aspectRatio: "3/4" }}
                      data-label={label}
                    />
                  ))}
                </div>
              )}
              {idx === 0 && (
                <FadeIn>
                  <div
                    className="pull-quote"
                    style={{
                      borderTop: "1px solid var(--ink)",
                      borderBottom: "1px solid var(--ink)",
                      marginBottom: 120,
                    }}
                  >
                    {STORY.pullQuote}
                  </div>
                </FadeIn>
              )}
            </FadeIn>
          );
        })}

        <ScrollScale range={[1, 1.05]}>
          <div
            className="img-ph"
            style={{ aspectRatio: "16/7", marginBottom: 120 }}
            data-label={STORY.midImageLabel}
          />
        </ScrollScale>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 60 }}>
            <div
              className="eyebrow"
              style={{ color: "var(--muted)", marginBottom: 16 }}
            >
              {STORY.proposal.number}
            </div>
            <h2
              className="display"
              style={{ fontSize: "clamp(44px, 7vw, 100px)", lineHeight: 0.95 }}
            >
              {STORY.proposal.title}{" "}
              <span className="script" style={{ fontSize: "1.4em" }}>
                {STORY.proposal.titleScript}
              </span>
            </h2>
          </div>
        </FadeIn>

        <FadeIn>
          <div
            className="container-narrow body-serif drop-cap"
            style={{ marginBottom: 120 }}
          >
            <p>{STORY.proposal.paragraph}</p>
          </div>
        </FadeIn>

        <FadeIn>
          <div
            className="img-ph"
            style={{
              aspectRatio: "4/3",
              maxWidth: 720,
              margin: "0 auto 80px",
            }}
            data-label={STORY.proposal.imageLabel}
          />
        </FadeIn>

        <FadeIn>
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              borderTop: "1px solid var(--ink)",
            }}
          >
            <Monogram size={96} />
            <p
              className="italic"
              style={{ fontSize: 22, color: "var(--muted)", marginTop: 24 }}
            >
              {STORY.closer}
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

type Chapter = (typeof STORY.chapters)[number];

function ChapterTitle({ chapter }: { chapter: Chapter }) {
  return (
    <div>
      <div
        className="eyebrow"
        style={{ color: "var(--muted)", marginBottom: 16 }}
      >
        {chapter.number}
      </div>
      <h2
        className="display"
        style={{ fontSize: "clamp(36px, 5vw, 64px)", lineHeight: 0.95 }}
      >
        {chapter.title}{" "}
        <span className="script" style={{ fontSize: "1.4em" }}>
          {chapter.titleScript}
        </span>{" "}
        {chapter.titleAfter}
      </h2>
    </div>
  );
}

function ChapterBody({ chapter, dropCap }: { chapter: Chapter; dropCap: boolean }) {
  return (
    <div
      className={dropCap ? "body-serif drop-cap" : "body-serif"}
      style={{ color: "var(--ink)" }}
    >
      {chapter.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
