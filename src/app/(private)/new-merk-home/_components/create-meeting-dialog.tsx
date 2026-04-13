"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarPlus, Mic, X } from "lucide-react";

interface CreateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetDate: Date | null;
  onStartInstant: () => void;
  onSchedule: () => void;
}

export function CreateMeetingDialog({
  open,
  onOpenChange,
  targetDate,
  onStartInstant,
  onSchedule,
}: CreateMeetingDialogProps) {
  const dateLabel = targetDate
    ? format(targetDate, "d 'de' MMMM", { locale: ptBR })
    : "";

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm" />
        <DialogPrimitive.Content
          data-lenis-prevent
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-[9999] w-[92vw] max-w-md -translate-x-[50%] -translate-y-[50%] rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <DialogPrimitive.Title className="text-lg font-bold text-stone-800">
                Nova reunião
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-xs text-stone-500">
                {targetDate
                  ? `Como quer proceder para ${dateLabel}?`
                  : "Como quer proceder?"}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close
              className="flex h-7 w-7 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onStartInstant();
              }}
              className="group flex flex-col items-start gap-2 rounded-xl border-2 border-stone-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#AB8E63] hover:bg-[#AB8E63]/5 hover:shadow-md focus-visible:border-[#AB8E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#AB8E63] to-[#8f7652] text-white shadow-md shadow-[#AB8E63]/30">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">
                  Iniciar agora
                </p>
                <p className="mt-0.5 text-[11px] text-stone-500">
                  Gravar uma reunião instantânea
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onSchedule();
              }}
              className="group flex flex-col items-start gap-2 rounded-xl border-2 border-stone-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#AB8E63] hover:bg-[#AB8E63]/5 hover:shadow-md focus-visible:border-[#AB8E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-[#8f7652]">
                <CalendarPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800">Agendar</p>
                <p className="mt-0.5 text-[11px] text-stone-500">
                  Criar um compromisso futuro
                </p>
              </div>
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
