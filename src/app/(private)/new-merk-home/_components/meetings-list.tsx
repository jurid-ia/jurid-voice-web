"use client";

import { cn } from "@/utils/cn";
import {
  AlertCircle,
  CalendarX2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Radio,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useMeetingsStore } from "../_context/meetings-store";
import { Meeting, MeetingStatus, Participant } from "../_types";

type FilterKey = "today" | "tomorrow" | "thisWeek";

const filters: { key: FilterKey; label: string }[] = [
  { key: "today", label: "Hoje" },
  { key: "tomorrow", label: "Amanhã" },
  { key: "thisWeek", label: "Essa Semana" },
];

const statusConfig: Record<
  MeetingStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  scheduled: {
    label: "Agendada",
    className: "bg-[#AB8E63]/10 text-[#8f7652] border-[#AB8E63]/30",
    icon: Clock,
  },
  live: {
    label: "Ao vivo",
    className: "bg-red-50 text-red-700 border-red-300",
    icon: Radio,
  },
  processed: {
    label: "Processada",
    className: "bg-emerald-50 text-emerald-700 border-emerald-300",
    icon: CheckCircle2,
  },
  unprocessed: {
    label: "Não processada",
    className: "bg-amber-50 text-amber-700 border-amber-300",
    icon: AlertCircle,
  },
};

function formatMeetingDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOfDay = (dt: Date) => {
    const x = new Date(dt);
    x.setHours(0, 0, 0, 0);
    return x;
  };
  const diffDays = Math.round(
    (startOfDay(d).getTime() - startOfDay(now).getTime()) / 86400000,
  );
  const time = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (diffDays === 0) return `Hoje às ${time}`;
  if (diffDays === 1) return `Amanhã às ${time}`;
  if (diffDays === -1) return `Ontem às ${time}`;
  if (diffDays > 1 && diffDays <= 7) {
    const weekday = d.toLocaleDateString("pt-BR", { weekday: "short" });
    return `${weekday} às ${time}`;
  }
  return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} · ${time}`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ParticipantAvatars({ participants }: { participants: Participant[] }) {
  const visible = participants.slice(0, 3);
  const extra = participants.length - visible.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((p, i) => (
        <div
          key={p.id}
          title={p.name}
          style={{ zIndex: visible.length - i }}
          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-stone-300 to-stone-400 text-[9px] font-bold text-white shadow-sm"
        >
          {initials(p.name)}
        </div>
      ))}
      {extra > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-stone-100 text-[9px] font-bold text-gray-600 shadow-sm">
          +{extra}
        </div>
      )}
    </div>
  );
}

function MeetingCard({
  meeting,
  onClick,
}: {
  meeting: Meeting;
  onClick?: (m: Meeting) => void;
}) {
  const status = statusConfig[meeting.status];
  const StatusIcon = status.icon;
  const firstNames = meeting.participants
    .slice(0, 2)
    .map((p) => p.name.split(" ")[0])
    .join(", ");
  const extraNames =
    meeting.participants.length > 2
      ? ` +${meeting.participants.length - 2}`
      : "";

  return (
    <button
      type="button"
      onClick={() => onClick?.(meeting)}
      className={cn(
        "group relative flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-3.5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#AB8E63]/40 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:border-[#AB8E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30",
        meeting.status === "live" && "ring-2 ring-red-400/30",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
            status.className,
          )}
        >
          <StatusIcon
            className={cn(
              "h-2.5 w-2.5",
              meeting.status === "live" && "animate-pulse",
            )}
          />
          {status.label}
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-[#AB8E63]" />
      </div>

      <p className="line-clamp-2 text-sm font-semibold text-gray-800">
        {meeting.title}
      </p>

      <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
        <Clock className="h-3 w-3" />
        <span>{formatMeetingDate(meeting.start)}</span>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2 border-t border-stone-100 pt-2">
        <div className="flex min-w-0 items-center gap-2">
          <ParticipantAvatars participants={meeting.participants} />
          <span className="truncate text-[11px] text-gray-500">
            {firstNames}
            {extraNames}
          </span>
        </div>
        {meeting.participants.length > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-[10px] text-gray-400">
            <Users className="h-3 w-3" />
            {meeting.participants.length}
          </span>
        )}
      </div>
    </button>
  );
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface MeetingsListProps {
  className?: string;
  onMeetingClick?: (meeting: Meeting) => void;
}

export function MeetingsList({ className, onMeetingClick }: MeetingsListProps) {
  const { meetings } = useMeetingsStore();
  const [filter, setFilter] = useState<FilterKey>("today");

  const { today, tomorrow, thisWeek } = useMemo(() => {
    const now = new Date();
    const todayRef = new Date(now);
    todayRef.setHours(0, 0, 0, 0);

    const tomorrowRef = new Date(todayRef);
    tomorrowRef.setDate(tomorrowRef.getDate() + 1);

    const weekStart = new Date(todayRef);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const byStart = (a: Meeting, b: Meeting) =>
      new Date(a.start).getTime() - new Date(b.start).getTime();

    const today = meetings
      .filter((m) => isSameDay(new Date(m.start), todayRef))
      .sort(byStart);
    const tomorrow = meetings
      .filter((m) => isSameDay(new Date(m.start), tomorrowRef))
      .sort(byStart);
    const thisWeek = meetings
      .filter((m) => {
        const d = new Date(m.start);
        return d >= weekStart && d < weekEnd;
      })
      .sort(byStart);

    return { today, tomorrow, thisWeek };
  }, [meetings]);

  const counts: Record<FilterKey, number> = {
    today: today.length,
    tomorrow: tomorrow.length,
    thisWeek: thisWeek.length,
  };

  const current: Meeting[] =
    filter === "today" ? today : filter === "tomorrow" ? tomorrow : thisWeek;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Reuniões</h2>
          <p className="text-xs text-gray-500">
            Visualização rápida de agendadas e passadas
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 p-0.5">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-all",
              filter === f.key
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700",
            )}
          >
            {f.label}
            <span className="rounded-full bg-stone-200 px-1.5 text-[10px] font-semibold text-gray-600">
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="-mx-2 -my-2 max-h-[560px] overflow-y-auto px-2 py-2">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {current.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 py-10 text-gray-400">
              <CalendarX2 className="h-8 w-8" />
              <p className="text-xs">Nenhuma reunião neste filtro</p>
            </div>
          ) : (
            current.map((m) => (
              <MeetingCard key={m.id} meeting={m} onClick={onMeetingClick} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
