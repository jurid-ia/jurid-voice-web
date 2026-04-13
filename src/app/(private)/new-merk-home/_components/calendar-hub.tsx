"use client";

import { cn } from "@/utils/cn";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Radio,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  EventProps,
  View,
  Views,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useMeetingsStore } from "../_context/meetings-store";
import { Meeting } from "../_types";
import { CalendarDayView } from "./calendar-day-view";
import "./calendar-styles.css";
import { CalendarWeekView } from "./calendar-week-view";

const locales = { "pt-BR": ptBR };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 0 }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Meeting;
}

const statusStyles: Record<Meeting["status"], string> = {
  scheduled: "bg-[#AB8E63]/90 text-white border-l-4 border-[#6f5a3d]",
  live: "bg-red-500 text-white border-l-4 border-red-700 animate-pulse",
  processed: "bg-emerald-600/90 text-white border-l-4 border-emerald-800",
  unprocessed: "bg-amber-500/90 text-white border-l-4 border-amber-700",
};

const statusIcons: Record<
  Meeting["status"],
  React.ComponentType<{ className?: string }>
> = {
  scheduled: Clock,
  live: Radio,
  processed: CheckCircle2,
  unprocessed: AlertCircle,
};

function EventBlock({ event }: EventProps<CalendarEvent>) {
  const meeting = event.resource;
  const Icon = statusIcons[meeting.status];
  return (
    <div
      className={cn(
        "flex h-full items-start gap-1 overflow-hidden rounded-md px-1.5 py-1 text-[11px] leading-tight shadow-sm",
        statusStyles[meeting.status],
      )}
      title={meeting.title}
    >
      <Icon className="mt-0.5 h-3 w-3 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-semibold">{meeting.title}</span>
        <span className="truncate text-[10px] opacity-90">
          {format(event.start, "HH:mm")} · {meeting.source}
        </span>
      </div>
    </div>
  );
}

interface ToolbarProps {
  currentDate: Date;
  view: View;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
  onView: (v: View) => void;
}

