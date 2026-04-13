"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowRight, FileAudio, Users } from "lucide-react";
import Link from "next/link";
import { processedRecordingsMock } from "../_mocks/recordings";
import { ProcessedRecording } from "../_types";

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `há ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `há ${diffH} h`;
  const diffD = Math.floor(diffH / 24);
  return `há ${diffD} d`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest === 0 ? `${h}h` : `${h}h ${rest}m`;
}

function RecordingRow({
  recording,
  delay,
}: {
  recording: ProcessedRecording;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay }}
    >
      <Link
        href={`#rec-${recording.id}`}
        className="group flex items-center justify-between gap-3 rounded-xl border border-stone-100 bg-white p-3 transition-all hover:border-[#AB8E63]/40 hover:bg-stone-50/60 hover:shadow-sm focus-visible:border-[#AB8E63] focus-visible:bg-stone-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30"
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#AB8E63] to-[#8f7652] shadow-sm shadow-[#AB8E63]/20">
            <FileAudio className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-800">
              {recording.title}
            </p>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
              <span className="truncate">{recording.clientName}</span>
              <span className="text-gray-300">•</span>
              <span className="shrink-0">{formatDuration(recording.durationSeconds)}</span>
              <span className="text-gray-300">•</span>
              <span className="flex shrink-0 items-center gap-1">
                <Users className="h-3 w-3" />
                {recording.participantsCount}
              </span>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-xs text-gray-400 sm:inline">
            {formatRelativeTime(recording.processedAt)}
          </span>
          <ArrowRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#AB8E63]" />
        </div>
      </Link>
    </motion.div>
  );
}

export function RecentRecordings({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            Gravações processadas recentemente
          </h2>
          <p className="text-xs text-gray-500">
            Acesso rápido às últimas transcrições disponíveis
          </p>
        </div>
        <Link
          href="#all-recordings"
          className="flex items-center gap-1 text-xs font-medium text-[#AB8E63] transition-colors hover:text-[#8f7652]"
        >
          Ver todas
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        {processedRecordingsMock.map((recording, idx) => (
          <RecordingRow
            key={recording.id}
            recording={recording}
            delay={idx * 0.05}
          />
        ))}
      </div>
    </div>
  );
}
