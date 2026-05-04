"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckSquare,
  FileText,
  Lightbulb,
  Users,
  type LucideIcon,
} from "lucide-react";

export type TabKey = "summary" | "actions" | "contacts" | "analysis" | "insights";

interface TabDef {
  key: TabKey;
  label: string;
  icon: LucideIcon;
  hint: string;
}

export const TABS: TabDef[] = [
  { key: "summary", label: "Resumo", icon: FileText, hint: "Síntese e pontos-chave" },
  { key: "actions", label: "Ações", icon: CheckSquare, hint: "Decisões e tarefas" },
  { key: "contacts", label: "Contatos", icon: Users, hint: "Participantes" },
  { key: "analysis", label: "Análise", icon: BarChart3, hint: "Sentimento e consenso" },
  { key: "insights", label: "Insights", icon: Lightbulb, hint: "Oportunidades e riscos" },
];

export function TabNav({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (key: TabKey) => void;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-1 rounded-2xl border border-black/5 bg-white/80 p-1 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(120,90,50,0.12)] backdrop-blur-xl">
      <div
        role="tablist"
        className="scrollbar-hide flex w-full items-stretch gap-1 overflow-x-auto"
      >
        {TABS.map((t) => {
          const isActive = t.key === active;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(t.key)}
              className={cn(
                "group relative flex min-w-fit flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-800",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-active-pill"
                  className="bg-primary/10 absolute inset-0 rounded-xl"
                  transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
