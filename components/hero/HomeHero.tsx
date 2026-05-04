"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { SITE } from "@/content/site";

export function HomeHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.7, 0]);

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        height: "calc(100vh - 60px)",
        minHeight: 640,
        overflow: "hidden",
        color: "#f5f2ec",
        background:
          "linear-gradient(180deg, #2a2520 0%, #3d3630 30%, #5a4f46 55%, #302822 85%, #1a1612 100%)",
      }}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        aria-hidden
      >
        <g opacity="0.45">
          <ellipse cx="175" cy="145" rx="22" ry="26" fill="rgba(30,25,20,0.7)" />
          <path
            d="M 140 300 L 145 200 Q 150 175 175 175 Q 200 175 205 200 L 210 300 Z"
            fill="rgba(30,25,20,0.7)"
          />
          <ellipse cx="225" cy="140" rx="20" ry="24" fill="rgba(30,25,20,0.7)" />
          <path
            d="M 195 300 L 200 195 Q 205 170 225 170 Q 250 170 255 195 L 260 300 Z"
            fill="rgba(30,25,20,0.7)"
          />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center 55%, transparent 25%, rgba(0,0,0,0.5) 100%)",
        }}
        aria-hidden
      />

      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          fontFamily: "Courier New, monospace",
          fontSize: 8,
          letterSpacing: "0.16em",
          color: "rgba(245,242,236,0.5)",
          padding: "4px 8px",
          border: "1px solid rgba(245,242,236,0.3)",
        }}
      >
        PHOTO PLACEHOLDER
      </div>

      <motion.div
        style={
          reduce
            ? {
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "0 24px",
              }
            : {
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "0 24px",
                y,
                opacity,
              }
        }
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease }}
          style={{
            fontFamily: "var(--ff-script)",
            fontWeight: 400,
            fontSize: "clamp(96px, 16vw, 220px)",
            lineHeight: 0.95,
            letterSpacing: "0.01em",
            textShadow: "0 2px 24px rgba(0,0,0,0.3)",
          }}
        >
          {SITE.brideShort}{" "}
          <span style={{ fontStyle: "italic" }}>&amp;</span> {SITE.groomShort}
        </motion.div>
        <motion.div
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          style={{
            width: 60,
            height: 1,
            background: "rgba(245,242,236,0.6)",
            margin: "32px 0 18px",
            transformOrigin: "center",
          }}
        />
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 0.95 }}
          transition={{ duration: 0.9, delay: 0.7, ease }}
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontSize: "clamp(18px, 2vw, 24px)",
            letterSpacing: "0.16em",
            fontVariationSettings: '"opsz" 96',
          }}
        >
          {SITE.weddingDateRoman}
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.9, delay: 0.85, ease }}
          style={{
            fontFamily: "var(--ff-sans)",
            fontSize: 10,
            letterSpacing: "0.42em",
            marginTop: 10,
          }}
        >
          {SITE.city.toUpperCase()}
        </motion.div>
      </motion.div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.1, ease }}
        style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Link
          href="/rsvp"
          style={{
            padding: "14px 32px",
            border: "1px solid rgba(245,242,236,0.8)",
            background: "transparent",
            color: "#f5f2ec",
            fontFamily: "var(--ff-sans)",
            fontSize: 10,
            letterSpacing: "0.32em",
          }}
        >
          KINDLY RESPOND →
        </Link>
      </motion.div>
    </section>
  );
}
