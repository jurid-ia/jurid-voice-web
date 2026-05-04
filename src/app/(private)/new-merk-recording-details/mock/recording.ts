export type ObjectiveStatus = "achieved" | "partial" | "missed";
export type DecisionStatus = "confirmed" | "pending_confirmation";
export type TaskStatus = "pending" | "in_progress" | "done";
export type SentimentType = "positive" | "neutral" | "tense" | "mixed";
export type InsightSeverity = "low" | "medium" | "high";
export type NextStepType = "communication" | "operational" | "commercial";
export type ConsensusFirmness = "explicit" | "implicit";

export interface KeyPoint {
  id: string;
  time: string;
  text: string;
}

export interface Decision {
  id: string;
  what: string;
  by: string;
  context: string;
  status: DecisionStatus;
}

export interface TaskCommitment {
  id: string;
  title: string;
  owner: string;
  dueDate: string | null;
  hasSpecificDate: boolean;
  status: TaskStatus;
  financial?: {
    amount: number;
    currency: string;
    condition?: string;
  };
}

export interface Participant {
  id: string;
  name: string;
  initials: string;
  colorHue: number;
  role?: string;
  company?: string;
  speakingPercentage: number;
  email?: string;
  phone?: string;
  whatsapp?: string;
  mainPoints: string[];
  contacted: boolean;
}

export interface ConflictMoment {
  id: string;
  timestamp: string;
  summary: string;
  participants: string[];
  resolved: boolean;
  resolution?: string;
}

export interface ConsensusPoint {
  id: string;
  topic: string;
  timestamp: string;
  firmness: ConsensusFirmness;
}

export interface TopicFrequency {
  topic: string;
  count: number;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  source: string;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  severity: InsightSeverity;
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  raisedBy: string;
  dismissed: boolean;
}

export interface NextStep {
  id: string;
  type: NextStepType;
  text: string;
}

export interface BehaviorPattern {
  id: string;
  observation: string;
}

export interface MerkRecording {
  id: string;
  title: string;
  date: string;
  durationSeconds: number;
  participantsCount: number;
  objective: string;
  objectiveStatus: ObjectiveStatus;

  executiveSummary: string;
  keyPoints: KeyPoint[];

  decisions: Decision[];
  tasks: TaskCommitment[];

  participants: Participant[];
  conversationLeaderId: string;
  quietestParticipantId: string;
  consensusPairs: { a: string; b: string }[];
  externalMentions: { name: string; reason: string }[];

  sentiment: {
    type: SentimentType;
    score: number;
    justification: string;
  };
  conflicts: ConflictMoment[];
  consensus: ConsensusPoint[];
  topics: TopicFrequency[];
  interruptionFlag: boolean;
  urgencyFlags: { phrase: string; timestamp: string }[];

  opportunities: Opportunity[];
  risks: Risk[];
  unansweredQuestions: UnansweredQuestion[];
  suggestedNextSteps: NextStep[];
  behaviorPatterns: BehaviorPattern[];
}

