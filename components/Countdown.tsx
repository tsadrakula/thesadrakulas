"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SITE } from "@/content/site";

type Counts = { days: number; hours: number; mins: number };

function getCounts(): Counts {
  const target = new Date(SITE.weddingDateISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export function Countdown() {
  const reduce = useReducedMotion();
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    setCounts(getCounts());
    const id = setInterval(() => setCounts(getCounts()), 60_000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { label: "Days", value: counts ? String(counts.days).padStart(3, "0") : "—" },
    { label: "Hours", value: counts ? String(counts.hours).padStart(2, "0") : "—" },
    { label: "Minutes", value: counts ? String(counts.mins).padStart(2, "0") : "—" },
  ];

  return (
    <section
      style={{
        borderTop: "1px solid var(--ink)",
        borderBottom: "1px solid var(--ink)",
        padding: "48px 40px",
        background: "var(--cream)",
      }}
    >
      <div className="container">
        <motion.div
          className="eyebrow"
          style={{ textAlign: "center", color: "var(--muted)", marginBottom: 20 }}
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          The Countdown to the Ceremony
        </motion.div>
        <div className="countdown">
          {cells.map((c, i) => (
            <motion.div
              key={c.label}
              className="countdown-cell"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="countdown-num">{c.value}</div>
              <div className="countdown-label">{c.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