function CalendarToolbar({
  currentDate,
  view,
  onNavigate,
  onView,
}: ToolbarProps) {
  const label = useMemo(() => {
    if (view === Views.DAY) {
      return format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR });
    }
    if (view === Views.WEEK) {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${format(start, "d 'de' MMM", { locale: ptBR })} — ${format(end, "d 'de' MMM, yyyy", { locale: ptBR })}`;
    }
    return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  }, [currentDate, view]);

  const views: { key: View; label: string }[] = [
    { key: Views.DAY, label: "Dia" },
    { key: Views.WEEK, label: "Semana" },
    { key: Views.MONTH, label: "Mês" },
  ];

  return (
    <div className="flex flex-col gap-3 border-b border-stone-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate("TODAY")}
          className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-stone-50"
        >
          Hoje
        </button>
        <div className="flex items-center overflow-hidden rounded-lg border border-stone-200 bg-white">
          <button
            type="button"
            onClick={() => onNavigate("PREV")}
            className="p-1.5 text-gray-600 transition-colors hover:bg-stone-50"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("NEXT")}
            className="border-l border-stone-200 p-1.5 text-gray-600 transition-colors hover:bg-stone-50"
            aria-label="Próximo"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <h3 className="ml-1 text-sm font-semibold capitalize text-gray-800">
          {label}
        </h3>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-white p-0.5">
        {views.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => onView(v.key)}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition-all",
              view === v.key
                ? "bg-[#AB8E63] text-white shadow-sm"
                : "text-gray-600 hover:bg-stone-50",
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function UpcomingBanner({ meetings }: { meetings: Meeting[] }) {
  const now = new Date();
  const next = meetings
    .filter((m) => new Date(m.start) > now && m.status === "scheduled")
    .sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
    )[0];

  if (!next) return null;

  const diffMs = new Date(next.start).getTime() - now.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const inText =
    diffMin < 60
      ? `em ${diffMin} min`
      : diffMin < 1440
        ? `em ${Math.floor(diffMin / 60)}h`
        : `em ${Math.floor(diffMin / 1440)}d`;

  return (
    <div className="flex items-center gap-3 border-b border-stone-200 bg-gradient-to-r from-[#AB8E63]/10 via-[#AB8E63]/5 to-transparent px-4 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#AB8E63] shadow-sm shadow-[#AB8E63]/30">
        <Clock className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-gray-800">
          Próxima reunião {inText}: {next.title}
        </p>
        <p className="text-[11px] text-gray-500">
          {format(new Date(next.start), "HH:mm", { locale: ptBR })} —{" "}
          {format(new Date(next.end), "HH:mm", { locale: ptBR })} ·{" "}
          {next.participants.map((p) => p.name).join(", ")}
        </p>
      </div>
    </div>
  );
}

function CalendarLegend() {
  const items: {
    label: string;
    dotClass: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { label: "Agendada", dotClass: "bg-[#AB8E63]", icon: Circle },
    { label: "Ao vivo", dotClass: "bg-red-500", icon: Circle },
    { label: "Processada", dotClass: "bg-emerald-600", icon: Circle },
    { label: "Não processada", dotClass: "bg-amber-500", icon: Circle },
  ];
  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-stone-200 px-4 py-2.5">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full", it.dotClass)} />
          <span className="text-[11px] text-gray-600">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

interface CalendarHubProps {
  className?: string;
  onMeetingClick?: (meeting: Meeting) => void;
  onEmptySlotClick?: (date: Date) => void;
}

export function CalendarHub({
  className,
  onMeetingClick,
  onEmptySlotClick,
}: CalendarHubProps) {
  const { meetings } = useMeetingsStore();
  const [view, setView] = useState<View>(Views.DAY);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const events = useMemo<CalendarEvent[]>(
    () =>
      meetings.map((m) => ({
        id: m.id,
        title: m.title,
        start: new Date(m.start),
        end: new Date(m.end),
        resource: m,
      })),
    [meetings],
  );

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    const d = new Date(currentDate);
    if (action === "TODAY") {
      setCurrentDate(new Date());
      return;
    }
    const delta = action === "NEXT" ? 1 : -1;
    if (view === Views.DAY) d.setDate(d.getDate() + delta);
    else if (view === Views.WEEK) d.setDate(d.getDate() + 7 * delta);
    else if (view === Views.MONTH) d.setMonth(d.getMonth() + delta);
    else d.setDate(d.getDate() + delta);
    setCurrentDate(d);
  };

  const showCustomView = view === Views.DAY || view === Views.WEEK;

  return (
    <div
      className={cn(
        "nmh-calendar flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm",
        className,
      )}
    >
      <CalendarToolbar
        currentDate={currentDate}
        view={view}
        onNavigate={handleNavigate}
        onView={setView}
      />
      <UpcomingBanner meetings={meetings} />

      {showCustomView ? (
        <div className="flex-1 p-4">
          {view === Views.DAY && (
            <CalendarDayView
              currentDate={currentDate}
              meetings={meetings}
              onMeetingClick={onMeetingClick}
              onEmptySlotClick={onEmptySlotClick}
            />
          )}
          {view === Views.WEEK && (
            <CalendarWeekView
              currentDate={currentDate}
              meetings={meetings}
              onMeetingClick={onMeetingClick}
              onEmptySlotClick={onEmptySlotClick}
            />
          )}
        </div>
      ) : (
        <div className="min-h-[560px] flex-1 p-3">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={currentDate}
            onNavigate={(d) => setCurrentDate(d)}
            views={[Views.DAY, Views.WEEK, Views.MONTH]}
            components={{ event: EventBlock }}
            selectable
            onSelectEvent={(evt) => onMeetingClick?.(evt.resource)}
            onSelectSlot={(slot) => onEmptySlotClick?.(slot.start as Date)}
            onDrillDown={(d) => {
              setCurrentDate(d);
              setView(Views.DAY);
            }}
            culture="pt-BR"
            messages={{
              today: "Hoje",
              previous: "Anterior",
              next: "Próximo",
              month: "Mês",
              week: "Semana",
              day: "Dia",
              date: "Data",
              time: "Hora",
              event: "Reunião",
              noEventsInRange: "Nenhuma reunião no período",
              showMore: (total) => `+${total} mais`,
            }}
            step={30}
            timeslots={2}
            min={new Date(0, 0, 0, 7, 0, 0)}
            max={new Date(0, 0, 0, 21, 0, 0)}
            style={{ height: 560 }}
          />
        </div>
      )}

      <CalendarLegend />
    </div>
  );
}
