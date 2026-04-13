"use client";

import { cn } from "@/utils/cn";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Mic,
  Play,
  Send,
  Sparkles,
  Video,
  Volume2,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMeetingsStore } from "../_context/meetings-store";
import {
  getBriefingForMeeting,
} from "../_mocks/briefings";
import { getClientById } from "../_mocks/clients";
import { Meeting } from "../_types";

interface ChatMessage {
  id: string;
  sender: "agent" | "user";
  text: string;
}

function formatDurationLabel(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function buildInitialAgentMessage(bullets: string[]): string {
  if (bullets.length === 0) {
    return "Olá! Não encontrei registros anteriores com este contato. Como posso te ajudar a se preparar para esta reunião?";
  }
  const intro =
    "Olá! Revisei a última reunião com este contato e preparei um resumo rápido dos pontos principais para você. ";
  const body = bullets
    .map((b, i) => `${i === 0 ? "Primeiro, " : i === bullets.length - 1 ? "Por fim, " : ""}${b.toLowerCase().replace(/\.$/, "")}`)
    .join(". ");
  return `${intro}${body}. Quer que eu aprofunde algum desses pontos, ou tem alguma dúvida específica antes de entrar na reunião?`;
}

const agentCannedResponses = [
  "Boa pergunta. Posso buscar mais detalhes no histórico, mas pelo que tenho aqui o próximo passo seria confirmar a pendência com o cliente no começo da reunião.",
  "Nas notas da última conversa, esse ponto ficou em aberto. Sugiro abordar logo no início para não travar o andamento.",
  "Faz sentido. Posso preparar uma pauta curta com esse item em destaque se você quiser.",
  "Do que vi na transcrição anterior, esse assunto foi mencionado brevemente mas não houve decisão. Pode ser uma boa retomar.",
  "Concordo. É um ponto importante pra alinhar antes de qualquer tomada de decisão.",
];

interface PreMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: Meeting | null;
  onStartRecording: (meeting: Meeting) => void;
}

