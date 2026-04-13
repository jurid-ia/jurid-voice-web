"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "neutral" | "warning" | "danger" | "success";
  highlight?: boolean;
  delay?: number;
}

const accentStyles: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  neutral: "bg-gradient-to-br from-[#AB8E63] to-[#8f7652] shadow-[#AB8E63]/20",
  warning: "bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/20",
  danger: "bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/20",
  success:
    "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/20",
};

export function NewHomeKpiCard({
  title,
  value,
  icon: Icon,
  accent = "neutral",
  highlight = false,
  delay = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white p-3.5 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-black/5",
        highlight ? "border-[#AB8E63]/60 ring-1 ring-[#AB8E63]/30" : "border-stone-200",
      )}
    >
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
            {title}
          </span>
          <span className="text-2xl font-bold leading-tight text-gray-800">
            {value}
          </span>
        </div>

        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg shadow-md transition-all duration-300 group-hover:scale-110",
            accentStyles[accent],
          )}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
