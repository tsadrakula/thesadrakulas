"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
};

export function Stagger({
  children,
  className,
  delayChildren = 0,
  staggerChildren = 0.06,
}: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren, staggerChildren } },
      }}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  y?: number;
};

export function StaggerItem({ children, className, y = 24 }: StaggerItemProps) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
