"use client";

import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

interface OptionButtonProps {
  label: string;
  icon?: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function OptionButton({
  label,
  icon,
  selected,
  disabled,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-all duration-200",
        "hover:-translate-y-[1px] hover:border-primary hover:shadow-sm",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-neutral-200 disabled:hover:shadow-none",
        selected
          ? "border-primary bg-primary/5 text-primary shadow-sm"
          : "border-neutral-200 bg-white text-neutral-800",
      )}
    >
      {icon && (
        <span className="text-xl leading-none" aria-hidden>
          {icon}
        </span>
      )}
      <span className="flex-1 text-sm font-medium sm:text-base">{label}</span>
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
          selected
            ? "border-primary bg-primary text-white"
            : "border-neutral-300 bg-transparent text-transparent",
        )}
      >
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
    </button>
  );
}
