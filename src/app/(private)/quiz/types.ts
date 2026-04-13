export type Sector =
  | "sales"
  | "marketing"
  | "design"
  | "tech"
  | "law"
  | "accounting"
  | "hr"
  | "logistics"
  | "consulting"
  | "leadership"
  | "other";

export type CompanySize = "solo" | "2-10" | "11-50" | "51-200" | "200+";

export interface QuizState {
  // Bloco 1
  name: string;
  company: string;
  city: string;
  state: string;

  // Bloco 2
  companySize: CompanySize | "";
  sector: Sector | "";
  sectorOther: string;

  // Bloco 3 — específicas do setor
  q6: string;
  q6Other: string;
  q7: string;
  q8: string;

  // Bloco 4
  role: string;
  postMeetingIssues: string[];

  // Bloco 5
  tools: string[];
  toolsOther: string;
  finalValue: string;
}

export const initialQuizState: QuizState = {
  name: "",
  company: "",
  city: "",
  state: "",
  companySize: "",
  sector: "",
  sectorOther: "",
  q6: "",
  q6Other: "",
  q7: "",
  q8: "",
  role: "",
  postMeetingIssues: [],
  tools: [],
  toolsOther: "",
  finalValue: "",
};

export interface Option {
  value: string;
  label: string;
  icon?: string;
}

export interface SectorQuestion {
  key: "q6" | "q7" | "q8";
  title: string;
  options: Option[];
  allowOther?: boolean;
}

export type Tone = "formal" | "consultivo" | "direto" | "criativo";

export interface Persona {
  tone: Tone;
  toneDescription: string;
  highlightedSubmenus: string[];
  priorityActions: string[];
  sectorLanguage: string;
}
