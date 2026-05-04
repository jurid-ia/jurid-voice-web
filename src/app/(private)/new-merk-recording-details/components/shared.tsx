"use client";

import { cn } from "@/utils/cn";
import { ReactNode } from "react";

export function GlassCard({
  children,
  className,
  hoverable = false,
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-black/5 bg-white p-5 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(120,90,50,0.12)]",
        hoverable &&
          "transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_16px_40px_-18px_rgba(120,90,50,0.24)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  right,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <span className="text-primary/80 mb-1 block text-[11px] font-semibold tracking-[0.14em] uppercase">
            {eyebrow}
          </span>
        )}
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {right}
    </div>
  );
}

export function Pill({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "primary" | "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-gray-100 text-gray-700 border-gray-200",
    primary: "bg-primary/10 text-primary border-primary/20",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
    neutral: "bg-slate-50 text-slate-600 border-slate-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({
  initials,
  hue,
  size = 40,
  ring = false,
}: {
  initials: string;
  hue: number;
  size?: number;
  ring?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        ring && "ring-primary/40 ring-2 ring-offset-2 ring-offset-white",
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, hsl(${hue} 55% 55%), hsl(${hue} 50% 38%))`,
      }}
    >
      {initials}
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  colorClassName = "bg-primary",
}: {
  value: number;
  className?: string;
  colorClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100",
        className,
      )}
    >
      <div
        className={cn(
          "absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out",
          colorClassName,
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
  }
  return `${minutes}min ${seconds.toString().padStart(2, "0")}s`;
}

export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDateShort(iso: string | null): string {
  if (!iso) return "Sem prazo definido";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(iso));
}
