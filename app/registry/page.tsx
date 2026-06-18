import { FadeIn } from "@/components/motion/FadeIn";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Monogram } from "@/components/Monogram";
import { REGISTRIES, HONEYMOON_FUND } from "@/content/registry";

export default function RegistryPage() {
  return (
    <section className="section">
      <div className="container">
        <FadeIn>
          <div className="dept-label">
            <div className="no" />
            <div className="ti">Registry</div>
            <div className="rt">With Our Thanks</div>
          </div>
        </FadeIn>

        <Stagger>
          <div className="reg-grid">
            {REGISTRIES.map((r) => {
              const ready = r.url !== null;
              const Wrapper = ({ children }: { children: React.ReactNode }) =>
                ready ? (
                  <a
                    href={r.url!}
                    className="reg-card"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {children}
                  </a>
                ) : (
                  <div className="reg-card" aria-disabled="true">
                    {children}
                  </div>
                );

              return (
                <StaggerItem key={r.name}>
                  <Wrapper>
                    <div
                      className="eyebrow"
                      style={{ color: "var(--muted)", marginBottom: 8 }}
                    >
                      {r.tag}
                    </div>
                    <div className="logo">{r.name}</div>
                    <div
                      className="eyebrow"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        alignSelf: "center",
                        gap: 8,
                        borderBottom: ready
                          ? "1px solid var(--ink)"
                          : "1px dashed var(--hairline)",
                        paddingBottom: 4,
                        color: ready ? "var(--ink)" : "var(--muted)",
                      }}
                    >
                      {ready ? "Visit Registry" : "Coming Soon"}{" "}
                      {ready && <span style={{ fontFamily: "serif" }}>→</span>}
                    </div>
                  </Wrapper>
                </StaggerItem>
              );
            })}
          </div>
        </Stagger>

        <FadeIn>
          <div
            style={{
              marginTop: 120,
              padding: "80px 40px",
              borderTop: "1px solid var(--ink)",
              borderBottom: "1px solid var(--ink)",
              textAlign: "center",
              background: "var(--cream)",
            }}
          >
            <div
              className="eyebrow"
              style={{ color: "var(--muted)", marginBottom: 20 }}
            >
              ── In Lieu Of ──
            </div>
            <h2
              className="display"
              style={{
                fontSize: "clamp(32px, 4vw, 52px)",
                lineHeight: 1.1,
                marginBottom: 20,
                maxWidth: 780,
                margin: "0 auto 20px",
              }}
            >
              Contribute to our{" "}
              <span className="script" style={{ fontSize: "1.4em" }}>
                honeymoon fund.
              </span>
            </h2>
            <p
              className="italic"
              style={{
                color: "var(--muted)",
                maxWidth: 560,
                margin: "0 auto",
                fontSize: 17,
              }}
            >
              {HONEYMOON_FUND.note}
            </p>
            {HONEYMOON_FUND.venmoHandle ? (
              <a
                href={`https://venmo.com/${HONEYMOON_FUND.venmoHandle}`}
                className="btn"
                style={{ marginTop: 32 }}
                target="_blank"
                rel="noreferrer"
              >
                Contribute via Venmo
              </a>
            ) : (
              <div
                className="btn btn-ghost"
                style={{ marginTop: 32, opacity: 0.6, cursor: "default" }}
              >
                Coming Soon
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
