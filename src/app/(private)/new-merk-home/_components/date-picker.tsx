"use client";

import { Calendar } from "@/components/ui/blocks/calendar";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione uma data",
  className,
  buttonClassName,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg border border-stone-300 bg-white px-3 py-2 text-left text-sm text-stone-900 transition-colors hover:border-[#AB8E63]/60 focus-visible:border-[#AB8E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30",
          buttonClassName,
        )}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-stone-500" />
        <span
          className={cn(
            "flex-1 capitalize",
            !value && "text-stone-400",
          )}
        >
          {value
            ? format(value, "EEE, dd MMM yyyy", { locale: ptBR })
            : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-stone-500 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          data-lenis-prevent
          className="absolute top-full left-0 z-50 mt-2 rounded-xl border border-stone-200 bg-white p-2 shadow-xl"
        >
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={(d) => {
              if (d) {
                onChange(d);
                setOpen(false);
              }
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  );
}
