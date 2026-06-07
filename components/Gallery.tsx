"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import type { GallerySlide } from "@/content/gallery";

const AUTOPLAY_MS = 5000;

export function Gallery({ slides }: { slides: GallerySlide[] }) {
  const reduce = useReducedMotion();
  const count = slides.length;

  const [index, setIndexState] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const idxRef = useRef(0);
  const touchX = useRef<number | null>(null);

  // Set the active slide. Snap instantly (no slide animation) when wrapping
  // around the ends so the loop doesn't sweep back through every photo.
  const go = (next: number) => {
    const n = ((next % count) + count) % count;
    const isWrap = Math.abs(n - idxRef.current) > 1;
    idxRef.current = n;
    setAnimate(!isWrap);
    setIndexState(n);
    if (isWrap) {
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    }
  };
  const prev = () => go(idxRef.current - 1);
  const next = () => go(idxRef.current + 1);

  // Autoplay — paused on hover/focus and disabled for reduced-motion users.
  useEffect(() => {
    if (reduce || paused || count <= 1) return;
    const id = setInterval(() => go(idxRef.current + 1), AUTOPLAY_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, paused, count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
    touchX.current = null;
  };

  return (
    <section
      className="gallery"
      aria-roledescription="carousel"
      aria-label="Sydney and Trenton photo gallery"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        className="gallery-viewport"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="gallery-track"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition:
              animate && !reduce
                ? "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
          }}
        >
          {slides.map((s, i) => (
            <div
              className="gallery-slide"
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              {s.src ? (
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 900px"
                  style={{ objectFit: "cover", objectPosition: s.pos ?? "center 30%" }}
                />
              ) : (
                <div
                  className="img-ph"
                  style={{ position: "absolute", inset: 0 }}
                  data-label={s.label ?? s.alt}
                />
              )}
            </div>
          ))}
        </div>

        <button
          className="gallery-arrow gallery-arrow-prev"
          type="button"
          onClick={prev}
          aria-label="Previous photo"
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <button
          className="gallery-arrow gallery-arrow-next"
          type="button"
          onClick={next}
          aria-label="Next photo"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>

      <div className="gallery-dots" aria-label="Choose a photo">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            className={i === index ? "on" : ""}
            aria-label={`Go to photo ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
          />
        ))}
      </div>

      <p className="sr-only" aria-live="polite">{`Photo ${index + 1} of ${count}`}</p>
    </section>
  );
}
