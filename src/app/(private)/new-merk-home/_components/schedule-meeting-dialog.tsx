"use client";

import { SearchableSelect } from "@/app/(private)/quiz/components/searchable-select";
import { cn } from "@/utils/cn";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Mic, Video, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useMeetingsStore } from "../_context/meetings-store";
import { clientsRegistryMock } from "../_mocks/clients";
import { Meeting } from "../_types";
import { DatePicker } from "./date-picker";

interface ScheduleMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate: Date | null;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function toTimeInput(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ScheduleMeetingDialog({
  open,
  onOpenChange,
  initialDate,
}: ScheduleMeetingDialogProps) {
  const { addMeeting } = useMeetingsStore();

  const defaults = useMemo(() => {
    const base = initialDate ? new Date(initialDate) : new Date();
    if (base.getHours() === 0) base.setHours(10, 0, 0, 0);
    const end = new Date(base);
    end.setHours(end.getHours() + 1);
    return {
      date: base,
      startTime: toTimeInput(base),
      endTime: toTimeInput(end),
    };
  }, [initialDate]);

  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState<string>("");
  const [date, setDate] = useState<Date | null>(defaults.date);
  const [startTime, setStartTime] = useState(defaults.startTime);
  const [endTime, setEndTime] = useState(defaults.endTime);
  const [consultationType, setConsultationType] =
    useState<"IN_PERSON" | "ONLINE">("IN_PERSON");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle("");
      setClientId("");
      setDate(defaults.date);
      setStartTime(defaults.startTime);
      setEndTime(defaults.endTime);
      setConsultationType("IN_PERSON");
      setError(null);
    }
  }, [open, defaults]);

  const clientOptions = useMemo(
    () =>
      clientsRegistryMock.map((c) => ({
        value: c.id,
        label: c.name,
        sublabel: c.company,
      })),
    [],
  );

  const handleSave = () => {
    if (!title.trim()) {
      setError("Informe um título para a reunião.");
      return;
    }
    if (!clientId) {
      setError("Selecione um contato.");
      return;
    }
    if (!date) {
      setError("Selecione uma data.");
      return;
    }
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const start = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      sh,
      sm,
      0,
      0,
    );
    const end = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      eh,
      em,
      0,
      0,
    );
    if (end <= start) {
      setError("O horário final deve ser depois do horário inicial.");
      return;
    }

    const client = clientsRegistryMock.find((c) => c.id === clientId);
    const newMeeting: Meeting = {
      id: `meet-new-${Date.now()}`,
      title: title.trim(),
      start: start.toISOString(),
      end: end.toISOString(),
      source: "juridia",
      status: "scheduled",
      clientId,
      participants: client
        ? [
            { id: `p-${clientId}`, name: client.name },
            { id: "p-me", name: "Você" },
          ]
        : [{ id: "p-me", name: "Você" }],
    };

    addMeeting(newMeeting);
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content
          data-lenis-prevent
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[9999] max-h-[92vh] w-[92vw] max-w-lg -translate-x-[50%] -translate-y-[50%] overflow-y-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <DialogPrimitive.Title className="text-lg font-bold text-stone-800">
                Agendar reunião
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs text-stone-500">
                Crie um compromisso futuro que aparecerá no calendário
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              className="flex h-7 w-7 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-stone-600">
                Título
              </span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Alinhamento inicial — Caso Silva"
                className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#AB8E63] focus:ring-2 focus:ring-[#AB8E63]/30"
              />
            </label>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-stone-600">
                Contato
              </span>
              <SearchableSelect
                options={clientOptions}
                value={clientId}
                onChange={setClientId}
                placeholder="Selecione um contato"
                searchPlaceholder="Buscar contato..."
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-stone-600">
                Data
              </span>
              <DatePicker value={date} onChange={setDate} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-stone-600">
                  Início
                </span>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#AB8E63] focus:ring-2 focus:ring-[#AB8E63]/30"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-stone-600">
                  Fim
                </span>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#AB8E63] focus:ring-2 focus:ring-[#AB8E63]/30"
                />
              </label>
            </div>

            <div>
              <span className="mb-1.5 block text-[11px] font-medium text-stone-600">
                Tipo
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConsultationType("IN_PERSON")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all",
                    consultationType === "IN_PERSON"
                      ? "border-[#AB8E63] bg-[#AB8E63]/10 text-[#8f7652]"
                      : "border-stone-300 text-stone-700 hover:border-[#AB8E63]/60",
                  )}
                >
                  <Mic className="h-4 w-4" />
                  Presencial
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType("ONLINE")}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-medium transition-all",
                    consultationType === "ONLINE"
                      ? "border-[#AB8E63] bg-[#AB8E63]/10 text-[#8f7652]"
                      : "border-stone-300 text-stone-700 hover:border-[#AB8E63]/60",
                  )}
                >
                  <Video className="h-4 w-4" />
                  Online
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-gradient-to-r from-[#AB8E63] to-[#8f7652] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#AB8E63]/25 transition-all hover:shadow-[#AB8E63]/40 active:scale-[0.98]"
              >
                Agendar
              </button>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
