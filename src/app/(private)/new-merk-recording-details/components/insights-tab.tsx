"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  AlertOctagon,
  ArrowRight,
  Brain,
  Briefcase,
  Check,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  Rocket,
  Settings,
  ShieldAlert,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import type {
  InsightSeverity,
  MerkRecording,
  NextStepType,
} from "../mock/recording";
import { GlassCard, Pill, SectionHeader } from "./shared";

const SEVERITY_META: Record<
  InsightSeverity,
  { label: string; tone: "warning" | "danger" | "neutral" }
> = {
  low: { label: "Baixo", tone: "neutral" },
  medium: { label: "Médio", tone: "warning" },
  high: { label: "Alto", tone: "danger" },
};

const NEXT_STEP_META: Record<
  NextStepType,
  { label: string; icon: typeof MessageCircle; color: string; bg: string }
> = {
  communication: {
    label: "Comunicação",
    icon: MessageCircle,
    color: "text-sky-700",
    bg: "bg-sky-50 border-sky-100",
  },
  operational: {
    label: "Operacional",
    icon: Settings,
    color: "text-violet-700",
    bg: "bg-violet-50 border-violet-100",
  },
  commercial: {
    label: "Comercial",
    icon: Briefcase,
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-100",
  },
};

export function InsightsTab({
  recording,
  setRecording,
}: {
  recording: MerkRecording;
  setRecording: Dispatch<SetStateAction<MerkRecording>>;
}) {
  const dismissQuestion = (id: string) => {
    setRecording((r) => ({
      ...r,
      unansweredQuestions: r.unansweredQuestions.map((q) =>
        q.id === id ? { ...q, dismissed: !q.dismissed } : q,
      ),
    }));
  };

  const dismissRisk = (id: string) => {
    setRecording((r) => ({
      ...r,
      risks: r.risks.filter((x) => x.id !== id),
    }));
    toast.success("Risco marcado como endereçado");
  };

  const convertOpportunity = (title: string) => {
    toast.success(`Oportunidade enviada ao pipeline: ${title}`);
  };

  const activeQuestions = recording.unansweredQuestions.filter((q) => !q.dismissed);

  return (
    <div className="flex flex-col gap-6">
      <GlassCard className="relative overflow-hidden">
        <div className="bg-primary/5 absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="relative flex items-start gap-4">
          <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-primary text-[11px] font-semibold tracking-wider uppercase">
              Inteligência da reunião
            </p>
            <h2 className="text-lg font-bold text-gray-900">
              5 ângulos estratégicos extraídos pela IA
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              Oportunidades, riscos, perguntas abertas, próximos passos e padrões de
              comportamento — tudo que você precisa para o próximo movimento.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard>
          <SectionHeader
            eyebrow="Oportunidades"
            title="Onde existe espaço para avançar"
            right={
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Rocket className="h-4 w-4" />
              </div>
            }
          />
          <div className="flex flex-col gap-3">
            {recording.opportunities.map((o, idx) => (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white p-4 transition-all hover:shadow-[0_10px_30px_-18px_rgba(5,150,105,0.3)]"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-gray-900">
                      {o.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {o.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-emerald-700 italic">
                        {o.source}
                      </span>
                      <button
                        onClick={() => convertOpportunity(o.title)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        Enviar ao pipeline
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <SectionHeader
            eyebrow="Riscos e alertas"
            title="O que pode dar errado"
            right={
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <ShieldAlert className="h-4 w-4" />
              </div>
            }
          />
          <div className="flex flex-col gap-3">
            {recording.risks.length === 0 && (
              <div className="rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 p-6 text-center">
                <Check className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                <p className="text-sm font-semibold text-emerald-800">
                  Todos os riscos endereçados
                </p>
              </div>
            )}
            {recording.risks.map((r, idx) => {
              const meta = SEVERITY_META[r.severity];
              return (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group rounded-xl border border-rose-100 bg-gradient-to-br from-rose-50/40 to-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertOctagon className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[15px] font-semibold text-gray-900">
                          {r.title}
                        </p>
                        <Pill tone={meta.tone}>{meta.label}</Pill>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">
                        {r.description}
                      </p>
                      <button
                        onClick={() => dismissRisk(r.id)}
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 opacity-0 transition-opacity group-hover:opacity-100 hover:text-rose-900"
                      >
                        <Check className="h-3 w-3" />
                        Marcar como endereçado
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </GlassCard>

      <GlassCard>
        <SectionHeader
          eyebrow="Perguntas sem resposta"
          title="O que precisa ser endereçado no próximo contato"
          description={`${activeQuestions.length} pendente${activeQuestions.length !== 1 ? "s" : ""}`}
          right={
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <HelpCircle className="h-4 w-4" />
            </div>
          }
        />
        <div className="flex flex-col gap-2">
          {recording.unansweredQuestions.map((q) => (
            <div
              key={q.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3 transition-all",
                q.dismissed
                  ? "border-gray-100 bg-gray-50/60 opacity-50"
                  : "border-amber-100 bg-amber-50/30",
              )}
            >
              <HelpCircle
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  q.dismissed ? "text-gray-400" : "text-amber-600",
                )}
              />
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium text-gray-900",
                    q.dismissed && "text-gray-500 line-through",
                  )}
                >
                  {q.question}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-500">
                  Levantada por {q.raisedBy}
                </p>
              </div>
              <button
                onClick={() => dismissQuestion(q.id)}
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition",
                  q.dismissed
                    ? "border-gray-200 bg-white text-gray-400 hover:border-amber-200 hover:text-amber-600"
                    : "border-amber-200 bg-white text-amber-700 hover:bg-amber-100",
                )}
                title={q.dismissed ? "Reabrir" : "Marcar como resolvida"}
              >
                {q.dismissed ? <X className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <SectionHeader
          eyebrow="Próximos passos sugeridos"
          title="O que faz mais sentido acontecer a seguir"
          right={
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Target className="h-4 w-4" />
            </div>
          }
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {(Object.keys(NEXT_STEP_META) as NextStepType[]).map((type) => {
            const meta = NEXT_STEP_META[type];
            const MIcon = meta.icon;
            const items = recording.suggestedNextSteps.filter((s) => s.type === type);
            if (items.length === 0) return null;
            return (
              <div
                key={type}
                className={cn("rounded-xl border p-4", meta.bg)}
              >
                <div className={cn("mb-3 flex items-center gap-2", meta.color)}>
                  <MIcon className="h-4 w-4" />
                  <span className="text-[11px] font-semibold tracking-wider uppercase">
                    {meta.label}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-start gap-2 rounded-lg bg-white/70 p-2.5"
                    >
                      <ArrowRight className={cn("mt-0.5 h-3 w-3 shrink-0", meta.color)} />
                      <span className="text-xs leading-relaxed text-gray-700">
                        {s.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="from-primary/5 to-white bg-gradient-to-br">
        <SectionHeader
          eyebrow="Padrões de comportamento"
          title="O que chamou atenção na dinâmica"
          right={
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <Lightbulb className="h-4 w-4" />
            </div>
          }
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {recording.behaviorPatterns.map((b, idx) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="border-primary/10 rounded-xl border bg-white p-4"
            >
              <div className="bg-primary/10 text-primary mb-2 flex h-8 w-8 items-center justify-center rounded-lg">
                <span className="text-xs font-bold">{idx + 1}</span>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">{b.observation}</p>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
