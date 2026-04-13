import { MeetingBriefing } from "../_types";

// Briefings pré-meeting: bullet points + resumo da última reunião com o mesmo contato.
// Em produção, isto viria do backend (gerado a partir da transcrição anterior).
export const briefingsMock: Record<string, MeetingBriefing> = {
  "meet-001": {
    meetingId: "meet-001",
    bullets: [
      "Cliente solicitou ajustes nas cláusulas 5 e 7 do contrato principal.",
      "Prazo de entrega da minuta revisada: 3 dias úteis a partir da última conversa.",
      "Pendente: confirmar se o cliente recebeu o parecer técnico enviado por e-mail.",
      "Estratégia alinhada: priorizar acordo extrajudicial antes de seguir para audiência.",
      "Cliente mencionou preocupação com prazos do juizado — tranquilizar sobre cronograma.",
    ],
    lastMeetingSummary: {
      title: "Primeira consulta — Caso Silva vs. Construtora",
      date: "há 5 dias",
      mediaType: "video",
      durationSeconds: 42 * 60,
    },
  },
  "meet-002": {
    meetingId: "meet-002",
    bullets: [
      "Contrato de aquisição do imóvel em fase final de revisão.",
      "Cliente pediu para verificar cláusula de rescisão antecipada (item 12).",
      "Documentação do vendedor recebida — validar certidões negativas.",
      "Pendente: agendar vistoria técnica antes da assinatura.",
    ],
    lastMeetingSummary: {
      title: "Revisão inicial — Imóvel Oliveira",
      date: "há 8 dias",
      mediaType: "audio",
      durationSeconds: 38 * 60,
    },
  },
  "meet-004": {
    meetingId: "meet-004",
    bullets: [
      "Reunião mensal de acompanhamento com o escritório parceiro.",
      "Último mês fechado com 12 novos processos trabalhistas ativos.",
      "Revisar status dos casos em fase de recurso.",
      "Alinhar divisão de honorários do último trimestre.",
      "Pendente: Pedro enviará planilha consolidada até sexta.",
    ],
    lastMeetingSummary: {
      title: "Reunião mensal — Almeida Associados",
      date: "há 1 mês",
      mediaType: "video",
      durationSeconds: 71 * 60,
    },
  },
  "meet-008": {
    meetingId: "meet-008",
    bullets: [
      "Proposta de acordo apresentada pela parte contrária recebida ontem.",
      "Valor oferecido: 60% do pedido original — avaliar com cliente.",
      "Prazo para resposta formal: 7 dias corridos.",
      "Dra. Beatriz sugere contraproposta em 80% com parcelamento.",
    ],
    lastMeetingSummary: {
      title: "Alinhamento de estratégia — Caso Lima",
      date: "há 12 dias",
      mediaType: "audio",
      durationSeconds: 55 * 60,
    },
  },
  "meet-009": {
    meetingId: "meet-009",
    bullets: [
      "Primeira reunião formal com a Empresa XYZ (novo cliente).",
      "Apresentar o escopo do atendimento e o fluxo de onboarding.",
      "Coletar documentação básica: contrato social, procurações, CNPJ.",
      "Entender as principais dores jurídicas que motivaram a contratação.",
    ],
  },
  "meet-010": {
    meetingId: "meet-010",
    bullets: [
      "Audiência de instrução marcada — presença obrigatória.",
      "Revisar perguntas para testemunhas arroladas.",
      "Preparar documentação probatória (conjunto B).",
      "Cliente deve chegar 30 minutos antes para briefing rápido.",
    ],
    lastMeetingSummary: {
      title: "Preparação para audiência — Caso Mendes",
      date: "há 3 dias",
      mediaType: "video",
      durationSeconds: 65 * 60,
    },
  },
  "meet-011": {
    meetingId: "meet-011",
    bullets: [
      "Revisão dos resultados do trimestre.",
      "Discussão sobre metas e expansão da equipe.",
      "Alinhamento de prioridades para o próximo trimestre.",
    ],
  },
  "meet-012": {
    meetingId: "meet-012",
    bullets: [
      "Consultoria tributária sobre reestruturação da holding.",
      "Analisar vantagens de migração de regime tributário.",
      "Cliente trará simulação feita pelo contador parceiro.",
    ],
    lastMeetingSummary: {
      title: "Levantamento tributário inicial",
      date: "há 2 semanas",
      mediaType: "audio",
      durationSeconds: 48 * 60,
    },
  },
};

// Fallback genérico para reuniões sem briefing cadastrado
export const genericBriefing: MeetingBriefing = {
  meetingId: "generic",
  bullets: [
    "Revisar os principais pontos discutidos na última conversa com este contato.",
    "Confirmar se há pendências do lado do cliente antes de iniciar a reunião.",
    "Alinhar expectativas sobre os próximos passos.",
    "Ter em mãos os documentos relacionados ao caso.",
  ],
};

export function getBriefingForMeeting(meetingId: string): MeetingBriefing {
  return briefingsMock[meetingId] ?? genericBriefing;
}
