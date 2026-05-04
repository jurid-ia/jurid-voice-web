"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Flame,
  Handshake,
  Minus,
  Smile,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { MerkRecording, SentimentType } from "../mock/recording";
import { GlassCard, Pill, SectionHeader } from "./shared";

const SENTIMENT_META: Record<
  SentimentType,
  { label: string; color: string; ring: string; icon: typeof Smile }
> = {
  positive: {
    label: "Positivo",
    color: "text-emerald-600",
    ring: "stroke-emerald-500",
    icon: Smile,
  },
  neutral: {
    label: "Neutro",
    color: "text-slate-600",
    ring: "stroke-slate-400",
    icon: Minus,
  },
  tense: {
    label: "Tenso",
    color: "text-rose-600",
    ring: "stroke-rose-500",
    icon: Flame,
  },
  mixed: {
    label: "Misto",
    color: "text-amber-600",
    ring: "stroke-amber-500",
    icon: TrendingUp,
  },
};

export function AnalysisTab({ recording }: { recording: MerkRecording }) {
  const meta = SENTIMENT_META[recording.sentiment.type];
  const SIcon = meta.icon;
  const scorePct = Math.min(100, Math.max(0, (recording.sentiment.score / 1000) * 100));
  const maxTopicCount = Math.max(...recording.topics.map((t) => t.count));

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - scorePct / 100);

  return (
    <div className="flex flex-col gap-6">
      <GlassCard className="from-primary/5 via-white to-white bg-gradient-to-br">
        <SectionHeader
          eyebrow="Sentimento geral"
          title="Como a reunião foi emocionalmente"
        />
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="relative flex shrink-0 items-center justify-center">
            <svg width="180" height="180" className="-rotate-90">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-gray-100"
              />
              <motion.circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                className={meta.ring}
                initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <SIcon className={cn("mb-1 h-5 w-5", meta.color)} />
              <span className="text-3xl leading-none font-bold text-gray-900">
                {recording.sentiment.score}
              </span>
              <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                de 1000
              </span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <Pill tone={recording.sentiment.type === "positive" ? "success" : recording.sentiment.type === "tense" ? "danger" : recording.sentiment.type === "mixed" ? "warning" : "neutral"}>
              <SIcon className="h-3 w-3" />
              {meta.label}
            </Pill>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-700">
              {recording.sentiment.justification}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {recording.interruptionFlag && (
                <Pill tone="warning">
                  <AlertTriangle className="h-3 w-3" />
                  Muitas interrupções
                </Pill>
              )}
              {recording.urgencyFlags.length > 0 && (
                <Pill tone="danger">
                  <Zap className="h-3 w-3" />
                  {recording.urgencyFlags.length} sinal{recording.urgencyFlags.length > 1 ? "is" : ""} de urgência
                </Pill>
              )}
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
          <SectionHeader
            eyebrow="Momentos de tensão"
            title="Onde surgiu conflito ou resistência"
          />
          <div className="flex flex-col gap-3">
            {recording.conflicts.length === 0 && (
              <EmptyState label="Nenhum momento de conflito detectado." />
            )}
            {recording.conflicts.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-xl border border-rose-100 bg-rose-50/40 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[11px] font-semibold text-rose-700">
                    {c.timestamp}
                  </span>
                  {c.resolved ? (
                    <Pill tone="success">
                      <CheckCircle2 className="h-3 w-3" />
                      Resolvido
                    </Pill>
                  ) : (
                    <Pill tone="danger">Em aberto</Pill>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">{c.summary}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {c.participants.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-rose-700 ring-1 ring-rose-100"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                {c.resolution && (
                  <p className="mt-2 border-t border-rose-100 pt-2 text-xs text-gray-600 italic">
                    {c.resolution}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Consenso"
            title="O que todos concordaram"
          />
          <div className="flex flex-col gap-3">
            {recording.consensus.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Handshake className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{c.topic}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-emerald-700">
                      {c.timestamp}
                    </span>
                    <Pill tone={c.firmness === "explicit" ? "success" : "neutral"}>
                      {c.firmness === "explicit" ? "Explícito" : "Implícito"}
                    </Pill>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

      <GlassCard>
        <SectionHeader
          eyebrow="Tópicos recorrentes"
          title="O que dominou a pauta real"
          description="Frequência de menções — pode diferir da pauta planejada"
        />
        <div className="flex flex-col gap-3">
          {recording.topics.map((t, idx) => {
            const pct = (t.count / maxTopicCount) * 100;
            return (
              <div key={t.topic} className="group">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{t.topic}</span>
                  <span className="text-primary font-mono text-xs font-bold">
                    {t.count}×
                  </span>
                </div>
                <div className="relative h-6 overflow-hidden rounded-lg bg-gray-50">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: idx * 0.06, duration: 0.7, ease: "easeOut" }}
                    className="from-primary to-primary/70 h-full rounded-lg bg-gradient-to-r"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {recording.urgencyFlags.length > 0 && (
        <GlassCard className="border-rose-100 bg-rose-50/30">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-rose-800 uppercase">
                Linguagem de urgência
              </p>
              <p className="text-sm font-semibold text-rose-900">
                Trechos que indicam pressão
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {recording.urgencyFlags.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-rose-100 bg-white p-3"
              >
                <p className="text-sm text-gray-700 italic">"{f.phrase}"</p>
                <span className="font-mono text-[11px] font-semibold text-rose-700">
                  {f.timestamp}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
      {label}
    </div>
  );
}
