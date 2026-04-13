import { ProcessedRecording } from "../_types";

const now = new Date();
const hoursAgo = (h: number) =>
  new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

export const processedRecordingsMock: ProcessedRecording[] = [
  {
    id: "rec-001",
    title: "Alinhamento inicial — Caso Silva vs. Construtora",
    clientName: "João Silva",
    processedAt: hoursAgo(2),
    durationSeconds: 52 * 60,
    participantsCount: 3,
  },
  {
    id: "rec-002",
    title: "Revisão de contrato — Aquisição de imóvel",
    clientName: "Maria Oliveira",
    processedAt: hoursAgo(6),
    durationSeconds: 38 * 60,
    participantsCount: 2,
  },
  {
    id: "rec-003",
    title: "Reunião semanal — Escritório Almeida Associados",
    clientName: "Escritório Almeida",
    processedAt: hoursAgo(26),
    durationSeconds: 71 * 60,
    participantsCount: 5,
  },
  {
    id: "rec-004",
    title: "Consulta previdenciária — Aposentadoria especial",
    clientName: "Carlos Pereira",
    processedAt: hoursAgo(48),
    durationSeconds: 44 * 60,
    participantsCount: 2,
  },
];
