"use client";

import { Button } from "@/components/ui/blocks/button";
import { Input } from "@/components/ui/blocks/input";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { OptionButton } from "./components/option-button";
import { QuizResult } from "./components/quiz-result";
import {
  SearchableSelect,
  type SearchableOption,
} from "./components/searchable-select";
import {
  brazilianStates,
  companySizeOptions,
  finalValueOptions,
  postMeetingIssuesOptions,
  roleOptions,
  sectorOptions,
  sectorQuestions,
  toolsOptions,
} from "./data";
import { initialQuizState, type QuizState } from "./types";
import Image from "next/image";

const TOTAL_STEPS = 12;

const CHAPTERS = [
  {
    name: "Sobre você",
    subtitle: "Quem está do outro lado da tela.",
    line: "Toda boa parceria começa com um olá.",
    start: 0,
    end: 2,
  },
  {
    name: "Seu negócio",
    subtitle: "O contexto em que você vive todos os dias.",
    line: "Para entender o seu mundo, a gente precisa enxergá-lo.",
    start: 3,
    end: 7,
  },
  {
    name: "Sua rotina",
    subtitle: "Como você organiza o que realmente importa.",
    line: "Quanto melhor te conhecemos, mais útil podemos ser.",
    start: 8,
    end: 11,
  },
];

