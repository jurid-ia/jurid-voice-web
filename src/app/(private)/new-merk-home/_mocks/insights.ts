export interface InsightPoint {
  label: string;
  meetingsProcessed: number;
  commitmentsCreated: number;
  commitmentsCompleted: number;
}

// Últimos 7 dias (view "Semana")
export const dailyInsightsMock: InsightPoint[] = [
  { label: "Dom", meetingsProcessed: 0, commitmentsCreated: 1, commitmentsCompleted: 1 },
  { label: "Seg", meetingsProcessed: 3, commitmentsCreated: 6, commitmentsCompleted: 4 },
  { label: "Ter", meetingsProcessed: 4, commitmentsCreated: 7, commitmentsCompleted: 5 },
  { label: "Qua", meetingsProcessed: 2, commitmentsCreated: 4, commitmentsCompleted: 3 },
  { label: "Qui", meetingsProcessed: 5, commitmentsCreated: 9, commitmentsCompleted: 7 },
  { label: "Sex", meetingsProcessed: 4, commitmentsCreated: 6, commitmentsCompleted: 4 },
  { label: "Sáb", meetingsProcessed: 1, commitmentsCreated: 2, commitmentsCompleted: 1 },
];

// Últimas 4 semanas (view "Mês")
export const weeklyInsightsMock: InsightPoint[] = [
  { label: "Sem 1", meetingsProcessed: 15, commitmentsCreated: 23, commitmentsCompleted: 18 },
  { label: "Sem 2", meetingsProcessed: 18, commitmentsCreated: 28, commitmentsCompleted: 23 },
  { label: "Sem 3", meetingsProcessed: 17, commitmentsCreated: 25, commitmentsCompleted: 19 },
  { label: "Sem 4", meetingsProcessed: 21, commitmentsCreated: 30, commitmentsCompleted: 24 },
];

// Últimos 12 meses (view "Ano")
export const monthlyInsightsMock: InsightPoint[] = [
  { label: "Mai", meetingsProcessed: 42, commitmentsCreated: 68, commitmentsCompleted: 51 },
  { label: "Jun", meetingsProcessed: 48, commitmentsCreated: 75, commitmentsCompleted: 58 },
  { label: "Jul", meetingsProcessed: 52, commitmentsCreated: 82, commitmentsCompleted: 63 },
  { label: "Ago", meetingsProcessed: 45, commitmentsCreated: 70, commitmentsCompleted: 52 },
  { label: "Set", meetingsProcessed: 58, commitmentsCreated: 88, commitmentsCompleted: 70 },
  { label: "Out", meetingsProcessed: 61, commitmentsCreated: 92, commitmentsCompleted: 74 },
  { label: "Nov", meetingsProcessed: 55, commitmentsCreated: 86, commitmentsCompleted: 67 },
  { label: "Dez", meetingsProcessed: 47, commitmentsCreated: 73, commitmentsCompleted: 55 },
  { label: "Jan", meetingsProcessed: 63, commitmentsCreated: 95, commitmentsCompleted: 76 },
  { label: "Fev", meetingsProcessed: 68, commitmentsCreated: 102, commitmentsCompleted: 82 },
  { label: "Mar", meetingsProcessed: 72, commitmentsCreated: 108, commitmentsCompleted: 87 },
  { label: "Abr", meetingsProcessed: 71, commitmentsCreated: 110, commitmentsCompleted: 89 },
];
