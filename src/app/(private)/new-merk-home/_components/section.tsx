"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  ariaLabel?: string;
}

export function Section({
  children,
  delay = 0,
  className,
  ariaLabel,
}: SectionProps) {
  return (
    <motion.section
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className={cn("w-full", className)}
    >
      {children}
    </motion.section>
  );
}
