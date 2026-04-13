"use client";

import { cn } from "@/utils/cn";
import { format, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, CheckCircle2, Clock, Radio } from "lucide-react";
import { useMemo } from "react";
import { Meeting, MeetingStatus } from "../_types";

const statusStyles: Record<MeetingStatus, string> = {
  scheduled: "border-l-[#AB8E63] bg-[#AB8E63]/5 hover:bg-[#AB8E63]/10",
  live: "border-l-red-500 bg-red-50 hover:bg-red-100 ring-1 ring-red-300/40",
  processed: "border-l-emerald-600 bg-emerald-50 hover:bg-emerald-100",
  unprocessed: "border-l-amber-500 bg-amber-50 hover:bg-amber-100",
};

const statusIcons: Record<
  MeetingStatus,
  React.ComponentType<{ className?: string }>
> = {
  scheduled: Clock,
  live: Radio,
  processed: CheckCircle2,
  unprocessed: AlertCircle,
};

const statusIconClass: Record<MeetingStatus, string> = {
  scheduled: "text-[#8f7652]",
  live: "text-red-600 animate-pulse",
  processed: "text-emerald-700",
  unprocessed: "text-amber-700",
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function WeekEventCard({
  meeting,
  onClick,
}: {
  meeting: Meeting;
  onClick?: (meeting: Meeting) => void;
}) {
  const start = new Date(meeting.start);
  const end = new Date(meeting.end);
  const Icon = statusIcons[meeting.status];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(meeting);
      }}
      className={cn(
        "flex w-full flex-col gap-1 rounded-md border-l-[3px] px-2 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30",
        statusStyles[meeting.status],
      )}
      title={meeting.title}
    >
      <div className="flex items-center gap-1 text-[10px] font-semibold text-gray-600">
        <Icon className={cn("h-2.5 w-2.5", statusIconClass[meeting.status])} />
        {format(start, "HH:mm")} — {format(end, "HH:mm")}
      </div>
      <p className="line-clamp-2 text-[11px] font-semibold leading-tight text-gray-800">
        {meeting.title}
      </p>
      {meeting.participants.length > 0 && (
        <p className="truncate text-[10px] text-gray-500">
          {meeting.participants
            .slice(0, 2)
            .map((p) => p.name.split(" ")[0])
            .join(", ")}
          {meeting.participants.length > 2
            ? ` +${meeting.participants.length - 2}`
            : ""}
        </p>
      )}
    </button>
  );
}

interface DayColumnProps {
  date: Date;
  meetings: Meeting[];
  isToday: boolean;
  onMeetingClick?: (meeting: Meeting) => void;
  onEmptySlotClick?: (date: Date) => void;
}

function DayColumn({
  date,
  meetings,
  isToday,
  onMeetingClick,
  onEmptySlotClick,
}: DayColumnProps) {
  const dayEvents = meetings
    .filter((m) => isSameDay(new Date(m.start), date))
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

  return (
    <div
      className={cn(
        "flex min-h-[420px] cursor-pointer flex-col rounded-xl border bg-white transition-colors hover:border-[#AB8E63]/60",
        isToday ? "border-[#AB8E63]/60 shadow-md" : "border-stone-200",
      )}
      onClick={() => onEmptySlotClick?.(date)}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-t-xl border-b px-2 py-2",
          isToday
            ? "border-[#AB8E63]/30 bg-[#AB8E63]/10"
            : "border-stone-200 bg-stone-50/60",
        )}
      >
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider",
            isToday ? "text-[#8f7652]" : "text-gray-500",
          )}
        >
          {format(date, "EEE", { locale: ptBR })}
        </span>
        <span
          className={cn(
            "text-lg font-bold leading-none",
            isToday ? "text-[#8f7652]" : "text-gray-700",
          )}
        >
          {format(date, "dd")}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-1.5">
        {dayEvents.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1 py-4 text-stone-300">
            <span className="text-lg">+</span>
            <span className="text-[9px] uppercase tracking-wider">
              Adicionar
            </span>
          </div>
        ) : (
          dayEvents.map((m) => (
            <WeekEventCard key={m.id} meeting={m} onClick={onMeetingClick} />
          ))
        )}
      </div>

      {dayEvents.length > 0 && (
        <div className="border-t border-stone-100 px-2 py-1 text-center">
          <span className="text-[9px] font-medium uppercase tracking-wider text-gray-400">
            {dayEvents.length} evento{dayEvents.length > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}

interface CalendarWeekViewProps {
  currentDate: Date;
  meetings: Meeting[];
  onMeetingClick?: (meeting: Meeting) => void;
  onEmptySlotClick?: (date: Date) => void;
}

export function CalendarWeekView({
  currentDate,
  meetings,
  onMeetingClick,
  onEmptySlotClick,
}: CalendarWeekViewProps) {
  const today = new Date();
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [currentDate]);

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {weekDays.map((d) => (
        <DayColumn
          key={d.toISOString()}
          date={d}
          meetings={meetings}
          isToday={isSameDay(d, today)}
          onMeetingClick={onMeetingClick}
          onEmptySlotClick={onEmptySlotClick}
        />
      ))}
    </div>
  );
}
