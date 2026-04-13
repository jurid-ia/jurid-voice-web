"use client";

import { Button } from "@/components/ui/blocks/button";
import { motion } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import {
  companySizeOptions,
  finalValueOptions,
  postMeetingIssuesOptions,
  roleOptions,
  sectorQuestions,
  toolsOptions,
} from "../data";
import { generatePersona, getSectorLabel } from "../persona";
import type { QuizState } from "../types";

interface QuizResultProps {
  state: QuizState;
  onRestart: () => void;
}

function findLabel(
  list: { value: string; label: string }[],
  value: string,
): string {
  return list.find((o) => o.value === value)?.label ?? "—";
}

function findLabels(
  list: { value: string; label: string }[],
  values: string[],
): string {
  if (!values.length) return "—";
  return values.map((v) => findLabel(list, v)).join(", ");
}

export function QuizResult({ state, onRestart }: QuizResultProps) {
  const persona = generatePersona(state);
  const sectorLabel = getSectorLabel(state.sector);
  const sectorQs = state.sector ? sectorQuestions[state.sector] : [];

  const q6 = sectorQs.find((q) => q.key === "q6");
  const q7 = sectorQs.find((q) => q.key === "q7");
  const q8 = sectorQs.find((q) => q.key === "q8");

  const q6Label = q6
    ? state.q6 === "other"
      ? `Outro: ${state.q6Other || "—"}`
      : findLabel(q6.options, state.q6)
    : "—";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-4xl space-y-6 py-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" /> MODO DEV — RESULTADO CAPTURADO
          </span>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-900">
            Resultado do Quiz
          </h1>
          <p className="text-sm text-neutral-500">
            Dados mock salvos em estado. Nada foi enviado para API.
          </p>
        </div>
        <Button variant="outline" color="primary" onClick={onRestart}>
          <RotateCcw className="mr-2 h-4 w-4" /> Refazer
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <DataCard title="Nome / Empresa / Localização">
          <Row label="Nome" value={state.name || "—"} />
          <Row label="Empresa" value={state.company || "—"} />
          <Row
            label="Localização"
            value={
              state.city || state.state
                ? `${state.city || "—"} / ${state.state || "—"}`
                : "—"
            }
          />
        </DataCard>

        <DataCard title="Setor + Especificidade">
          <Row label="Setor" value={sectorLabel} />
          {state.sector === "other" && state.sectorOther && (
            <Row label="Descrição" value={state.sectorOther} />
          )}
          {q6 && <Row label={q6.title} value={q6Label} />}
          {q7 && <Row label={q7.title} value={findLabel(q7.options, state.q7)} />}
          {q8 && <Row label={q8.title} value={findLabel(q8.options, state.q8)} />}
        </DataCard>

        <DataCard title="Tamanho da Empresa">
          <Row
            label="Tamanho"
            value={findLabel(companySizeOptions, state.companySize)}
          />
        </DataCard>

        <DataCard title="Papel na Hierarquia">
          <Row label="Papel" value={findLabel(roleOptions, state.role)} />
        </DataCard>

        <DataCard title="Tipo de Cliente / Interlocutor">
          <Row
            label="Interlocutor principal"
            value={q7 ? findLabel(q7.options, state.q7) : "—"}
          />
        </DataCard>

        <DataCard title="Dores Específicas do Setor">
          <Row
            label="Maior desafio/dor"
            value={q8 ? findLabel(q8.options, state.q8) : "—"}
          />
        </DataCard>

        <DataCard title="Hábitos Atuais de Organização">
          <Row
            label="Ferramentas"
            value={findLabels(toolsOptions, state.tools)}
          />
          {state.tools.includes("other") && state.toolsOther && (
            <Row label="Outro" value={state.toolsOther} />
          )}
        </DataCard>

        <DataCard title="Dor Principal Pós-Reunião">
          <Row
            label="Selecionadas"
            value={findLabels(postMeetingIssuesOptions, state.postMeetingIssues)}
          />
        </DataCard>

        <DataCard title="Valor Percebido Prioritário" full>
          <Row
            label="Valor mais importante"
            value={findLabel(finalValueOptions, state.finalValue)}
          />
        </DataCard>
      </section>

      <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-white to-primary/10 p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-neutral-900">
            → Persona Gerada
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Tom dos insights
            </p>
            <p className="mt-1 text-base font-medium capitalize text-neutral-900">
              {persona.tone}
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              {persona.toneDescription}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Linguagem ajustada ao setor
            </p>
            <p className="mt-1 text-sm text-neutral-700">
              {persona.sectorLanguage}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Submenus com maior peso
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {persona.highlightedSubmenus.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Ações práticas sugeridas
            </p>
            <ul className="mt-2 space-y-1 text-sm text-neutral-700">
              {persona.priorityActions.map((a) => (
                <li key={a} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <details className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-xs">
        <summary className="cursor-pointer font-semibold text-neutral-700">
          Ver estado cru (debug)
        </summary>
        <pre className="mt-3 overflow-auto text-[11px] text-neutral-600">
          {JSON.stringify({ state, persona }, null, 2)}
        </pre>
      </details>
    </motion.div>
  );
}

function DataCard({
  title,
  children,
  full,
}: {
  title: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm ${
        full ? "md:col-span-2" : ""
      }`}
    >
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium text-neutral-400">{label}</span>
      <span className="text-sm text-neutral-900">{value}</span>
    </div>
  );
}
