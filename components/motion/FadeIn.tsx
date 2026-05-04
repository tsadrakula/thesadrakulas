"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article";
  /** Trigger only once when entering viewport */
  once?: boolean;
};

export function FadeIn({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  once = true,
}: FadeInProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  if (reduce) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
