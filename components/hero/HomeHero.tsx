"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
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
        background: "#1a1612",
      }}
    >
      {/* Engagement photograph */}
      <Image
        src="/hero.jpg"
        alt="Sydney and Trenton sharing a kiss for their engagement portraits in Kansas City."
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 38%" }}
      />

      {/* Film grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />
      {/* Legibility overlay: darken top & bottom so the light type reads */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.60) 100%)",
        }}
        aria-hidden
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center 50%, transparent 30%, rgba(0,0,0,0.45) 100%)",
        }}
        aria-hidden
      />

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
            fontSize: "clamp(30px, 3.4vw, 40px)",
            lineHeight: 1,
            letterSpacing: "0.01em",
            textShadow: "0 2px 18px rgba(0,0,0,0.5)",
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
            background: "rgba(245,242,236,0.7)",
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
            textShadow: "0 1px 16px rgba(0,0,0,0.5)",
          }}
        >
          {SITE.weddingDateShort}
        </motion.div>
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.9, delay: 0.85, ease }}
          style={{
            fontFamily: "var(--ff-sans)",
            fontSize: 10,
            letterSpacing: "0.42em",
            marginTop: 10,
            textShadow: "0 1px 12px rgba(0,0,0,0.5)",
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
            border: "1px solid rgba(245,242,236,0.85)",
            background: "rgba(0,0,0,0.15)",
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
