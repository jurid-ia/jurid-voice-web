import { Meeting } from "../_types";

const today = new Date();
today.setHours(0, 0, 0, 0);

const at = (dayOffset: number, hour: number, minute = 0): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const meetingsMock: Meeting[] = [
  {
    id: "meet-001",
    title: "Alinhamento — Caso Silva vs. Construtora",
    description: "Revisão do andamento do processo e próximos passos.",
    start: at(0, 9, 0),
    end: at(0, 10, 0),
    source: "google",
    status: "scheduled",
    clientId: "cli-001",
    participants: [
      { id: "p1", name: "João Silva" },
      { id: "p2", name: "Dra. Ana Martins" },
    ],
  },
  {
    id: "meet-002",
    title: "Revisão de contrato — Imóvel Oliveira",
    start: at(0, 11, 30),
    end: at(0, 12, 30),
    source: "teams",
    status: "scheduled",
    clientId: "cli-002",
    participants: [
      { id: "p3", name: "Maria Oliveira" },
      { id: "p4", name: "Dr. Rafael Costa" },
    ],
  },
  {
    id: "meet-003",
    title: "Consulta previdenciária",
    start: at(0, 14, 0),
    end: at(0, 15, 0),
    source: "juridia",
    status: "live",
    clientId: "cli-003",
    participants: [
      { id: "p5", name: "Carlos Pereira" },
      { id: "p6", name: "Dra. Ana Martins" },
    ],
  },
  {
    id: "meet-004",
    title: "Follow-up — Escritório Almeida",
    start: at(0, 16, 30),
    end: at(0, 17, 30),
    source: "google",
    status: "scheduled",
    clientId: "cli-005",
    participants: [
      { id: "p7", name: "Pedro Almeida" },
      { id: "p8", name: "Dra. Ana Martins" },
      { id: "p9", name: "Lucas Mendes" },
    ],
  },
  // Ontem — processadas
  {
    id: "meet-005",
    title: "Audiência preliminar — Trabalhista",
    start: at(-1, 10, 0),
    end: at(-1, 11, 30),
    source: "juridia",
    status: "processed",
    clientId: "cli-004",
    participants: [
      { id: "p10", name: "Ricardo Souza" },
      { id: "p11", name: "Dra. Ana Martins" },
    ],
    recordingId: "rec-past-001",
    hasTranscription: true,
  },
  {
    id: "meet-006",
    title: "Reunião semanal do escritório",
    start: at(-1, 15, 0),
    end: at(-1, 16, 0),
    source: "teams",
    status: "processed",
    participants: [{ id: "p12", name: "Equipe Jurídica" }],
    recordingId: "rec-past-002",
    hasTranscription: true,
  },
  // Há 2 dias — não processada
  {
    id: "meet-007",
    title: "Mediação — Família Santos",
    start: at(-2, 14, 0),
    end: at(-2, 15, 30),
    source: "google",
    status: "unprocessed",
    clientId: "cli-006",
    participants: [
      { id: "p13", name: "Família Santos" },
      { id: "p14", name: "Dra. Ana Martins" },
    ],
  },
  // Amanhã
  {
    id: "meet-008",
    title: "Proposta de acordo — Caso Lima",
    start: at(1, 9, 30),
    end: at(1, 10, 30),
    source: "teams",
    status: "scheduled",
    clientId: "cli-001",
    participants: [
      { id: "p15", name: "Dra. Beatriz Lima" },
      { id: "p16", name: "Dr. Rafael Costa" },
    ],
  },
  {
    id: "meet-009",
    title: "Onboarding novo cliente",
    start: at(1, 14, 0),
    end: at(1, 15, 0),
    source: "juridia",
    status: "scheduled",
    clientId: "cli-008",
    participants: [
      { id: "p17", name: "Empresa XYZ" },
      { id: "p18", name: "Dra. Ana Martins" },
    ],
  },
  // Próximos dias
  {
    id: "meet-010",
    title: "Audiência — Caso Mendes",
    start: at(2, 10, 0),
    end: at(2, 12, 0),
    source: "juridia",
    status: "scheduled",
    clientId: "cli-009",
    participants: [
      { id: "p19", name: "Roberto Mendes" },
      { id: "p20", name: "Dra. Ana Martins" },
    ],
  },
  {
    id: "meet-011",
    title: "Reunião de estratégia trimestral",
    start: at(3, 15, 0),
    end: at(3, 17, 0),
    source: "teams",
    status: "scheduled",
    participants: [{ id: "p21", name: "Sócios" }],
  },
  {
    id: "meet-012",
    title: "Consulta tributária",
    start: at(4, 11, 0),
    end: at(4, 12, 0),
    source: "google",
    status: "scheduled",
    clientId: "cli-007",
    participants: [{ id: "p22", name: "Contabilidade Prime" }],
  },
];
