import { SearchResult } from "../_types";
import { commitmentsMock } from "./commitments";
import { meetingsMock } from "./meetings";
import { processedRecordingsMock } from "./recordings";

const clients = [
  { id: "cli-001", name: "João Silva", description: "Caso Silva vs. Construtora" },
  { id: "cli-002", name: "Maria Oliveira", description: "Aquisição de imóvel" },
  { id: "cli-003", name: "Carlos Pereira", description: "Consulta previdenciária" },
  { id: "cli-004", name: "Ricardo Souza", description: "Trabalhista" },
  { id: "cli-005", name: "Escritório Almeida", description: "Assessoria contínua" },
  { id: "cli-006", name: "Família Santos", description: "Mediação familiar" },
  { id: "cli-007", name: "Contabilidade Prime", description: "Tributário" },
];

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const searchIndexMock: SearchResult[] = [
  ...meetingsMock.map<SearchResult>((m) => ({
    id: m.id,
    category: "meeting",
    title: m.title,
    subtitle: m.participants.map((p) => p.name).join(", "),
    meta: `${formatDateShort(m.start)} · ${formatTime(m.start)}`,
  })),
  ...commitmentsMock.map<SearchResult>((c) => ({
    id: c.id,
    category: "commitment",
    title: c.title,
    subtitle: `${c.direction === "outgoing" ? "Para" : "De"} ${c.counterpart.name}`,
    meta: formatDateShort(c.dueDate),
  })),
  ...processedRecordingsMock.map<SearchResult>((r) => ({
    id: r.id,
    category: "recording",
    title: r.title,
    subtitle: r.clientName,
    meta: formatDateShort(r.processedAt),
  })),
  ...clients.map<SearchResult>((c) => ({
    id: c.id,
    category: "client",
    title: c.name,
    subtitle: c.description,
  })),
];
