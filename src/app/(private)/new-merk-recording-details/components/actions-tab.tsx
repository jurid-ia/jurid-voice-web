"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  CircleDashed,
  CircleDot,
  DollarSign,
  Gavel,
  Loader2,
  Plus,
  User,
  X,
} from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import toast from "react-hot-toast";
import type { MerkRecording, TaskStatus } from "../mock/recording";
import {
  GlassCard,
  Pill,
  SectionHeader,
  formatCurrencyBRL,
  formatDateShort,
} from "./shared";

const TASK_STATUS_META: Record<
  TaskStatus,
  {
    label: string;
    icon: typeof CircleDashed;
    tone: "default" | "info" | "success";
    ring: string;
  }
> = {
  pending: {
    label: "Pendente",
    icon: CircleDashed,
    tone: "default",
    ring: "text-gray-400",
  },
  in_progress: {
    label: "Em andamento",
    icon: Loader2,
    tone: "info",
    ring: "text-sky-500",
  },
  done: {
    label: "Concluída",
    icon: CheckCircle2,
    tone: "success",
    ring: "text-emerald-500",
  },
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  pending: "in_progress",
  in_progress: "done",
  done: "pending",
};

export function ActionsTab({
  recording,
  setRecording,
}: {
  recording: MerkRecording;
  setRecording: Dispatch<SetStateAction<MerkRecording>>;
}) {
  const financialTasks = useMemo(
    () => recording.tasks.filter((t) => t.financial),
    [recording.tasks],
  );

  const cycleTaskStatus = (taskId: string) => {
    setRecording((r) => ({
      ...r,
      tasks: r.tasks.map((t) =>
        t.id === taskId ? { ...t, status: NEXT_STATUS[t.status] } : t,
      ),
    }));
  };

  const confirmDecision = (decisionId: string) => {
    setRecording((r) => ({
      ...r,
      decisions: r.decisions.map((d) =>
        d.id === decisionId ? { ...d, status: "confirmed" } : d,
      ),
    }));
    toast.success("Decisão confirmada");
  };

  const dismissDecision = (decisionId: string) => {
    setRecording((r) => ({
      ...r,
      decisions: r.decisions.filter((d) => d.id !== decisionId),
    }));
    toast.success("Decisão descartada");
  };

  const stats = [
    {
      label: "Decisões",
      value: recording.decisions.length,
      icon: Gavel,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Tarefas ativas",
      value: recording.tasks.filter((t) => t.status !== "done").length,
      icon: CircleDot,
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Concluídas",
      value: recording.tasks.filter((t) => t.status === "done").length,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Compromissos $",
      value: financialTasks.length,
      icon: DollarSign,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <GlassCard className="flex items-center gap-3 p-4" hoverable>
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", s.color)}>
                <s.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                  {s.label}
                </p>
                <p className="text-xl leading-none font-bold text-gray-900">{s.value}</p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard>
          <SectionHeader
            eyebrow="Decisões tomadas"
            title="O que foi efetivamente decidido"
            description="Aprovações e definições durante a reunião"
          />
          <div className="flex flex-col gap-3">
            {recording.decisions.length === 0 && (
              <EmptyBlock label="Nenhuma decisão registrada." />
            )}
            {recording.decisions.map((d, idx) => {
              const isPending = d.status === "pending_confirmation";
              return (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border p-4 transition-all",
                    isPending
                      ? "border-amber-200 bg-amber-50/40"
                      : "border-emerald-100 bg-emerald-50/30",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        {isPending ? (
                          <Pill tone="warning">
                            <AlertCircle className="h-3 w-3" />A confirmar
                          </Pill>
                        ) : (
                          <Pill tone="success">
                            <CheckCircle2 className="h-3 w-3" />
                            Confirmada
                          </Pill>
                        )}
                      </div>
                      <p className="text-[15px] leading-snug font-semibold text-gray-900">
                        {d.what}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600">
                        <User className="h-3 w-3" />
                        <span className="font-medium">{d.by}</span>
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-gray-500 italic">
                        {d.context}
                      </p>
                    </div>
                  </div>
                  {isPending && (
                    <div className="mt-3 flex items-center gap-2 border-t border-amber-100 pt-3">
                      <button
                        onClick={() => confirmDecision(d.id)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white transition hover:bg-emerald-700"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Confirmar
                      </button>
                      <button
                        onClick={() => dismissDecision(d.id)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <X className="h-3.5 w-3.5" />
                        Descartar
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Tarefas & compromissos"
            title="Quem faz o quê e até quando"
            description="Clique no status para atualizar o progresso"
            right={
              <button
                onClick={() => toast("Abrir criação de tarefa (mock)")}
                className="border-primary/20 text-primary hover:bg-primary/5 inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova
              </button>
            }
          />
          <div className="flex flex-col gap-2">
            {recording.tasks.map((task, idx) => {
              const meta = TASK_STATUS_META[task.status];
              const StatusIcon = meta.icon;
              const isDone = task.status === "done";
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={cn(
                    "group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-black/5 hover:bg-gray-50/60",
                    isDone && "opacity-70",
                  )}
                >
                  <button
                    onClick={() => cycleTaskStatus(task.id)}
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95",
                      meta.ring,
                    )}
                    aria-label="Alterar status"
                  >
                    <StatusIcon
                      className={cn(
                        "h-5 w-5",
                        task.status === "in_progress" && "animate-spin",
                      )}
                    />
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm font-medium text-gray-900",
                        isDone && "text-gray-500 line-through",
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Pill tone="neutral">
                        <User className="h-3 w-3" />
                        {task.owner}
                      </Pill>
                      {task.hasSpecificDate && task.dueDate ? (
                        <Pill tone="info">
                          <Calendar className="h-3 w-3" />
                          {formatDateShort(task.dueDate)}
                        </Pill>
                      ) : (
                        <Pill tone="warning">
                          <AlertCircle className="h-3 w-3" />
                          Sem prazo definido
                        </Pill>
                      )}
                      {task.financial && (
                        <Pill tone="primary">
                          <DollarSign className="h-3 w-3" />
                          {formatCurrencyBRL(task.financial.amount)}
                        </Pill>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

      {financialTasks.length > 0 && (
        <GlassCard className="from-primary/5 to-primary/10 bg-gradient-to-br">
          <SectionHeader
            eyebrow="Compromissos financeiros"
            title="Valores, condições e prazos mencionados"
            description="Destacados separadamente para revisão do time comercial"
          />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {financialTasks.map((t) => (
              <div
                key={t.id}
                className="border-primary/15 relative overflow-hidden rounded-xl border bg-white p-4"
              >
                <div className="text-primary absolute top-0 right-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-current/10 to-transparent" />
                <div className="relative">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-primary text-[11px] font-semibold tracking-wider uppercase">
                      Valor
                    </span>
                    <span className="text-xs text-gray-500">{t.owner}</span>
                  </div>
                  <p className="text-primary mt-1 text-2xl font-bold">
                    {formatCurrencyBRL(t.financial!.amount)}
                  </p>
                  {t.financial!.condition && (
                    <p className="mt-1 text-xs font-medium text-gray-600">
                      {t.financial!.condition}
                    </p>
                  )}
                  <p className="mt-3 border-t border-gray-100 pt-3 text-sm text-gray-700">
                    {t.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function EmptyBlock({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
      {label}
    </div>
  );
}
