"use client";

import { SearchableSelect } from "@/app/(private)/quiz/components/searchable-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/blocks/dialog";
import { useEffect, useState } from "react";
import { Commitment, CommitmentPriority } from "../_types";
import { DatePicker } from "./date-picker";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commitment: Commitment | null;
  onSave: (patch: Partial<Commitment>) => void;
}

const priorityOptions = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
];

export function CommitmentEditDialog({
  open,
  onOpenChange,
  commitment,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<CommitmentPriority>("medium");

  useEffect(() => {
    if (commitment) {
      setTitle(commitment.title);
      setDescription(commitment.description ?? "");
      setDueDate(new Date(commitment.dueDate));
      setPriority(commitment.priority);
    }
  }, [commitment]);

  if (!commitment) return null;

  const handleSave = () => {
    if (!dueDate) return;
    const next = new Date(dueDate);
    next.setHours(17, 0, 0, 0);
    onSave({
      title: title.trim() || commitment.title,
      description: description.trim(),
      dueDate: next.toISOString(),
      priority,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-lenis-prevent className="p-6">
        <DialogHeader>
          <DialogTitle>Editar compromisso</DialogTitle>
          <DialogDescription>
            Altere os dados e salve. Os dados são apenas mock por enquanto.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600">Título</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#AB8E63] focus:ring-2 focus:ring-[#AB8E63]/20"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-gray-600">Descrição</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-[#AB8E63] focus:ring-2 focus:ring-[#AB8E63]/20"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-600">Prazo</span>
              <DatePicker value={dueDate} onChange={setDueDate} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-gray-600">
                Prioridade
              </span>
              <SearchableSelect
                options={priorityOptions}
                value={priority}
                onChange={(v) => setPriority(v as CommitmentPriority)}
                placeholder="Selecionar prioridade"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-stone-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-[#AB8E63] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#8f7652]"
          >
            Salvar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
