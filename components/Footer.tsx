import { Monogram } from "./Monogram";
import { SITE } from "@/content/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>The Ceremony</div>
          <div className="italic" style={{ fontSize: 16 }}>
            {SITE.ceremony.name} · {SITE.ceremony.start}
          </div>
        </div>
        <div className="footer-mono">
          <Monogram size={72} />
          <div className="eyebrow" style={{ marginTop: 12, color: "var(--muted)" }}>
            {SITE.weddingDateRoman}
          </div>
        </div>
        <div className="footer-right">
          <div className="eyebrow" style={{ marginBottom: 8 }}>The Reception</div>
          <div className="italic" style={{ fontSize: 16 }}>
            {SITE.reception.name} · {SITE.reception.start}
          </div>
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 40,
          paddingTop: 24,
          borderTop: "1px solid var(--hairline)",
        }}
      >
        <div className="eyebrow" style={{ color: "var(--muted)" }}>
          {SITE.bride} &nbsp;·&nbsp; {SITE.groom} &nbsp;·&nbsp; {SITE.city}
        </div>
      </div>
    </footer>
  );
}
