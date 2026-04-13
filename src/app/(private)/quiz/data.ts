import type { Option, Sector, SectorQuestion } from "./types";

export const brazilianStates: Option[] = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

export const companySizeOptions: Option[] = [
  { value: "solo", label: "Só eu (autônomo / freelancer)", icon: "🧍" },
  { value: "2-10", label: "2 a 10 pessoas", icon: "👥" },
  { value: "11-50", label: "11 a 50 pessoas", icon: "🏢" },
  { value: "51-200", label: "51 a 200 pessoas", icon: "🏬" },
  { value: "200+", label: "Mais de 200 pessoas", icon: "🏭" },
];

export const sectorOptions: Option[] = [
  { value: "sales", label: "Vendas / Comercial", icon: "💼" },
  {
    value: "marketing",
    label: "Marketing / Publicidade / Comunicação",
    icon: "📣",
  },
  { value: "design", label: "Design / Criação / Conteúdo", icon: "🎨" },
  { value: "tech", label: "Tecnologia / Desenvolvimento", icon: "💻" },
  { value: "law", label: "Direito / Advocacia", icon: "⚖️" },
  {
    value: "accounting",
    label: "Contabilidade / Financeiro / Fiscal",
    icon: "📊",
  },
  { value: "hr", label: "RH / Pessoas / Gestão de Talentos", icon: "👥" },
  {
    value: "logistics",
    label: "Logística / Operações / Supply Chain",
    icon: "📦",
  },
  { value: "consulting", label: "Consultoria / Estratégia", icon: "🧭" },
  { value: "leadership", label: "Gestão / Liderança / Diretoria", icon: "🏗️" },
  { value: "other", label: "Outro — me conta o que você faz", icon: "✏️" },
];

export const roleOptions: Option[] = [
  { value: "decider", label: "Quem decide e define o que vai ser feito" },
  { value: "executor", label: "Quem executa o que foi definido" },
  {
    value: "connector",
    label: "Quem conecta quem decide com quem executa",
  },
  { value: "context", label: "Depende muito do contexto" },
];

export const postMeetingIssuesOptions: Option[] = [
  { value: "forget", label: "Esquecer o que foi combinado" },
  { value: "no-record", label: "Ninguém registrar as decisões tomadas" },
  { value: "unclear", label: "Sair sem saber exatamente o que fazer agora" },
  {
    value: "resummarize",
    label: "Perder tempo resumindo pra quem não estava",
  },
  {
    value: "non-compliance",
    label: "Outros não cumprirem o que foi acordado",
  },
  {
    value: "split-attention",
    label: "Não ter conseguido prestar atenção e anotar ao mesmo tempo",
  },
];

export const toolsOptions: Option[] = [
  { value: "email", label: "E-mail" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "apps", label: "Notion / Trello / Asana / Monday" },
  { value: "paper", label: "Papel ou caderno" },
  { value: "head", label: "Não tenho sistema — fica na cabeça" },
];

export const finalValueOptions: Option[] = [
  {
    value: "never-forget",
    label: "Nunca mais esquecer o que foi decidido",
  },
  {
    value: "auto-record",
    label: "Ter um registro profissional automático",
  },
  {
    value: "next-actions",
    label: "Saber exatamente o que fazer após cada conversa",
  },
  {
    value: "understanding",
    label: "Entender melhor o que aconteceu na reunião",
  },
  {
    value: "save-time",
    label: "Economizar tempo que perco organizando tudo depois",
  },
];

