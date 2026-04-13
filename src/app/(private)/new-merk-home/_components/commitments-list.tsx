"use client";

import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Inbox,
  Link2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Undo2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { commitmentsMock } from "../_mocks/commitments";
import {
  Commitment,
  CommitmentDirection,
  CommitmentPriority,
  CommitmentStatus,
} from "../_types";
import { CommitmentEditDialog } from "./commitment-edit-dialog";

const priorityStyles: Record<CommitmentPriority, string> = {
  high: "bg-rose-50 text-rose-700 border-rose-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-600 border-slate-200",
};
const priorityLabels: Record<CommitmentPriority, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

const statusStyles: Record<CommitmentStatus, string> = {
  pending: "bg-blue-50 text-blue-700 border-blue-200",
  done: "bg-emerald-50 text-emerald-700 border-emerald-200",
  overdue: "bg-rose-100 text-rose-800 border-rose-300",
};
const statusLabels: Record<CommitmentStatus, string> = {
  pending: "Pendente",
  done: "Concluído",
  overdue: "Atrasado",
};

function formatDueLabel(iso: string, status: CommitmentStatus): string {
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

  if (status === "done") {
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  if (diffDays < -1) return `${Math.abs(diffDays)}d atrás`;
  if (diffDays > 1 && diffDays <= 7) return `em ${diffDays}d`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function CommitmentRow({
  commitment,
  onToggleDone,
  onEdit,
  onDelete,
}: {
  commitment: Commitment;
  onToggleDone: (id: string) => void;
  onEdit: (c: Commitment) => void;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDone = commitment.status === "done";
  const isOverdue = commitment.status === "overdue";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative flex items-start gap-3 rounded-xl border bg-white p-3.5 transition-all hover:border-[#AB8E63]/40 hover:shadow-sm",
        isOverdue ? "border-rose-200/70" : "border-stone-200",
        isDone && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={() => onToggleDone(commitment.id)}
        aria-label={isDone ? "Marcar como pendente" : "Marcar como concluído"}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          isDone
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-stone-300 hover:border-[#AB8E63]",
        )}
      >
        {isDone && <Check className="h-3 w-3" strokeWidth={3} />}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm font-semibold text-gray-800",
              isDone && "line-through",
            )}
          >
            {commitment.title}
          </p>
          <span
            className={cn(
              "shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-medium",
              priorityStyles[commitment.priority],
            )}
          >
            {priorityLabels[commitment.priority]}
          </span>
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1 font-medium text-gray-600">
            {commitment.direction === "outgoing" ? (
              <ArrowUpRight className="h-3 w-3 text-[#AB8E63]" />
            ) : (
              <ArrowDownLeft className="h-3 w-3 text-blue-500" />
            )}
            {commitment.counterpart.name}
          </span>
          <span className="text-gray-300">•</span>
          <span
            className={cn(
              "flex items-center gap-1",
              isOverdue ? "font-semibold text-rose-700" : "text-gray-500",
            )}
          >
            <Clock className="h-3 w-3" />
            {formatDueLabel(commitment.dueDate, commitment.status)}
          </span>
          <span className="text-gray-300">•</span>
          <span
            className={cn(
              "rounded-md border px-1.5 py-0.5 font-medium",
              statusStyles[commitment.status],
            )}
          >
            {statusLabels[commitment.status]}
          </span>
          {commitment.sourceMeetingTitle && (
            <>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 text-gray-400">
                <Link2 className="h-3 w-3" />
                <span className="max-w-[200px] truncate">
                  {commitment.sourceMeetingTitle}
                </span>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          onBlur={() => setTimeout(() => setMenuOpen(false), 150)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-stone-100 hover:text-gray-700"
          aria-label="Ações"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-8 z-10 flex w-40 flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-lg"
            >
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onToggleDone(commitment.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-stone-50"
              >
                {isDone ? (
                  <>
                    <Undo2 className="h-3.5 w-3.5" />
                    Reabrir
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Concluir
                  </>
                )}
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onEdit(commitment);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-stone-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onDelete(commitment.id);
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 border-t border-stone-100 px-3 py-2 text-left text-xs text-rose-600 transition-colors hover:bg-rose-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Excluir
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function CommitmentsList({ className }: { className?: string }) {
  const [items, setItems] = useState<Commitment[]>(commitmentsMock);
  const [tab, setTab] = useState<CommitmentDirection>("outgoing");
  const [editing, setEditing] = useState<Commitment | null>(null);

  const { outgoing, incoming, overdueCount } = useMemo(() => {
    const outgoing = items.filter((c) => c.direction === "outgoing");
    const incoming = items.filter((c) => c.direction === "incoming");
    const overdueCount = {
      outgoing: outgoing.filter((c) => c.status === "overdue").length,
      incoming: incoming.filter((c) => c.status === "overdue").length,
    };
    return { outgoing, incoming, overdueCount };
  }, [items]);

  const visible = tab === "outgoing" ? outgoing : incoming;
  const sorted = useMemo(
    () =>
      [...visible].sort((a, b) => {
        const statusRank = { overdue: 0, pending: 1, done: 2 };
        const r = statusRank[a.status] - statusRank[b.status];
        if (r !== 0) return r;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }),
    [visible],
  );

  const handleToggleDone = (id: string) => {
    setItems((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.status === "done") {
          const isPast = new Date(c.dueDate).getTime() < Date.now();
          return { ...c, status: isPast ? "overdue" : "pending" };
        }
        return { ...c, status: "done" };
      }),
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm("Excluir este compromisso?")) return;
    setItems((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEditSave = (patch: Partial<Commitment>) => {
    if (!editing) return;
    setItems((prev) =>
      prev.map((c) => (c.id === editing.id ? { ...c, ...patch } : c)),
    );
    setEditing(null);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">Compromissos</h2>
          <p className="text-xs text-gray-500">
            Extraídos automaticamente das reuniões processadas
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 p-0.5">
        <button
          type="button"
          onClick={() => setTab("outgoing")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            tab === "outgoing"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Pedi
          <span className="rounded-full bg-stone-200 px-1.5 text-[10px] font-semibold text-gray-600">
            {outgoing.length}
          </span>
          {overdueCount.outgoing > 0 && (
            <span className="rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
              {overdueCount.outgoing}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab("incoming")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
            tab === "incoming"
              ? "bg-white text-gray-800 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          <ArrowDownLeft className="h-3.5 w-3.5" />
          Me pediram
          <span className="rounded-full bg-stone-200 px-1.5 text-[10px] font-semibold text-gray-600">
            {incoming.length}
          </span>
          {overdueCount.incoming > 0 && (
            <span className="rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white">
              {overdueCount.incoming}
            </span>
          )}
        </button>
      </div>

      <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {sorted.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-2 py-10 text-gray-400"
            >
              <Inbox className="h-8 w-8" />
              <p className="text-xs">Nenhum compromisso aqui</p>
            </motion.div>
          ) : (
            sorted.map((c) => (
              <CommitmentRow
                key={c.id}
                commitment={c}
                onToggleDone={handleToggleDone}
                onEdit={setEditing}
                onDelete={handleDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      <CommitmentEditDialog
        open={editing !== null}
        onOpenChange={(o) => !o && setEditing(null)}
        commitment={editing}
        onSave={handleEditSave}
      />
    </div>
  );
}
