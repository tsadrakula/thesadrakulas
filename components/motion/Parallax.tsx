"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** translateY range in pixels: from value at scroll start, to value at scroll end of element */
  range?: [number, number];
};

export function Parallax({ children, className, range = [0, -80] }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], range);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

type ScrollScaleProps = {
  children: ReactNode;
  className?: string;
  range?: [number, number];
};

export function ScrollScale({ children, className, range = [1, 1.08] }: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], range);

  if (reduce) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ scale, transformOrigin: "center center" }}
    >
      {children}
    </motion.div>
  );
}