export const sectorQuestions: Record<Sector, SectorQuestion[]> = {
  sales: [
    {
      key: "q6",
      title: "O que você vende?",
      allowOther: true,
      options: [
        { value: "physical", label: "Produto físico" },
        { value: "saas", label: "Software / SaaS / tecnologia" },
        {
          value: "recurring",
          label: "Serviço recorrente (mensalidade, contrato)",
        },
        { value: "projects", label: "Projetos ou serviços pontuais" },
      ],
    },
    {
      key: "q7",
      title: "Seu cliente é:",
      options: [
        { value: "b2b", label: "Empresa (B2B)" },
        { value: "b2c", label: "Pessoa física (B2C)" },
        { value: "both", label: "Ambos" },
      ],
    },
    {
      key: "q8",
      title: "Seu ciclo de venda costuma ser:",
      options: [
        { value: "fast", label: "Rápido (fecha na hora ou em poucos dias)" },
        { value: "medium", label: "Médio (semanas, algumas reuniões)" },
        { value: "long", label: "Longo (meses, muitas partes envolvidas)" },
      ],
    },
  ],
  marketing: [
    {
      key: "q6",
      title: "Você trabalha em:",
      options: [
        { value: "agency", label: "Agência (atende clientes externos)" },
        { value: "in-house", label: "Time interno de uma empresa" },
        {
          value: "freelance",
          label: "Freelancer / consultoria independente",
        },
      ],
    },
    {
      key: "q7",
      title: "O foco principal do seu trabalho é:",
      allowOther: true,
      options: [
        { value: "performance", label: "Performance / mídia paga" },
        { value: "content", label: "Conteúdo / redes sociais" },
        { value: "branding", label: "Branding / identidade" },
        { value: "strategy", label: "Estratégia e planejamento" },
        { value: "events", label: "Eventos / ativações" },
      ],
    },
    {
      key: "q8",
      title: "Suas reuniões são mais com:",
      options: [
        { value: "clients", label: "Clientes aprovando entregas" },
        { value: "team", label: "Time interno alinhando estratégia" },
        { value: "partners", label: "Fornecedores e parceiros" },
        { value: "mix", label: "Mistura dos três" },
      ],
    },
  ],
  design: [
    {
      key: "q6",
      title: "Qual é a sua entrega principal?",
      allowOther: true,
      options: [
        { value: "branding", label: "Identidade visual / branding" },
        { value: "uiux", label: "UI/UX / interfaces digitais" },
        { value: "content", label: "Conteúdo para redes e digital" },
        { value: "motion", label: "Vídeo / motion / audiovisual" },
        { value: "art", label: "Ilustração / direção de arte" },
      ],
    },
    {
      key: "q7",
      title: "Você atende:",
      options: [
        { value: "single", label: "Um único cliente fixo (CLT ou contrato)" },
        { value: "multiple", label: "Vários clientes simultaneamente" },
        { value: "projects", label: "Projetos pontuais variados" },
      ],
    },
    {
      key: "q8",
      title: "O maior desafio nas suas reuniões é:",
      options: [
        {
          value: "mind-change",
          label: "O cliente mudar de ideia depois do alinhamento",
        },
        { value: "no-briefing", label: "Sair sem briefing claro" },
        {
          value: "feedback",
          label: "Não conseguir registrar o feedback direito",
        },
        {
          value: "explain",
          label: "Explicar decisões criativas e não ser compreendido",
        },
      ],
    },
  ],
  tech: [
    {
      key: "q6",
      title: "Você trabalha principalmente com:",
      options: [
        { value: "product", label: "Desenvolvimento de produto próprio" },
        { value: "clients", label: "Projetos para clientes externos" },
        {
          value: "maintenance",
          label: "Sustentação / manutenção de sistemas",
        },
        { value: "data", label: "Dados / BI / inteligência" },
      ],
    },
    {
      key: "q7",
      title: "Seu time é:",
      options: [
        { value: "solo", label: "Só eu" },
        { value: "small", label: "Time pequeno (até 5 pessoas)" },
        { value: "large", label: "Time médio ou grande" },
      ],
    },
    {
      key: "q8",
      title: "Suas reuniões mais frequentes são:",
      options: [
        {
          value: "planning",
          label: "Planejamento / sprint / refinamento",
        },
        {
          value: "stakeholder",
          label: "Alinhamento com cliente ou stakeholder",
        },
        { value: "review", label: "Revisão de entrega ou demo" },
        { value: "urgent", label: "Resolução de problema urgente" },
      ],
    },
  ],
  law: [
    {
      key: "q6",
      title: "Qual é a sua área de atuação principal?",
      allowOther: true,
      options: [
        { value: "labor", label: "Trabalhista" },
        { value: "corporate", label: "Empresarial / Societário" },
        { value: "tax", label: "Tributário / Fiscal" },
        { value: "civil", label: "Civil / Família" },
        { value: "criminal", label: "Criminal" },
      ],
    },
    {
      key: "q7",
      title: "Você atende:",
      options: [
        { value: "b2c", label: "Pessoas físicas" },
        { value: "b2b", label: "Empresas" },
        { value: "both", label: "Ambos" },
      ],
    },
    {
      key: "q8",
      title: "O que mais consome seu tempo após uma reunião:",
      options: [
        { value: "notes", label: "Redigir ou organizar anotações do caso" },
        { value: "deadlines", label: "Registrar prazos e obrigações" },
        {
          value: "expectations",
          label: "Alinhar expectativas com o cliente",
        },
        {
          value: "coordinate",
          label: "Coordenar com outros advogados ou partes",
        },
      ],
    },
  ],
  accounting: [
    {
      key: "q6",
      title: "Você trabalha:",
      options: [
        {
          value: "office",
          label: "Em escritório de contabilidade (atende múltiplos clientes)",
        },
        {
          value: "in-house",
          label: "No financeiro interno de uma empresa",
        },
        {
          value: "freelance",
          label: "Como autônomo / consultor independente",
        },
      ],
    },
    {
      key: "q7",
      title: "Seu foco principal é:",
      options: [
        { value: "tax", label: "Fiscal / tributário" },
        { value: "corporate", label: "Contabilidade societária" },
        { value: "payroll", label: "Folha e DP" },
        {
          value: "finance",
          label: "Financeiro / fluxo de caixa / controladoria",
        },
        { value: "audit", label: "Auditoria" },
      ],
    },
    {
      key: "q8",
      title: "O maior problema nas suas reuniões com clientes é:",
      options: [
        {
          value: "understanding",
          label: "Cliente não entende o que precisa entregar",
        },
        {
          value: "deadlines",
          label: "Prazo de obrigações não fica claro pra eles",
        },
        {
          value: "decisions",
          label: "Decisões que impactam o negócio não são registradas",
        },
        {
          value: "commitment",
          label: "Falta de comprometimento com o combinado",
        },
      ],
    },
  ],
  hr: [
    {
      key: "q6",
      title: "Seu trabalho foca mais em:",
      options: [
        { value: "recruiting", label: "Recrutamento e seleção" },
        { value: "development", label: "Treinamento e desenvolvimento" },
        { value: "culture", label: "Cultura e clima organizacional" },
        {
          value: "admin",
          label: "Gestão de benefícios e administração de pessoal",
        },
        { value: "generalist", label: "RH generalista (um pouco de tudo)" },
      ],
    },
    {
      key: "q7",
      title: "Você cuida de RH para:",
      options: [
        {
          value: "internal",
          label: "A empresa onde trabalho (interno)",
        },
        {
          value: "external",
          label: "Clientes externos (consultoria ou BPO)",
        },
      ],
    },
    {
      key: "q8",
      title: "Nas suas reuniões, o maior desafio é:",
      options: [
        {
          value: "feedback",
          label: "Registrar feedbacks e acordos de desenvolvimento",
        },
        {
          value: "leaders",
          label: "Alinhar líderes sobre decisões de pessoas",
        },
        {
          value: "hiring",
          label: "Documentar processos seletivos e entrevistas",
        },
        {
          value: "follow-through",
          label: "Garantir que combinados sejam cumpridos",
        },
      ],
    },
  ],
  logistics: [
    {
      key: "q6",
      title: "Seu foco é:",
      options: [
        { value: "transport", label: "Transporte e distribuição" },
        { value: "warehouse", label: "Estoque e armazenagem" },
        { value: "procurement", label: "Compras e fornecedores" },
        {
          value: "planning",
          label: "Planejamento e controle de operações",
        },
      ],
    },
    {
      key: "q7",
      title: "Você lida mais com:",
      options: [
        { value: "ops", label: "Equipe operacional interna" },
        { value: "partners", label: "Fornecedores e parceiros externos" },
        { value: "clients", label: "Clientes que dependem da entrega" },
        { value: "all", label: "Todos os três" },
      ],
    },
    {
      key: "q8",
      title: "O que mais se perde nas suas reuniões:",
      options: [
        { value: "incidents", label: "Ocorrências e problemas relatados" },
        {
          value: "decisions",
          label: "Decisões sobre fornecedores ou rotas",
        },
        { value: "deadlines", label: "Prazos e compromissos de entrega" },
        {
          value: "process",
          label: "Mudanças de processo que não são registradas",
        },
      ],
    },
  ],
  consulting: [
    {
      key: "q6",
      title: "Você atua como:",
      options: [
        { value: "independent", label: "Consultor independente" },
        { value: "firm", label: "Parte de uma consultoria" },
        {
          value: "internal",
          label: "Consultor interno de uma grande empresa",
        },
      ],
    },
    {
      key: "q7",
      title: "Seu trabalho envolve mais:",
      options: [
        {
          value: "diagnosis",
          label: "Diagnóstico e análise de problemas",
        },
        { value: "implementation", label: "Implementação de soluções" },
        {
          value: "facilitation",
          label: "Facilitação e gestão de mudança",
        },
        {
          value: "strategy",
          label: "Estratégia e planejamento de longo prazo",
        },
      ],
    },
    {
      key: "q8",
      title: "O maior risco nas suas reuniões é:",
      options: [
        {
          value: "insights",
          label: "Perder insights valiosos ditos no meio da conversa",
        },
        {
          value: "no-action",
          label: "Alinhamentos que não viram ação",
        },
        {
          value: "interpretation",
          label: "Cliente interpretar diferente do que foi acordado",
        },
        {
          value: "thread",
          label:
            "Perder o fio condutor entre várias reuniões do mesmo projeto",
        },
      ],
    },
  ],
  leadership: [
    {
      key: "q6",
      title: "Qual é o seu escopo principal de liderança?",
      options: [
        { value: "team", label: "Liderança direta de um time" },
        {
          value: "department",
          label: "Gestão de departamento ou área inteira",
        },
        {
          value: "company",
          label: "Direção executiva / C-level",
        },
      ],
    },
    {
      key: "q7",
      title: "Suas reuniões mais frequentes são com:",
      options: [
        { value: "team", label: "Meu time direto" },
        { value: "peers", label: "Outros líderes e pares" },
        { value: "board", label: "Diretoria ou conselho" },
        { value: "clients", label: "Clientes estratégicos" },
      ],
    },
    {
      key: "q8",
      title: "O maior desafio após uma reunião é:",
      options: [
        {
          value: "follow-through",
          label: "Garantir que decisões virem execução",
        },
        {
          value: "alignment",
          label: "Alinhar pessoas que não estavam presentes",
        },
        { value: "documentation", label: "Documentar decisões estratégicas" },
        { value: "priorities", label: "Manter prioridades claras ao longo do tempo" },
      ],
    },
  ],
  other: [
    {
      key: "q6",
      title: "Como você descreveria o principal tipo de trabalho que faz?",
      allowOther: true,
      options: [
        { value: "client-facing", label: "Atendimento a clientes" },
        { value: "internal", label: "Trabalho interno na empresa" },
        { value: "projects", label: "Projetos pontuais" },
        { value: "recurring", label: "Trabalho recorrente" },
      ],
    },
    {
      key: "q7",
      title: "Você trabalha mais sozinho ou em equipe?",
      options: [
        { value: "solo", label: "Majoritariamente sozinho" },
        { value: "small", label: "Em time pequeno" },
        { value: "large", label: "Em time grande" },
      ],
    },
    {
      key: "q8",
      title: "O maior problema nas suas reuniões é:",
      options: [
        { value: "forget", label: "Esquecer o que foi combinado" },
        {
          value: "unclear",
          label: "Sair sem clareza do próximo passo",
        },
        { value: "record", label: "Não ter um registro do que foi dito" },
        { value: "align", label: "Alinhar quem não estava na reunião" },
      ],
    },
  ],
};