export default function QuizPage() {
  const [state, setState] = useState<QuizState>(initialQuizState);
  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const [cities, setCities] = useState<SearchableOption[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const update = <K extends keyof QuizState>(key: K, value: QuizState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!state.state) {
      setCities([]);
      return;
    }
    const controller = new AbortController();
    setLoadingCities(true);
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state.state}/municipios`,
      { signal: controller.signal },
    )
      .then((r) => r.json())
      .then((data: { id: number; nome: string }[]) => {
        setCities(
          data
            .map((c) => ({ value: c.nome, label: c.nome }))
            .sort((a, b) => a.label.localeCompare(b.label, "pt-BR")),
        );
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Erro ao buscar cidades:", err);
          setCities([]);
        }
      })
      .finally(() => setLoadingCities(false));

    return () => controller.abort();
  }, [state.state]);

  const stateOptions: SearchableOption[] = useMemo(
    () =>
      brazilianStates.map((s) => ({
        value: s.value,
        label: s.label,
        sublabel: s.value,
      })),
    [],
  );

  const toggleInList = (key: "postMeetingIssues" | "tools", value: string) => {
    setState((prev) => {
      const list = prev[key];
      if (list.includes(value)) {
        return { ...prev, [key]: list.filter((v) => v !== value) };
      }
      if (key === "postMeetingIssues" && list.length >= 2) {
        return { ...prev, [key]: [list[1], value] };
      }
      return { ...prev, [key]: [...list, value] };
    });
  };

  const sectorQs = state.sector ? sectorQuestions[state.sector] : [];
  const q6 = sectorQs.find((q) => q.key === "q6");
  const q7 = sectorQs.find((q) => q.key === "q7");
  const q8 = sectorQs.find((q) => q.key === "q8");

  const isStepValid = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return state.name.trim().length > 0;
      case 1:
        return state.company.trim().length > 0;
      case 2:
        return state.city.trim().length > 0 && state.state.trim().length > 0;
      case 3:
        return state.companySize !== "";
      case 4:
        if (state.sector === "") return false;
        if (state.sector === "other")
          return state.sectorOther.trim().length > 0;
        return true;
      case 5:
        if (!state.q6) return false;
        if (state.q6 === "other") return state.q6Other.trim().length > 0;
        return true;
      case 6:
        return state.q7 !== "";
      case 7:
        return state.q8 !== "";
      case 8:
        return state.role !== "";
      case 9:
        return state.postMeetingIssues.length > 0;
      case 10:
        if (state.tools.length === 0) return false;
        if (state.tools.includes("other"))
          return state.toolsOther.trim().length > 0;
        return true;
      case 11:
        return state.finalValue !== "";
      default:
        return false;
    }
  }, [state, stepIndex]);

  const goNext = () => {
    if (!isStepValid) return;
    if (stepIndex === TOTAL_STEPS - 1) {
      setShowResult(true);
      return;
    }
    setStepIndex((i) => i + 1);
  };

  const goBack = () => {
    if (stepIndex === 0) return;
    setStepIndex((i) => i - 1);
  };

  const restart = () => {
    setState(initialQuizState);
    setStepIndex(0);
    setShowResult(false);
  };

  const currentChapterIdx = useMemo(
    () => CHAPTERS.findIndex((c) => stepIndex >= c.start && stepIndex <= c.end),
    [stepIndex],
  );
  const currentChapter = CHAPTERS[currentChapterIdx] ?? CHAPTERS[0];

  const chapterFill = (idx: number) => {
    if (currentChapterIdx > idx) return 100;
    if (currentChapterIdx < idx) return 0;
    const ch = CHAPTERS[idx];
    const len = ch.end - ch.start + 1;
    return ((stepIndex - ch.start + 1) / len) * 100;
  };

  if (showResult) {
    return (
      <div className="min-h-screen w-full bg-neutral-50 px-6 py-10">
        <QuizResult state={state} onRestart={restart} />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#0a0a0a] text-white md:flex-row">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 h-[100vh] w-[60%] overflow-hidden"
      >
        <Image
          src="/registerModal/Jurid_1.jpg.jpeg"
          alt="Jurid.IA Voice Logo"
          width={1000}
          height={1000}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(8,8,12,0.92)_0%,rgba(8,8,12,0.7)_35%,rgba(8,8,12,0.25)_70%,rgba(8,8,12,0.15)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,12,0.55)_0%,transparent_18%,transparent_70%,rgba(8,8,12,0.75)_100%)]" />
        <motion.div
          className="bg-primary/20 absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full mix-blend-screen blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="bg-primary/15 absolute -bottom-24 left-1/3 h-[360px] w-[360px] rounded-full mix-blend-screen blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <aside className="relative flex min-h-[60vh] flex-col justify-between overflow-y-hidden p-8 md:min-h-screen md:w-[44%] md:p-12 lg:p-16">
        <div className="relative flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-md">
            <Sparkles className="text-primary h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-[0.22em] text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            Jurid
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapterIdx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative space-y-7"
          >
            <span className="border-primary/30 bg-primary/15 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.22em] uppercase backdrop-blur-md">
              <span className="bg-primary h-1.5 w-1.5 rounded-full" />
              Capítulo {String(currentChapterIdx + 1).padStart(2, "0")} de{" "}
              {String(CHAPTERS.length).padStart(2, "0")}
            </span>
            <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] md:text-5xl lg:text-[56px]">
              {currentChapter.name}.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-white/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
              {currentChapter.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="relative space-y-6">
          <div className="flex items-center gap-3">
            {CHAPTERS.map((chapter, idx) => (
              <div
                key={chapter.name}
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15 backdrop-blur-sm"
              >
                <motion.div
                  className="bg-primary h-full rounded-full shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  initial={false}
                  animate={{ width: `${chapterFill(idx)}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            ))}
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-white/55 italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            “{currentChapter.line}”
          </p>
        </div>
      </aside>

      <main className="relative flex flex-1 items-center justify-center bg-white px-6 py-12 md:rounded-l-[2.5rem] md:px-14 md:py-16 lg:px-20">
        <div className="flex w-full max-w-xl flex-col gap-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col gap-7"
            >
              {stepIndex === 0 && (
                <Step
                  title="Como você prefere ser chamado(a)?"
                  subtitle="Pode ser só o primeiro nome ou um apelido — fica mais leve assim."
                >
                  <Input
                    autoFocus
                    value={state.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Ex: Ana, Dr. João, Júnior..."
                    variant="bordered"
                    radius="md"
                    size="lg"
                    removeWrapper
                  />
                </Step>
              )}

              {stepIndex === 1 && (
                <Step
                  title="E o nome da sua empresa ou negócio?"
                  subtitle="Se for autônomo ou freelancer, pode colocar seu nome mesmo."
                >
                  <Input
                    autoFocus
                    value={state.company}
                    onChange={(e) => update("company", e.target.value)}
                    placeholder="Ex: Acme LTDA"
                    variant="bordered"
                    radius="md"
                    size="lg"
                    removeWrapper
                  />
                </Step>
              )}

              {stepIndex === 2 && (
                <Step
                  title="Onde você está localizado(a)?"
                  subtitle="Primeiro o estado e depois a cidade — a gente usa pra adaptar o contexto."
                >
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-500">
                        Estado
                      </label>
                      <SearchableSelect
                        options={stateOptions}
                        value={state.state}
                        onChange={(v) => {
                          update("state", v);
                          if (v !== state.state) update("city", "");
                        }}
                        placeholder="Selecione o estado..."
                        searchPlaceholder="Buscar estado..."
                        emptyMessage="Estado não encontrado."
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-neutral-500">
                        Cidade
                      </label>
                      <SearchableSelect
                        options={cities}
                        value={state.city}
                        onChange={(v) => update("city", v)}
                        placeholder="Selecione a cidade..."
                        searchPlaceholder="Buscar cidade..."
                        emptyMessage="Nenhuma cidade encontrada."
                        disabled={!state.state || loadingCities}
                        loading={loadingCities}
                        disabledMessage={
                          !state.state
                            ? "Selecione um estado primeiro"
                            : undefined
                        }
                      />
                    </div>
                  </div>
                </Step>
              )}

              {stepIndex === 3 && (
                <Step
                  title="Qual é o tamanho da sua empresa hoje?"
                  subtitle="Isso ajuda a gente a dimensionar o contexto do seu dia a dia."
                >
                  <div className="grid gap-3">
                    {companySizeOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        icon={opt.icon}
                        selected={state.companySize === opt.value}
                        onClick={() =>
                          update(
                            "companySize",
                            opt.value as QuizState["companySize"],
                          )
                        }
                      />
                    ))}
                  </div>
                </Step>
              )}

              {stepIndex === 4 && (
                <Step
                  title="Em qual área você atua?"
                  subtitle="Escolha a que mais representa o seu dia a dia."
                >
                  <div className="grid gap-3">
                    {sectorOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        icon={opt.icon}
                        selected={state.sector === opt.value}
                        onClick={() =>
                          update("sector", opt.value as QuizState["sector"])
                        }
                      />
                    ))}
                    {state.sector === "other" && (
                      <Input
                        autoFocus
                        value={state.sectorOther}
                        onChange={(e) => update("sectorOther", e.target.value)}
                        placeholder="Me conta o que você faz..."
                        variant="bordered"
                        radius="md"
                        size="lg"
                        removeWrapper
                        className="mt-1"
                      />
                    )}
                  </div>
                </Step>
              )}

              {stepIndex === 5 && q6 && (
                <Step title={q6.title}>
                  <div className="grid gap-3">
                    {q6.options.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        selected={state.q6 === opt.value}
                        onClick={() => update("q6", opt.value)}
                      />
                    ))}
                    {q6.allowOther && (
                      <OptionButton
                        label="Outro"
                        selected={state.q6 === "other"}
                        onClick={() => update("q6", "other")}
                      />
                    )}
                    {state.q6 === "other" && (
                      <Input
                        autoFocus
                        value={state.q6Other}
                        onChange={(e) => update("q6Other", e.target.value)}
                        placeholder="Me conta mais..."
                        variant="bordered"
                        radius="md"
                        size="lg"
                        removeWrapper
                        className="mt-1"
                      />
                    )}
                  </div>
                </Step>
              )}

              {stepIndex === 6 && q7 && (
                <Step title={q7.title}>
                  <div className="grid gap-3">
                    {q7.options.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        selected={state.q7 === opt.value}
                        onClick={() => update("q7", opt.value)}
                      />
                    ))}
                  </div>
                </Step>
              )}

              {stepIndex === 7 && q8 && (
                <Step title={q8.title}>
                  <div className="grid gap-3">
                    {q8.options.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        selected={state.q8 === opt.value}
                        onClick={() => update("q8", opt.value)}
                      />
                    ))}
                  </div>
                </Step>
              )}

              {stepIndex === 8 && (
                <Step
                  title="Dentro do seu trabalho, você é mais..."
                  subtitle="Escolha o papel que melhor descreve seu dia a dia."
                >
                  <div className="grid gap-3">
                    {roleOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        selected={state.role === opt.value}
                        onClick={() => update("role", opt.value)}
                      />
                    ))}
                  </div>
                </Step>
              )}

              {stepIndex === 9 && (
                <Step
                  title="Depois de uma reunião, o que mais te incomoda?"
                  subtitle="Escolha até 2 opções."
                >
                  <div className="grid gap-3">
                    {postMeetingIssuesOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        selected={state.postMeetingIssues.includes(opt.value)}
                        disabled={
                          !state.postMeetingIssues.includes(opt.value) &&
                          state.postMeetingIssues.length >= 2
                        }
                        onClick={() =>
                          toggleInList("postMeetingIssues", opt.value)
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-400">
                    {state.postMeetingIssues.length}/2 selecionadas
                  </p>
                </Step>
              )}

              {stepIndex === 10 && (
                <Step
                  title="Onde você registra tarefas e compromissos hoje?"
                  subtitle="Pode marcar mais de um."
                >
                  <div className="grid gap-3">
                    {toolsOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        selected={state.tools.includes(opt.value)}
                        onClick={() => toggleInList("tools", opt.value)}
                      />
                    ))}
                    <OptionButton
                      label="Outro"
                      selected={state.tools.includes("other")}
                      onClick={() => toggleInList("tools", "other")}
                    />
                    {state.tools.includes("other") && (
                      <Input
                        autoFocus
                        value={state.toolsOther}
                        onChange={(e) => update("toolsOther", e.target.value)}
                        placeholder="Qual ferramenta?"
                        variant="bordered"
                        radius="md"
                        size="lg"
                        removeWrapper
                        className="mt-1"
                      />
                    )}
                  </div>
                </Step>
              )}

              {stepIndex === 11 && (
                <Step
                  title="Se a gente te ajudasse em uma coisa só depois das suas reuniões..."
                  subtitle="Qual seria a mais valiosa pra você?"
                >
                  <div className="grid gap-3">
                    {finalValueOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        label={opt.label}
                        selected={state.finalValue === opt.value}
                        onClick={() => update("finalValue", opt.value)}
                      />
                    ))}
                  </div>
                </Step>
              )}
            </motion.div>
          </AnimatePresence>

          <footer className="flex items-center justify-between border-t border-neutral-100 pt-6">
            <Button
              variant="ghost"
              color="secondary"
              onClick={goBack}
              disabled={stepIndex === 0}
              className={cn(stepIndex === 0 && "invisible")}
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Voltar
            </Button>

            <Button
              color="primary"
              onClick={goNext}
              disabled={!isStepValid}
              className="min-w-36 text-white"
            >
              {stepIndex === TOTAL_STEPS - 1
                ? "Finalizar conversa"
                : "Continuar"}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <h2 className="text-[28px] leading-[1.15] font-semibold tracking-tight text-neutral-900 sm:text-[32px]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[15px] leading-relaxed text-neutral-500">
            {subtitle}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
