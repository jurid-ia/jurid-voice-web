"use client";

import { cn } from "@/utils/cn";
import { MeetingSource } from "../_types";

const labels: Record<MeetingSource, string> = {
  google: "Google",
  teams: "Teams",
  juridia: "JuridIA",
};

const styles: Record<MeetingSource, string> = {
  google: "bg-blue-50 text-blue-700 border-blue-200",
  teams: "bg-violet-50 text-violet-700 border-violet-200",
  juridia: "bg-[#AB8E63]/10 text-[#8f7652] border-[#AB8E63]/30",
};

export function MeetingSourceBadge({
  source,
  className,
}: {
  source: MeetingSource;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        styles[source],
        className,
      )}
    >
      {labels[source]}
    </span>
  );
}
