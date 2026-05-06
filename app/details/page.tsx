import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { SITE } from "@/content/site";
import { SCHEDULE, HOTELS, DRESS_CODE } from "@/content/details";

export default function DetailsPage() {
  return (
    <section className="section">
      <div className="container">
        <FadeIn>
          <div className="dept-label">
            <div className="no" />
            <div className="ti">Event Details</div>
            <div className="rt">{SITE.weddingDateRoman}</div>
          </div>
        </FadeIn>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <h1
              className="display"
              style={{ fontSize: "clamp(56px, 9vw, 120px)", marginBottom: 20 }}
            >
              The{" "}
              <span className="script" style={{ fontSize: "1.4em" }}>
                Evening.
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
              A ceremony, a reception — and dancing until the last guest departs.
            </p>
          </div>
        </FadeIn>

        <Stagger>
          <div className="grid-2" style={{ gap: 32, marginBottom: 80 }}>
            <StaggerItem>
              <div
                className="img-ph"
                style={{ aspectRatio: "4/3", marginBottom: 24 }}
                data-label="COUNTRY CLUB CHRISTIAN CHURCH · EXTERIOR"
              />
              <div className="event-card">
                <div
                  className="eyebrow"
                  style={{ color: "var(--muted)", marginBottom: 12 }}
                >
                  The Ceremony
                </div>
                <h3>{SITE.ceremony.name}</h3>
                <p
                  className="italic"
                  style={{ color: "var(--muted)", marginBottom: 4 }}
                >
                  {SITE.ceremony.address}
                </p>
                <ul className="event-meta">
                  <li>
                    <span className="k">Date</span>
                    <span>{SITE.weddingDateDisplay}</span>
                  </li>
                  <li>
                    <span className="k">Arrival</span>
                    <span>{SITE.ceremony.arrival}</span>
                  </li>
                  <li>
                    <span className="k">Ceremony</span>
                    <span>{SITE.ceremony.start} sharp</span>
                  </li>
                  <li>
                    <span className="k">Attire</span>
                    <span>{SITE.ceremony.attire}</span>
                  </li>
                </ul>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div
                className="img-ph"
                style={{ aspectRatio: "4/3", marginBottom: 24 }}
                data-label="INDIAN HILLS COUNTRY CLUB · BALLROOM"
              />
              <div className="event-card">
                <div
                  className="eyebrow"
                  style={{ color: "var(--muted)", marginBottom: 12 }}
                >
                  The Reception
                </div>
                <h3>{SITE.reception.name}</h3>
                <p
                  className="italic"
                  style={{ color: "var(--muted)", marginBottom: 4 }}
                >
                  {SITE.reception.address}
                </p>
                <ul className="event-meta">
                  <li>
                    <span className="k">Cocktails</span>
                    <span>{SITE.reception.cocktails}</span>
                  </li>
                  <li>
                    <span className="k">Dinner</span>
                    <span>{SITE.reception.dinner}</span>
                  </li>
                  <li>
                    <span className="k">Dancing</span>
                    <span>{SITE.reception.dancing}</span>
                  </li>
                  <li>
                    <span className="k">Farewell</span>
                    <span>{SITE.reception.farewell}</span>
                  </li>
                </ul>
              </div>
            </StaggerItem>
          </div>
        </Stagger>

        <FadeIn>
          <div
            style={{
              padding: "80px 0",
              borderTop: "1px solid var(--ink)",
              borderBottom: "1px solid var(--ink)",
              marginBottom: 80,
            }}
          >
            <div
              className="eyebrow"
              style={{
                textAlign: "center",
                color: "var(--muted)",
                marginBottom: 16,
              }}
            >
              ── The Order of the Evening ──
            </div>
            <h2
              className="display"
              style={{
                textAlign: "center",
                fontSize: "clamp(40px, 5vw, 72px)",
                marginBottom: 60,
              }}
            >
              A{" "}
              <span className="script" style={{ fontSize: "1.4em" }}>
                schedule.
              </span>
            </h2>
            <Stagger>
              <div style={{ maxWidth: 620, margin: "0 auto" }}>
                {SCHEDULE.map(([time, title, sub], i) => (
                  <StaggerItem key={time}>
                    <div
                      className="schedule-row"
                      style={{
                        padding: "20px 0",
                        borderBottom:
                          i === SCHEDULE.length - 1
                            ? "none"
                            : "1px solid var(--hairline)",
                      }}
                    >
                      <div className="display" style={{ fontSize: 22 }}>
                        {time}
                      </div>
                      <div>
                        <div
                          className="display"
                          style={{ fontSize: 24, marginBottom: 4 }}
                        >
                          {title}
                        </div>
                        <div
                          className="italic"
                          style={{ color: "var(--muted)", fontSize: 15 }}
                        >
                          {sub}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </Stagger>
          </div>
        </FadeIn>

        <FadeIn>
          <div
            className="grid-2 grid-2-wide"
            style={{ marginBottom: 80 }}
          >
            <div
              className="img-ph"
              style={{ aspectRatio: "3/4", width: "100%", maxWidth: 480 }}
              data-label="BLACK TIE REFERENCE · EDITORIAL"
            />
            <div>
              <div
                className="eyebrow"
                style={{ color: "var(--muted)", marginBottom: 16 }}
              >
                ── Attire ──
              </div>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(36px, 5vw, 64px)",
                  marginBottom: 24,
                  lineHeight: 1,
                }}
              >
                Black tie{" "}
                <span className="script" style={{ fontSize: "1.4em" }}>
                  required.
                </span>
              </h2>
              <p
                className="body-serif"
                style={{ color: "var(--muted)", marginBottom: 32 }}
              >
                {DRESS_CODE.copy}
              </p>
              <div className="grid-2" style={{ gap: 20 }}>
                <div
                  style={{
                    borderTop: "1px solid var(--ink)",
                    paddingTop: 16,
                  }}
                >
                  <div
                    className="eyebrow"
                    style={{ color: "var(--muted)", marginBottom: 8 }}
                  >
                    Gentlemen
                  </div>
                  <div className="italic" style={{ fontSize: 17 }}>
                    {DRESS_CODE.gentlemen}
                  </div>
                </div>
                <div
                  style={{
                    borderTop: "1px solid var(--ink)",
                    paddingTop: 16,
                  }}
                >
                  <div
                    className="eyebrow"
                    style={{ color: "var(--muted)", marginBottom: 8 }}
                  >
                    Ladies
                  </div>
                  <div className="italic" style={{ fontSize: 17 }}>
                    {DRESS_CODE.ladies}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div
            style={{
              background: "var(--cream)",
              border: "1px solid var(--ink)",
              padding: 60,
            }}
          >
            <div
              className="eyebrow"
              style={{
                textAlign: "center",
                color: "var(--muted)",
                marginBottom: 16,
              }}
            >
              ── Travel & Accommodations ──
            </div>
            <h2
              className="display"
              style={{
                textAlign: "center",
                fontSize: "clamp(36px, 5vw, 56px)",
                marginBottom: 48,
              }}
            >
              Where to{" "}
              <span className="script" style={{ fontSize: "1.4em" }}>
                stay.
              </span>
            </h2>
            <Stagger>
              <div className="grid-3">
                {HOTELS.map((h) => (
                  <StaggerItem key={h.name}>
                    <div
                      style={{
                        textAlign: "center",
                        paddingTop: 24,
                        borderTop: "1px solid var(--ink)",
                      }}
                    >
                      <div
                        className="display"
                        style={{ fontSize: 28, marginBottom: 8 }}
                      >
                        {h.name}
                      </div>
                      <div
                        className="italic"
                        style={{ color: "var(--muted)", marginBottom: 8 }}
                      >
                        {h.tag}
                      </div>
                      <div
                        className="eyebrow"
                        style={{ color: "var(--muted)" }}
                      >
                        {h.address}
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </div>
            </Stagger>
            <p
              className="italic"
              style={{
                textAlign: "center",
                color: "var(--muted)",
                marginTop: 40,
                fontSize: 15,
              }}
            >
              Room blocks with preferred rates available. Mention the
              Krause–Sadrakula wedding when booking.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
