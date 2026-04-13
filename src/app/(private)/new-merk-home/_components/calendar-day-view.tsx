"use client";

import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  CalendarX2,
  CheckCircle2,
  Clock,
  Radio,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { Meeting, MeetingStatus } from "../_types";

const statusConfig: Record<
  MeetingStatus,
  {
    label: string;
    cardClass: string;
    barClass: string;
    pillClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  scheduled: {
    label: "Agendada",
    cardClass: "border-stone-200",
    barClass: "bg-[#AB8E63]",
    pillClass: "bg-[#AB8E63]/10 text-[#8f7652] border-[#AB8E63]/30",
    icon: Clock,
  },
  live: {
    label: "Ao vivo",
    cardClass: "border-red-200 ring-2 ring-red-400/25",
    barClass: "bg-red-500",
    pillClass: "bg-red-50 text-red-700 border-red-300",
    icon: Radio,
  },
  processed: {
    label: "Processada",
    cardClass: "border-emerald-200",
    barClass: "bg-emerald-600",
    pillClass: "bg-emerald-50 text-emerald-700 border-emerald-300",
    icon: CheckCircle2,
  },
  unprocessed: {
    label: "Não processada",
    cardClass: "border-amber-200",
    barClass: "bg-amber-500",
    pillClass: "bg-amber-50 text-amber-700 border-amber-300",
    icon: AlertCircle,
  },
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function durationLabel(start: Date, end: Date): string {
  const ms = end.getTime() - start.getTime();
  const mins = Math.round(ms / 60000);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const rest = mins % 60;
  return rest === 0 ? `${h}h` : `${h}h ${rest}m`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function DayEventCard({
  meeting,
  onClick,
}: {
  meeting: Meeting;
  onClick?: (meeting: Meeting) => void;
}) {
  const start = new Date(meeting.start);
  const end = new Date(meeting.end);
  const cfg = statusConfig[meeting.status];
  const StatusIcon = cfg.icon;

  return (
    <button
      type="button"
      onClick={() => onClick?.(meeting)}
      className={cn(
        "group relative flex w-full gap-3 overflow-hidden rounded-xl border bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30",
        cfg.cardClass,
      )}
    >
      <div className={cn("w-1 shrink-0 rounded-full", cfg.barClass)} />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-gray-700">
            <Clock className="h-3 w-3 text-gray-400" />
            {format(start, "HH:mm")} — {format(end, "HH:mm")}
          </span>
          <span className="text-[11px] text-gray-400">
            · {durationLabel(start, end)}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
              cfg.pillClass,
            )}
          >
            <StatusIcon
              className={cn(
                "h-2.5 w-2.5",
                meeting.status === "live" && "animate-pulse",
              )}
            />
            {cfg.label}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-gray-800">{meeting.title}</h3>

        {meeting.description && (
          <p className="text-xs text-gray-500">{meeting.description}</p>
        )}

        <div className="flex items-center gap-2 border-t border-stone-100 pt-2">
          <div className="flex items-center -space-x-1.5">
            {meeting.participants.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                title={p.name}
                style={{ zIndex: 4 - i }}
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-stone-300 to-stone-400 text-[9px] font-bold text-white shadow-sm"
              >
                {initials(p.name)}
              </div>
            ))}
            {meeting.participants.length > 4 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-stone-100 text-[9px] font-bold text-gray-600 shadow-sm">
                +{meeting.participants.length - 4}
              </div>
            )}
          </div>
          <span className="truncate text-[11px] text-gray-500">
            {meeting.participants.map((p) => p.name).join(", ")}
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-1 text-[10px] text-gray-400">
            <Users className="h-3 w-3" />
            {meeting.participants.length}
          </span>
        </div>
      </div>
    </button>
  );
}

interface CalendarDayViewProps {
  currentDate: Date;
  meetings: Meeting[];
  onMeetingClick?: (meeting: Meeting) => void;
  onEmptySlotClick?: (date: Date) => void;
}

export function CalendarDayView({
  currentDate,
  meetings,
  onMeetingClick,
  onEmptySlotClick,
}: CalendarDayViewProps) {
  const events = useMemo(() => {
    return meetings
      .filter((m) => isSameDay(new Date(m.start), currentDate))
      .sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );
  }, [currentDate, meetings]);

  if (events.length === 0) {
    return (
      <button
        type="button"
        onClick={() => onEmptySlotClick?.(currentDate)}
        className="flex min-h-[400px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-stone-200 bg-stone-50/30 p-10 text-center transition-colors hover:border-[#AB8E63]/50 hover:bg-[#AB8E63]/5 focus-visible:border-[#AB8E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30"
      >
        <CalendarX2 className="h-10 w-10 text-stone-300" />
        <div>
          <p className="text-sm font-medium text-gray-600">
            Nenhuma reunião em {format(currentDate, "d 'de' MMMM", { locale: ptBR })}
          </p>
          <p className="text-xs text-gray-400">
            Clique para iniciar uma gravação ou agendar uma reunião
          </p>
        </div>
      </button>
    );
  }

  return (
    <div
      className="flex flex-col gap-3"
      onClick={(e) => {
        if (e.target === e.currentTarget) onEmptySlotClick?.(currentDate);
      }}
    >
      {events.map((m) => (
        <DayEventCard key={m.id} meeting={m} onClick={onMeetingClick} />
      ))}
      <button
        type="button"
        onClick={() => onEmptySlotClick?.(currentDate)}
        className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-stone-200 bg-stone-50/30 px-4 py-3 text-xs text-gray-400 transition-colors hover:border-[#AB8E63]/50 hover:bg-[#AB8E63]/5 hover:text-[#8f7652] focus-visible:border-[#AB8E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30"
      >
        + Iniciar ou agendar uma reunião
      </button>
    </div>
  );
}