export const MOCK_RECORDING: MerkRecording = {
  id: "merk-rec-2026-0412-001",
  title: "Kick-off Projeto Atlas — Contrato Anual",
  date: "2026-04-12T14:30:00-03:00",
  durationSeconds: 2742,
  participantsCount: 5,
  objective:
    "Alinhar escopo, cronograma e condições comerciais para o contrato anual do Projeto Atlas.",
  objectiveStatus: "partial",

  executiveSummary:
    "Reunião de kick-off entre a equipe da Merk e o time executivo do cliente Atlas Holdings. O objetivo central era fechar o escopo do primeiro trimestre e destravar a assinatura do contrato anual. A conversa transcorreu de forma colaborativa até a discussão de prazos, onde surgiu forte resistência do lado do cliente quanto à entrega do MVP em 45 dias. Houve consenso sobre o modelo de pagamento em três parcelas, mas ficou pendente a definição do SLA de suporte pós go-live. A reunião terminou com compromisso de nova rodada até sexta-feira para fechar o cronograma detalhado.",

  keyPoints: [
    { id: "kp-1", time: "00:02", text: "Abertura e apresentação dos participantes." },
    { id: "kp-2", time: "03:15", text: "Revisão do escopo do Projeto Atlas e entregáveis do Q1." },
    { id: "kp-3", time: "11:40", text: "Discussão sobre integração com o ERP legado do cliente." },
    { id: "kp-4", time: "18:22", text: "Primeira tensão: resistência ao prazo de 45 dias para o MVP." },
    { id: "kp-5", time: "24:10", text: "Proposta de modelo de pagamento em três parcelas." },
    { id: "kp-6", time: "31:05", text: "Consenso sobre responsável técnico de cada lado." },
    { id: "kp-7", time: "38:50", text: "SLA de suporte pós go-live ficou em aberto." },
    { id: "kp-8", time: "44:12", text: "Próximos passos e encerramento." },
  ],

  decisions: [
    {
      id: "dec-1",
      what: "Modelo de pagamento em 3 parcelas iguais (30/60/90 dias após assinatura)",
      by: "Carla Menezes (CFO — Atlas)",
      context:
        "Cliente pediu diluição do investimento ao longo do trimestre para acomodar o fluxo de caixa do Q2.",
      status: "confirmed",
    },
    {
      id: "dec-2",
      what: "Rafael Torres será o responsável técnico do lado do cliente",
      by: "Eduardo Lima (CEO — Atlas)",
      context:
        "Definido para dar agilidade nas decisões de integração com o ERP legado.",
      status: "confirmed",
    },
    {
      id: "dec-3",
      what: "Revisão do cronograma do MVP para 60 dias (ao invés de 45)",
      by: "Marina Souza (Delivery — Merk)",
      context:
        "Ajuste proposto em resposta à resistência do cliente sobre o prazo original.",
      status: "pending_confirmation",
    },
  ],

  tasks: [
    {
      id: "task-1",
      title: "Enviar proposta comercial revisada com as 3 parcelas",
      owner: "Marina Souza",
      dueDate: "2026-04-17",
      hasSpecificDate: true,
      status: "pending",
      financial: {
        amount: 184500,
        currency: "BRL",
        condition: "3x de R$ 61.500 — 30/60/90 dias",
      },
    },
    {
      id: "task-2",
      title: "Mapear integrações necessárias com o ERP legado",
      owner: "Rafael Torres",
      dueDate: "2026-04-20",
      hasSpecificDate: true,
      status: "in_progress",
    },
    {
      id: "task-3",
      title: "Definir SLA de suporte pós go-live e enviar minuta",
      owner: "Bruno Carvalho",
      dueDate: null,
      hasSpecificDate: false,
      status: "pending",
    },
    {
      id: "task-4",
      title: "Agendar próxima reunião para fechar cronograma",
      owner: "Marina Souza",
      dueDate: "2026-04-17",
      hasSpecificDate: true,
      status: "done",
    },
    {
      id: "task-5",
      title: "Validar disponibilidade do time de dados para kick-off técnico",
      owner: "Juliana Prado",
      dueDate: null,
      hasSpecificDate: false,
      status: "pending",
    },
  ],

  participants: [
    {
      id: "p-1",
      name: "Marina Souza",
      initials: "MS",
      colorHue: 32,
      role: "Head of Delivery",
      company: "Merk",
      speakingPercentage: 34,
      email: "marina.souza@merk.com",
      phone: "+55 11 98877-1122",
      whatsapp: "+55 11 98877-1122",
      mainPoints: [
        "Defendeu o prazo original de 45 dias para o MVP",
        "Propôs o modelo de pagamento em 3 parcelas",
      ],
      contacted: false,
    },
    {
      id: "p-2",
      name: "Eduardo Lima",
      initials: "EL",
      colorHue: 210,
      role: "CEO",
      company: "Atlas Holdings",
      speakingPercentage: 27,
      email: "eduardo.lima@atlasholdings.com",
      mainPoints: [
        "Priorizou agilidade nas decisões técnicas",
        "Confirmou compromisso com a assinatura até sexta-feira",
      ],
      contacted: false,
    },
    {
      id: "p-3",
      name: "Carla Menezes",
      initials: "CM",
      colorHue: 340,
      role: "CFO",
      company: "Atlas Holdings",
      speakingPercentage: 19,
      email: "carla.menezes@atlasholdings.com",
      phone: "+55 21 99123-4455",
      mainPoints: [
        "Levantou restrições de fluxo de caixa no Q2",
        "Aprovou o modelo de pagamento em 3 parcelas",
      ],
      contacted: true,
    },
    {
      id: "p-4",
      name: "Rafael Torres",
      initials: "RT",
      colorHue: 160,
      role: "Tech Lead",
      company: "Atlas Holdings",
      speakingPercentage: 14,
      email: "rafael.torres@atlasholdings.com",
      mainPoints: [
        "Alertou sobre complexidade do ERP legado",
        "Assumiu papel de responsável técnico do lado Atlas",
      ],
      contacted: false,
    },
    {
      id: "p-5",
      name: "Bruno Carvalho",
      initials: "BC",
      colorHue: 260,
      role: "Customer Success",
      company: "Merk",
      speakingPercentage: 6,
      email: "bruno.carvalho@merk.com",
      mainPoints: ["Permaneceu a maior parte do tempo ouvindo, interveio no tema de SLA"],
      contacted: false,
    },
  ],
  conversationLeaderId: "p-1",
  quietestParticipantId: "p-5",
  consensusPairs: [
    { a: "p-1", b: "p-2" },
    { a: "p-2", b: "p-3" },
  ],
  externalMentions: [
    {
      name: "Juliana Prado (Head de Dados — Atlas)",
      reason: "Precisa ser envolvida no kick-off técnico das integrações.",
    },
  ],

  sentiment: {
    type: "mixed",
    score: 642,
    justification:
      "A reunião teve tom colaborativo até os 18 minutos, quando houve resistência clara sobre o prazo do MVP. O fechamento voltou a ser positivo com alinhamento parcial.",
  },
  conflicts: [
    {
      id: "cf-1",
      timestamp: "18:22",
      summary: "Resistência do cliente ao prazo de 45 dias para o MVP",
      participants: ["Eduardo Lima", "Marina Souza"],
      resolved: false,
      resolution: "Proposta de revisão para 60 dias ficou pendente de aprovação.",
    },
    {
      id: "cf-2",
      timestamp: "38:50",
      summary: "Divergência sobre abrangência do SLA pós go-live",
      participants: ["Bruno Carvalho", "Carla Menezes"],
      resolved: false,
    },
  ],
  consensus: [
    {
      id: "cs-1",
      topic: "Modelo de pagamento em 3 parcelas",
      timestamp: "24:10",
      firmness: "explicit",
    },
    {
      id: "cs-2",
      topic: "Rafael Torres como responsável técnico do cliente",
      timestamp: "31:05",
      firmness: "explicit",
    },
    {
      id: "cs-3",
      topic: "Necessidade de envolver o time de dados no kick-off",
      timestamp: "34:40",
      firmness: "implicit",
    },
  ],
  topics: [
    { topic: "Cronograma / Prazo do MVP", count: 14 },
    { topic: "Integração com ERP legado", count: 11 },
    { topic: "Condições comerciais", count: 9 },
    { topic: "SLA pós go-live", count: 6 },
    { topic: "Responsáveis técnicos", count: 5 },
  ],
  interruptionFlag: true,
  urgencyFlags: [
    { phrase: "precisamos disso para ontem", timestamp: "19:04" },
    { phrase: "não pode atrasar de jeito nenhum", timestamp: "21:48" },
  ],

  opportunities: [
    {
      id: "op-1",
      title: "Expansão para unidade de dados do cliente",
      description:
        "Juliana Prado foi mencionada como ponto de contato do time de dados — existe espaço para propor um segundo frente de trabalho focado em BI.",
      source: "Mencionado aos 34:40",
    },
    {
      id: "op-2",
      title: "Venda de suporte premium",
      description:
        "O SLA pós go-live ficou em aberto e o cliente demonstrou preocupação com estabilidade — oportunidade de oferecer pacote de suporte premium.",
      source: "Discussão aos 38:50",
    },
  ],
  risks: [
    {
      id: "rk-1",
      title: "Expectativa de prazo desalinhada",
      description:
        "Cliente reagiu mal ao prazo de 45 dias. Se a revisão para 60 dias não for aprovada, o contrato pode atrasar.",
      severity: "high",
    },
    {
      id: "rk-2",
      title: "ERP legado pode gerar retrabalho",
      description:
        "Rafael Torres sinalizou complexidade na integração, mas o escopo ainda não foi dimensionado em detalhe.",
      severity: "medium",
    },
    {
      id: "rk-3",
      title: "SLA indefinido gera atrito contratual",
      description:
        "Sem minuta de SLA, há risco de discordância na fase de assinatura.",
      severity: "medium",
    },
  ],
  unansweredQuestions: [
    {
      id: "uq-1",
      question: "Qual o orçamento máximo aprovado internamente pela Atlas?",
      raisedBy: "Marina Souza",
      dismissed: false,
    },
    {
      id: "uq-2",
      question: "Haverá equipe dedicada do cliente para homologação?",
      raisedBy: "Bruno Carvalho",
      dismissed: false,
    },
    {
      id: "uq-3",
      question: "O ERP legado tem documentação de APIs disponível?",
      raisedBy: "Rafael Torres",
      dismissed: false,
    },
  ],
  suggestedNextSteps: [
    {
      id: "ns-1",
      type: "communication",
      text: "Enviar ata da reunião com decisões destacadas para todos os participantes.",
    },
    {
      id: "ns-2",
      type: "operational",
      text: "Agendar sessão técnica entre Rafael Torres e time de integrações da Merk.",
    },
    {
      id: "ns-3",
      type: "commercial",
      text: "Preparar proposta revisada com cronograma de 60 dias e enviar até quinta-feira.",
    },
    {
      id: "ns-4",
      type: "commercial",
      text: "Anexar pacote opcional de suporte premium na proposta.",
    },
  ],
  behaviorPatterns: [
    {
      id: "bp-1",
      observation:
        "O cliente desviou três vezes perguntas sobre orçamento máximo — sinal de que o teto ainda não está definido internamente.",
    },
    {
      id: "bp-2",
      observation:
        "Forte engajamento quando o assunto foi prazo de entrega: todos os participantes intervieram em menos de 2 minutos.",
    },
    {
      id: "bp-3",
      observation:
        "Bruno Carvalho só falou quando diretamente questionado — padrão que pode indicar falta de espaço na conversa.",
    },
  ],
};
