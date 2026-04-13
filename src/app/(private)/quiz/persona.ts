import { sectorOptions } from "./data";
import type { Persona, QuizState, Sector, Tone } from "./types";

const toneBySector: Record<Sector, Tone> = {
  law: "formal",
  accounting: "formal",
  consulting: "consultivo",
  leadership: "consultivo",
  hr: "consultivo",
  sales: "direto",
  tech: "direto",
  logistics: "direto",
  design: "criativo",
  marketing: "criativo",
  other: "consultivo",
};

const toneDescriptions: Record<Tone, string> = {
  formal:
    "Linguagem técnica e precisa, com foco em registro e rastreabilidade.",
  consultivo:
    "Tom reflexivo e estratégico, destacando decisões e próximos passos.",
  direto:
    "Objetivo e acionável, priorizando clareza e velocidade de execução.",
  criativo:
    "Tom leve e inspirador, focando em ideias, feedbacks e alinhamento.",
};

const submenusBySector: Record<Sector, string[]> = {
  sales: [
    "Pipeline & Oportunidades",
    "Follow-ups Automáticos",
    "Decisões do Cliente",
  ],
  marketing: [
    "Briefings & Aprovações",
    "Feedbacks de Campanha",
    "Alinhamento de Time",
  ],
  design: [
    "Registro de Briefing",
    "Histórico de Feedbacks",
    "Decisões Criativas",
  ],
  tech: [
    "Decisões Técnicas",
    "Refinamento & Sprint",
    "Alinhamento com Stakeholders",
  ],
  law: [
    "Anotações de Caso",
    "Prazos & Obrigações",
    "Acordos com Cliente",
  ],
  accounting: [
    "Obrigações Fiscais",
    "Decisões Societárias",
    "Acordos com Cliente",
  ],
  hr: [
    "Feedbacks & PDI",
    "Entrevistas Documentadas",
    "Decisões de Pessoas",
  ],
  logistics: [
    "Ocorrências",
    "Decisões Operacionais",
    "Prazos de Entrega",
  ],
  consulting: [
    "Insights da Reunião",
    "Decisões Estratégicas",
    "Linha do Tempo do Projeto",
  ],
  leadership: [
    "Decisões Estratégicas",
    "Cascateamento para Time",
    "Prioridades",
  ],
  other: ["Resumo de Reunião", "Próximos Passos", "Decisões Importantes"],
};

const actionsByFinalValue: Record<string, string[]> = {
  "never-forget": [
    "Ativar resumo automático ao fim de cada reunião",
    "Lista consolidada de decisões por projeto",
    "Notificação de itens combinados não registrados",
  ],
  "auto-record": [
    "Gerar ata profissional automaticamente",
    "Exportar para PDF ou enviar por e-mail",
    "Template por tipo de reunião",
  ],
  "next-actions": [
    "Lista de próximos passos destacada logo após a reunião",
    "Atribuir responsável e prazo a cada item",
    "Lembrete automático dos itens pendentes",
  ],
  understanding: [
    "Linha do tempo da conversa com tópicos principais",
    "Destacar mudanças de contexto e decisões-chave",
    "Análise de sentimento / tom da reunião",
  ],
  "save-time": [
    "Resumo executivo de 3 linhas",
    "Organização automática por projeto / cliente",
    "Atalho para reenviar anotações a quem faltou",
  ],
};

const sectorLanguageMap: Record<Sector, string> = {
  sales: "Vocabulário comercial: pipeline, lead, oportunidade, ciclo de venda, decisor.",
  marketing: "Vocabulário de marketing: briefing, campanha, KPI, performance, criativo.",
  design: "Vocabulário criativo: briefing, referências, feedback, direção de arte.",
  tech: "Vocabulário técnico: sprint, backlog, refinamento, entrega, stakeholder.",
  law: "Vocabulário jurídico: caso, prazo, obrigação, acordo, parte contrária.",
  accounting: "Vocabulário contábil: obrigação acessória, prazo fiscal, fechamento, auditoria.",
  hr: "Vocabulário de pessoas: feedback, PDI, entrevista, clima, desenvolvimento.",
  logistics: "Vocabulário operacional: rota, ocorrência, prazo, fornecedor, entrega.",
  consulting: "Vocabulário consultivo: diagnóstico, hipótese, stakeholder, entregável.",
  leadership: "Vocabulário executivo: prioridade, direcionamento, OKR, estratégia.",
  other: "Linguagem neutra adaptada ao contexto descrito.",
};

export function generatePersona(state: QuizState): Persona {
  const sector = (state.sector || "other") as Sector;
  const tone = toneBySector[sector];

  return {
    tone,
    toneDescription: toneDescriptions[tone],
    highlightedSubmenus: submenusBySector[sector],
    priorityActions:
      actionsByFinalValue[state.finalValue] ??
      actionsByFinalValue["next-actions"],
    sectorLanguage: sectorLanguageMap[sector],
  };
}

export function getSectorLabel(sector: QuizState["sector"]): string {
  return sectorOptions.find((s) => s.value === sector)?.label ?? "—";
}