export function PreMeetingDialog({
  open,
  onOpenChange,
  meeting,
  onStartRecording,
}: PreMeetingDialogProps) {
  const { findLastMeetingWithClient } = useMeetingsStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [playTime, setPlayTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const briefing = useMemo(
    () => (meeting ? getBriefingForMeeting(meeting.id) : null),
    [meeting],
  );
  const client = useMemo(
    () => (meeting ? getClientById(meeting.clientId) : null),
    [meeting],
  );
  const lastMeeting = useMemo(
    () =>
      meeting
        ? findLastMeetingWithClient(meeting.clientId, meeting.id)
        : null,
    [meeting, findLastMeetingWithClient],
  );

  // Resumo do último encontro: prioriza o do briefing, senão deriva do último meeting real
  const lastMeetingSummary = useMemo(() => {
    if (briefing?.lastMeetingSummary) return briefing.lastMeetingSummary;
    if (lastMeeting) {
      const dur =
        (new Date(lastMeeting.end).getTime() -
          new Date(lastMeeting.start).getTime()) /
        1000;
      return {
        title: lastMeeting.title,
        date: format(new Date(lastMeeting.start), "d 'de' MMM", { locale: ptBR }),
        mediaType: (lastMeeting.source === "teams" ||
        lastMeeting.source === "google"
          ? "video"
          : "audio") as "audio" | "video",
        durationSeconds: dur,
      };
    }
    return null;
  }, [briefing, lastMeeting]);

  useEffect(() => {
    if (!open || !briefing) return;
    setMessages([
      {
        id: "agent-init",
        sender: "agent",
        text: buildInitialAgentMessage(briefing.bullets),
      },
    ]);
    setInput("");
    setTyping(false);
    setPlayTime(0);
    setIsPlaying(false);
  }, [open, briefing]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  // Simulador de playback do player mock
  useEffect(() => {
    if (!isPlaying || !lastMeetingSummary) return;
    const id = setInterval(() => {
      setPlayTime((t) => {
        const next = t + 1;
        if (next >= lastMeetingSummary.durationSeconds) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, lastMeetingSummary]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(
      () => {
        const reply =
          agentCannedResponses[
            Math.floor(Math.random() * agentCannedResponses.length)
          ];
        setMessages((prev) => [
          ...prev,
          { id: `a-${Date.now()}`, sender: "agent", text: reply },
        ]);
        setTyping(false);
      },
      900 + Math.random() * 600,
    );
  }, [input]);

  if (!meeting) return null;

  const meetingWhen = format(
    new Date(meeting.start),
    "EEEE, d 'de' MMM · HH:mm",
    { locale: ptBR },
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[9998] bg-stone-950/75 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          data-lenis-prevent
          className="fixed top-[50%] left-[50%] z-[9999] flex max-h-[92vh] w-[95vw] max-w-6xl -translate-x-[50%] -translate-y-[50%] flex-col overflow-hidden rounded-3xl border border-stone-800 bg-white shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 md:flex-row md:min-h-[560px]"
        >
          <DialogPrimitive.Title className="sr-only">
            Briefing pré-reunião
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Prepare-se para a próxima reunião com o resumo dos pontos
            principais e o chat com o agente.
          </DialogPrimitive.Description>

          {/* Painel esquerdo — player + bullets */}
          <div className="relative flex w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 p-6 text-white md:w-[45%] md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(171,142,99,0.15),transparent_60%)]" />

            {/* Topo — player mock da última reunião */}
            <div className="relative z-10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#d4b98a]">
                <Sparkles className="h-3.5 w-3.5" />
                Última reunião com {client?.name ?? "este contato"}
              </div>

              {lastMeetingSummary ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#AB8E63] to-[#8f7652] text-white shadow-md shadow-black/30">
                      {lastMeetingSummary.mediaType === "video" ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white">
                        {lastMeetingSummary.title}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        {lastMeetingSummary.date} ·{" "}
                        {lastMeetingSummary.mediaType === "video"
                          ? "Vídeo"
                          : "Áudio"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#AB8E63] text-white shadow-md shadow-[#AB8E63]/40 transition-all hover:scale-105"
                      aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                    >
                      <Play
                        className={cn("h-3.5 w-3.5", isPlaying && "hidden")}
                        fill="currentColor"
                      />
                      <span
                        className={cn(
                          "flex gap-0.5",
                          !isPlaying && "hidden",
                        )}
                      >
                        <span className="h-2.5 w-[3px] bg-white" />
                        <span className="h-2.5 w-[3px] bg-white" />
                      </span>
                    </button>
                    <div className="flex-1">
                      <div className="h-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#AB8E63] to-[#d4b98a] transition-all"
                          style={{
                            width: `${
                              (playTime / lastMeetingSummary.durationSeconds) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] font-mono text-stone-400">
                        <span>{formatDurationLabel(playTime)}</span>
                        <span>
                          {formatDurationLabel(
                            lastMeetingSummary.durationSeconds,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-stone-500 italic">
                    Player mock · sem mídia real anexada
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-stone-400">
                  Sem reuniões anteriores registradas com este contato.
                </div>
              )}
            </div>

            {/* Inferior — bullet points */}
            <div className="relative z-10 mt-8 flex flex-col gap-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#d4b98a]">
                Pontos pra revisar antes da reunião
              </h3>
              <ul className="flex flex-col gap-2.5">
                {briefing?.bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm leading-snug text-stone-100"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#AB8E63]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Painel direito — chat do agente + botão */}
          <div className="relative flex w-full flex-col bg-white md:w-[55%]">
            <div className="flex items-start justify-between border-b border-stone-200 px-5 py-4">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold text-stone-800">
                  {meeting.title}
                </h2>
                <p className="mt-0.5 text-xs capitalize text-stone-500">
                  {meetingWhen}
                </p>
              </div>
              <DialogPrimitive.Close
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </DialogPrimitive.Close>
            </div>

            <div
              ref={scrollRef}
              data-lenis-prevent
              className="flex-1 overflow-y-auto bg-stone-50/30 px-5 py-4"
            >
              <div className="flex flex-col gap-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex",
                      m.sender === "agent" ? "justify-start" : "justify-end",
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                        m.sender === "agent"
                          ? "rounded-bl-sm bg-white text-stone-800 border border-stone-200"
                          : "rounded-br-sm bg-gradient-to-br from-[#AB8E63] to-[#8f7652] text-white",
                      )}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-stone-200 bg-white px-4 py-3 shadow-sm">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:0ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-stone-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-stone-200 px-5 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Pergunte algo sobre a última reunião..."
                  className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 outline-none focus:border-[#AB8E63] focus:ring-2 focus:ring-[#AB8E63]/30"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() || typing}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#AB8E63] to-[#8f7652] text-white shadow-md shadow-[#AB8E63]/30 transition-all hover:shadow-[#AB8E63]/50 disabled:opacity-40"
                  aria-label="Enviar"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border-t border-stone-200 bg-stone-50 px-5 py-4">
              <button
                type="button"
                onClick={() => onStartRecording(meeting)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#AB8E63] to-[#8f7652] py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#AB8E63]/30 transition-all hover:shadow-[#AB8E63]/50 active:scale-[0.99]"
              >
                <Mic className="h-5 w-5" />
                Iniciar Gravação da reunião
              </button>
              <p className="mt-1.5 text-center text-[10px] text-stone-400">
                Vai abrir o fluxo de gravação com o contato já selecionado
              </p>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
