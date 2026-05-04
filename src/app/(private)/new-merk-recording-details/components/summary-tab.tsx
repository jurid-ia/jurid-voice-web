"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Copy,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import type { MerkRecording, ObjectiveStatus } from "../mock/recording";
import {
  GlassCard,
  Pill,
  SectionHeader,
  formatDuration,
} from "./shared";

const OBJECTIVE_META: Record<
  ObjectiveStatus,
  { label: string; tone: "success" | "warning" | "danger"; icon: typeof CheckCircle2 }
> = {
  achieved: { label: "Objetivo atingido", tone: "success", icon: CheckCircle2 },
  partial: { label: "Parcialmente atingido", tone: "warning", icon: TrendingUp },
  missed: { label: "Não atingido", tone: "danger", icon: Target },
};

export function SummaryTab({ recording }: { recording: MerkRecording }) {
  const [copied, setCopied] = useState(false);
  const meta = OBJECTIVE_META[recording.objectiveStatus];
  const Icon = meta.icon;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recording.executiveSummary);
      setCopied(true);
      toast.success("Resumo copiado para a área de transferência");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const stats = [
    {
      icon: Clock,
      label: "Duração",
      value: formatDuration(recording.durationSeconds),
    },
    {
      icon: Users,
      label: "Participantes",
      value: `${recording.participantsCount} pessoas`,
    },
    {
      icon: Target,
      label: "Objetivo",
      value: meta.label,
      tone: meta.tone,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard className="flex items-center gap-4" hoverable>
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-xl",
                  "tone" in s && s.tone === "success" && "bg-emerald-50 text-emerald-600",
                  "tone" in s && s.tone === "warning" && "bg-amber-50 text-amber-600",
                  "tone" in s && s.tone === "danger" && "bg-rose-50 text-rose-600",
                  !("tone" in s) && "bg-primary/10 text-primary",
                )}
              >
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                  {s.label}
                </p>
                <p className="truncate text-base font-bold text-gray-900">
                  {s.value}
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <GlassCard className="overflow-hidden">
        <SectionHeader
          eyebrow="Síntese executiva"
          title="O que você precisa saber em 20 segundos"
          description="Gerado pela IA com base na transcrição completa"
          right={
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                copied
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-primary/20 text-primary hover:bg-primary/5",
              )}
            >
              {copied ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copied ? "Copiado" : "Copiar"}
            </button>
          }
        />
        <div className="prose prose-sm max-w-none">
          <p className="text-[15px] leading-relaxed text-gray-700">
            {recording.executiveSummary}
          </p>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Objetivo original da reunião
            </p>
            <p className="mt-0.5 text-sm text-amber-800/90">
              {recording.objective}
            </p>
            <Pill tone={meta.tone} className="mt-2">
              {meta.label}
            </Pill>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <SectionHeader
          eyebrow="Pontos-chave"
          title="Linha do tempo da reunião"
          description="Os assuntos principais, em ordem cronológica"
        />
        <div className="relative">
          <div className="bg-primary/15 absolute top-1 bottom-1 left-[14px] w-[2px] rounded-full" />
          <ol className="flex flex-col gap-4">
            {recording.keyPoints.map((kp, idx) => (
              <motion.li
                key={kp.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="relative flex items-start gap-4 pl-0"
              >
                <div className="bg-primary ring-primary/15 relative z-10 mt-1 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ring-4">
                  {idx + 1}
                </div>
                <div className="flex-1 pt-0.5">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-primary font-mono text-[11px] font-semibold">
                      {kp.time}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-700">
                    {kp.text}
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </GlassCard>
    </div>
  );
}
