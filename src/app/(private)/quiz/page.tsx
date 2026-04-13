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

const TOTAL_STEPS = 12;

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

  if (showResult) {
    return <QuizResult state={state} onRestart={restart} />;
  }

  const progress = ((stepIndex + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-6">
      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-4 w-4" />
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">
            Vamos nos conhecer
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <motion.div
            className="bg-primary h-full rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-neutral-400">
          {stepIndex + 1} de {TOTAL_STEPS}
        </p>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-6"
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
                    onClick={() => toggleInList("postMeetingIssues", opt.value)}
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

      <footer className="flex items-center justify-between pt-2">
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
          className="min-w-32 text-white"
        >
          {stepIndex === TOTAL_STEPS - 1 ? "Ver resultado" : "Continuar"}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </footer>
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
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <h2 className="text-2xl leading-tight font-semibold text-neutral-900 sm:text-[28px]">
          {title}
        </h2>
        {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
