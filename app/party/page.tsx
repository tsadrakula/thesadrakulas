import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { BRIDESMAIDS, GROOMSMEN, FAMILY, PRINCIPALS } from "@/content/party";

type Person = {
  readonly name: string;
  readonly role: string;
};

function PartyColumn({
  eyebrow,
  titleScript,
  people,
}: {
  eyebrow: string;
  titleScript: string;
  people: readonly Person[];
}) {
  return (
    <div className="party-column">
      <FadeIn>
        <div
          className="eyebrow"
          style={{ textAlign: "center", color: "var(--muted)", marginBottom: 12 }}
        >
          {eyebrow}
        </div>
        <h2
          className="display"
          style={{
            textAlign: "center",
            fontSize: "clamp(32px, 4vw, 48px)",
            marginBottom: 32,
          }}
        >
          The <span className="script" style={{ fontSize: "1.4em" }}>{titleScript}</span>
        </h2>
      </FadeIn>
      <Stagger>
        <div className="party-list">
          {people.map((p) => (
            <StaggerItem key={p.name}>
              <div className="party-member">
                <div className="name">{p.name}</div>
                <div className="role">{p.role}</div>
              </div>
            </StaggerItem>
          ))}
        </div>
      </Stagger>
    </div>
  );
}

export default function PartyPage() {
  return (
    <section className="section">
      <div className="container">
        <FadeIn>
          <div className="dept-label">
            <div className="no" />
            <div className="ti">Bridal Party</div>
            <div className="rt">The Company We Keep</div>
          </div>
        </FadeIn>

        <FadeIn>
          <div style={{ textAlign: "center", marginBottom: 80 }}>
            <div className="eyebrow" style={{ color: "var(--muted)", marginBottom: 24 }}>
              ── Featured ──
            </div>
            <h1 className="display" style={{ fontSize: "clamp(56px, 9vw, 130px)", marginBottom: 20 }}>
              The <span className="script" style={{ fontSize: "1.4em" }}>party.</span>
            </h1>
            <p className="italic" style={{ fontSize: 22, color: "var(--muted)", maxWidth: 680, margin: "0 auto" }}>
              The small and excellent cast of friends and family standing beside us on the seventh of November.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="grid-2" style={{ marginBottom: 100, maxWidth: 980, marginLeft: "auto", marginRight: "auto" }}>
            {[PRINCIPALS.bride, PRINCIPALS.groom].map((p) => (
              <div key={p.fullName} style={{ textAlign: "center" }}>
                <div className="eyebrow" style={{ color: "var(--muted)", marginBottom: 12 }}>{p.role}</div>
                <h2 className="display" style={{ fontSize: 56, lineHeight: 1 }}>
                  <span className="script" style={{ fontSize: "1.5em" }}>{p.nameScript}</span> {p.nameAfter}
                </h2>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="party-columns">
          <PartyColumn eyebrow="── Her Side ──" titleScript="bridesmaids." people={BRIDESMAIDS} />
          <PartyColumn eyebrow="── His Side ──" titleScript="groomsmen." people={GROOMSMEN} />
        </div>

        <div style={{ borderTop: "1px solid var(--ink)", paddingTop: 60, paddingBottom: 40 }}>
          <FadeIn>
            <div className="eyebrow" style={{ textAlign: "center", color: "var(--muted)", marginBottom: 16 }}>
              ── With Gratitude ──
            </div>
            <h2 className="display" style={{ textAlign: "center", fontSize: "clamp(36px, 4.5vw, 56px)", marginBottom: 60 }}>
              Our <span className="script" style={{ fontSize: "1.4em" }}>parents.</span>
            </h2>
          </FadeIn>
          <Stagger>
            <div className="grid-2" style={{ maxWidth: 880, margin: "0 auto" }}>
              {FAMILY.map((f) => (
                <StaggerItem key={f.side}>
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      textAlign: "center",
                      padding: "40px 20px",
                      border: "1px solid var(--hairline)",
                    }}
                  >
                    <div className="eyebrow" style={{ color: "var(--muted)", marginBottom: 16 }}>{f.side}</div>
                    {f.names.map((n) => (
                      <div key={n} className="display" style={{ fontSize: 26, lineHeight: 1.35 }}>{n}</div>
                    ))}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
