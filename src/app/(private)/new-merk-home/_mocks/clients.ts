import { ClientRegistryEntry } from "../_types";

export const clientsRegistryMock: ClientRegistryEntry[] = [
  { id: "cli-001", name: "João Silva", company: "Silva Empreendimentos" },
  { id: "cli-002", name: "Maria Oliveira", company: "Oliveira & Cia" },
  { id: "cli-003", name: "Carlos Pereira" },
  { id: "cli-004", name: "Ricardo Souza", company: "Souza Indústria" },
  { id: "cli-005", name: "Escritório Almeida", company: "Almeida Associados" },
  { id: "cli-006", name: "Família Santos" },
  { id: "cli-007", name: "Contabilidade Prime" },
  { id: "cli-008", name: "Empresa XYZ" },
  { id: "cli-009", name: "Roberto Mendes" },
];

export function getClientById(
  id: string | undefined | null,
): ClientRegistryEntry | null {
  if (!id) return null;
  return clientsRegistryMock.find((c) => c.id === id) ?? null;
}
