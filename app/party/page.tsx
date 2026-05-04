import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { BRIDESMAIDS, GROOMSMEN, FAMILY, PRINCIPALS } from "@/content/party";

type Person = {
  readonly name: string;
  readonly role: string;
  readonly bio: string;
  readonly tag: string;
};

function PartyGroup({
  eyebrow,
  title,
  titleScript,
  people,
}: {
  eyebrow: string;
  title: string;
  titleScript: string;
  people: readonly Person[];
}) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--ink)",
        paddingTop: 60,
        marginBottom: 100,
      }}
    >
      <FadeIn>
        <div
          className="eyebrow"
          style={{
            textAlign: "center",
            color: "var(--muted)",
            marginBottom: 16,
          }}
        >
          {eyebrow}
        </div>
        <h2
          className="display"
          style={{
            textAlign: "center",
            fontSize: "clamp(40px, 5vw, 72px)",
            marginBottom: 60,
          }}
        >
          {title}{" "}
          <span className="script" style={{ fontSize: "1.4em" }}>
            {titleScript}
          </span>
        </h2>
      </FadeIn>
      <Stagger>
        <div className="party-grid">
          {people.map((p, i) => (
            <StaggerItem key={p.name}>
              <div className="party-card">
                <div
                  className="img-ph"
                  data-label={`${p.tag} · ${String(i + 1).padStart(2, "0")}`}
                />
                <h4>{p.name}</h4>
                <div className="role">{p.role}</div>
                <p className="bio">{p.bio}</p>
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
            <div
              className="eyebrow"
              style={{ color: "var(--muted)", marginBottom: 24 }}
            >
              ── Featured ──
            </div>
            <h1
              className="display"
              style={{ fontSize: "clamp(56px, 9vw, 130px)", marginBottom: 20 }}
            >
              The{" "}
              <span className="script" style={{ fontSize: "1.4em" }}>
                party.
              </span>
            </h1>
            <p
              className="italic"
              style={{
                fontSize: 22,
                color: "var(--muted)",
                maxWidth: 680,
                margin: "0 auto",
              }}
            >
              The small and excellent cast of friends and family standing beside
              us on the seventh of November.
            </p>
          </div>
        </FadeIn>

        <FadeIn>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              marginBottom: 120,
            }}
          >
            {[PRINCIPALS.bride, PRINCIPALS.groom].map((p) => (
              <div key={p.fullName}>
                <div
                  className="img-ph"
                  style={{ aspectRatio: "3/4", marginBottom: 24 }}
                  data-label={p.imageLabel}
                />
                <div
                  className="eyebrow"
                  style={{ color: "var(--muted)", marginBottom: 8 }}
                >
                  {p.role}
                </div>
                <h2
                  className="display"
                  style={{ fontSize: 56, lineHeight: 1, marginBottom: 12 }}
                >
                  <span className="script" style={{ fontSize: "1.5em" }}>
                    {p.nameScript}
                  </span>{" "}
                  {p.nameAfter}
                </h2>
                <p
                  className="italic"
                  style={{ fontSize: 17, color: "var(--muted)", lineHeight: 1.5 }}
                >
                  {p.bio}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        <PartyGroup
          eyebrow="── Her Side ──"
          title="The"
          titleScript="bridesmaids."
          people={BRIDESMAIDS}
        />

        <PartyGroup
          eyebrow="── His Side ──"
          title="The"
          titleScript="groomsmen."
          people={GROOMSMEN}
        />

        <div
          style={{
            borderTop: "1px solid var(--ink)",
            paddingTop: 60,
            paddingBottom: 40,
          }}
        >
          <FadeIn>
            <div
              className="eyebrow"
              style={{
                textAlign: "center",
                color: "var(--muted)",
                marginBottom: 16,
              }}
            >
              ── With Gratitude ──
            </div>
            <h2
              className="display"
              style={{
                textAlign: "center",
                fontSize: "clamp(36px, 4.5vw, 56px)",
                marginBottom: 60,
              }}
            >
              Our{" "}
              <span className="script" style={{ fontSize: "1.4em" }}>
                parents.
              </span>
            </h2>
          </FadeIn>
          <Stagger>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 40,
                maxWidth: 880,
                margin: "0 auto",
              }}
            >
              {FAMILY.map((p) => (
                <StaggerItem key={p.name}>
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      border: "1px solid var(--hairline)",
                    }}
                  >
                    <div
                      className="eyebrow"
                      style={{ color: "var(--muted)", marginBottom: 12 }}
                    >
                      {p.role}
                    </div>
                    <div
                      className="display"
                      style={{ fontSize: 26, lineHeight: 1.2, marginBottom: 8 }}
                    >
                      {p.name}
                    </div>
                    <p
                      className="italic"
                      style={{ color: "var(--muted)", fontSize: 15 }}
                    >
                      {p.bio}
                    </p>
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
