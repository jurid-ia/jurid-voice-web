import { Commitment } from "../_types";

const now = new Date();

const daysFromNow = (d: number): string => {
  const date = new Date(now);
  date.setDate(date.getDate() + d);
  date.setHours(17, 0, 0, 0);
  return date.toISOString();
};

export const commitmentsMock: Commitment[] = [
  {
    id: "cmt-001",
    title: "Enviar minuta de contrato revisada",
    description: "Cliente solicitou ajustes nas cláusulas 5 e 7.",
    direction: "outgoing",
    counterpart: { name: "João Silva" },
    dueDate: daysFromNow(0),
    status: "pending",
    priority: "high",
    sourceMeetingId: "meet-005",
    sourceMeetingTitle: "Audiência preliminar — Trabalhista",
    createdAt: daysFromNow(-1),
  },
  {
    id: "cmt-002",
    title: "Agendar perícia técnica",
    description: "Confirmar disponibilidade do perito indicado.",
    direction: "outgoing",
    counterpart: { name: "Dra. Beatriz Lima" },
    dueDate: daysFromNow(-2),
    status: "overdue",
    priority: "high",
    sourceMeetingId: "meet-005",
    sourceMeetingTitle: "Audiência preliminar — Trabalhista",
    createdAt: daysFromNow(-5),
  },
  {
    id: "cmt-003",
    title: "Preparar parecer sobre cláusula de não concorrência",
    direction: "outgoing",
    counterpart: { name: "Maria Oliveira" },
    dueDate: daysFromNow(2),
    status: "pending",
    priority: "medium",
    sourceMeetingId: "meet-006",
    sourceMeetingTitle: "Reunião semanal do escritório",
    createdAt: daysFromNow(-1),
  },
  {
    id: "cmt-004",
    title: "Revisar petição inicial",
    direction: "outgoing",
    counterpart: { name: "Ricardo Souza" },
    dueDate: daysFromNow(-3),
    status: "done",
    priority: "medium",
    sourceMeetingId: "meet-005",
    sourceMeetingTitle: "Audiência preliminar — Trabalhista",
    createdAt: daysFromNow(-6),
  },
  {
    id: "cmt-005",
    title: "Consolidar resumo executivo do caso",
    direction: "outgoing",
    counterpart: { name: "Sócios" },
    dueDate: daysFromNow(5),
    status: "pending",
    priority: "low",
    createdAt: daysFromNow(-1),
  },

  // Incoming (terceiros -> usuário)
  {
    id: "cmt-006",
    title: "Receber documentação do RH",
    description: "Cliente enviará holerites e contrato de trabalho.",
    direction: "incoming",
    counterpart: { name: "Ricardo Souza" },
    dueDate: daysFromNow(0),
    status: "pending",
    priority: "high",
    sourceMeetingId: "meet-005",
    sourceMeetingTitle: "Audiência preliminar — Trabalhista",
    createdAt: daysFromNow(-2),
  },
  {
    id: "cmt-007",
    title: "Cliente confirmar dados bancários",
    direction: "incoming",
    counterpart: { name: "Maria Oliveira" },
    dueDate: daysFromNow(-1),
    status: "overdue",
    priority: "medium",
    sourceMeetingId: "meet-006",
    sourceMeetingTitle: "Reunião semanal do escritório",
    createdAt: daysFromNow(-4),
  },
  {
    id: "cmt-008",
    title: "Contabilidade enviar balancete",
    direction: "incoming",
    counterpart: { name: "Contabilidade Prime" },
    dueDate: daysFromNow(4),
    status: "pending",
    priority: "low",
    createdAt: daysFromNow(-1),
  },
  {
    id: "cmt-009",
    title: "Perito entregar laudo final",
    direction: "incoming",
    counterpart: { name: "Dr. Fernando Rocha" },
    dueDate: daysFromNow(-4),
    status: "done",
    priority: "high",
    sourceMeetingId: "meet-007",
    sourceMeetingTitle: "Mediação — Família Santos",
    createdAt: daysFromNow(-10),
  },
];
