"use client";

import { ClientProps } from "@/@types/general-client";
import { useApiContext } from "@/context/ApiContext";
import { useSession } from "@/context/auth";
import { useGeneralContext } from "@/context/GeneralContext";
import { trackAction, UserActionType } from "@/services/actionTrackingService";
import { cn } from "@/utils/cn";
import { handleApiError } from "@/utils/error-handler";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Mic,
  Pause,
  RefreshCw,
  Send,
  UserPlus,
  Video,
  Volume2,
  X,
} from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { useMediaRecorder } from "../audio-recorder/use-media-recorder";
import { useRecordingFlow } from "../audio-recorder/use-recording-flow";
import { useRecordingUpload } from "../audio-recorder/use-recording-upload";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/blocks/dropdown-menu";
import { CreateClientSheet } from "../ui/create-client-sheet";

const CAROUSEL_IMAGES = [
  "/imagens/handsome-businessman-com-laptop-na-mesa_23-2147689170.avif",
  "/imagens/pexels-edwardeyer-8336244.jpg",
  "/imagens/pexels-edwardeyer-19787808.jpg",
  "/imagens/pexels-estevam-foto-20714753-16778621.jpg",
  "/imagens/pexels-felicity-tai-7964522.jpg",
  "/imagens/pexels-shkrabaanthony-7163364.jpg",
  "/imagens/pexels-stephanie-lima-455905576-16051533.jpg",
];

const getMediaTypeFromMetadata = (metadata: {
  recordingType: string;
  consultationType: string | null;
}): "audio" | "video" => {
  return metadata.recordingType === "CLIENT" &&
    metadata.consultationType === "ONLINE"
    ? "video"
    : "audio";
};

interface AudioRecorderV2Props {
  buttonClassName?: string;
  customLabel?: string;
  customIcon?: React.ComponentType<{ className?: string }>;
  initialClientId?: string;
  skipNewRecordingRequest?: boolean;
  /**
   * Quando definido, o componente entra em modo controlado externamente:
   * o botão trigger NÃO é renderizado e o fluxo é iniciado via `externalOpen`.
   */
  hideTrigger?: boolean;
  /** No modo controlado, true abre o modal direto em save-dialog. */
  externalOpen?: boolean;
  /** Chamado quando o usuário fecha o modal no modo controlado. */
  onExternalOpenChange?: (open: boolean) => void;
  /**
   * Modo "dry run" — todas as chamadas de backend (upload, POST /recording,
   * refetch de gravações/disponibilidade, tracking, cadastro de contato) são
   * curto-circuitadas. Serve para validação de UX sem afetar dados reais.
   * Quando true, o modal exibe um badge "Modo Demo".
   */
  dryRun?: boolean;
}

export function AudioRecorderV2({
  buttonClassName,
  customLabel,
  customIcon: CustomIcon,
  initialClientId,
  skipNewRecordingRequest = false,
  hideTrigger = false,
  externalOpen,
  onExternalOpenChange,
  dryRun = false,
}: AudioRecorderV2Props) {
  const {
    GetRecordings,
    clients,
    selectedClient,
    newRecordingRequest,
    resetNewRecordingRequest,
  } = useGeneralContext();
  const { PostAPI } = useApiContext();
  const { handleGetAvailableRecording } = useSession();
  const { uploadMedia, formatDurationForAPI } = useRecordingUpload();

  const [isCreateClientSheetOpen, setIsCreateClientSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [tempCreatedClient, setTempCreatedClient] =
    useState<ClientProps | null>(null);
  const [pendingClientName, setPendingClientName] = useState<string | null>(
    null,
  );

  const resetRecorderRef = useRef(() => {});
  const {
    currentStep,
    setCurrentStep,
    metadata,
    updateMetadata,
    error,
    setError,
    validateForm,
    resetFlow: originalResetFlow,
    openSaveDialog,
  } = useRecordingFlow(resetRecorderRef.current);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);

  const currentMediaType = getMediaTypeFromMetadata(metadata);

  const recorder = useMediaRecorder({
    mediaType: currentMediaType,
    onComplete: undefined,
    onError: (err) => {
      setError(err.message);
      setCurrentStep("idle");
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    resetRecorderRef.current = recorder.resetRecording;
  }, [recorder.resetRecording]);

  useEffect(() => {
    if (pendingClientName && clients.length > 0) {
      const found = clients.find((c) => c.name === pendingClientName);
      if (found) {
        updateMetadata({ selectedClientId: found.id });
        setPendingClientName(null);
        setTempCreatedClient(null);
      }
    }
  }, [clients, pendingClientName, updateMetadata]);

  useEffect(() => {
    if (currentStep === "idle") return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [currentStep]);

  const resetFlow = useCallback(() => {
    const hasPendingRecording =
      recorder.mediaBlob &&
      (currentStep === "preview" ||
        currentStep === "save-dialog" ||
        currentStep === "recording");

    if (hasPendingRecording && !dryRun) {
      trackAction(
        {
          actionType: UserActionType.RECORDING_CANCELLED,
          metadata: {
            recordingType: metadata.recordingType,
            consultationType: metadata.consultationType,
            personalRecordingType: metadata.personalRecordingType,
            duration: recorder.duration,
            hadBlob: !!recorder.mediaBlob,
            step: currentStep,
          },
        },
        PostAPI,
      ).catch((err) => {
        console.warn("Erro ao registrar tracking de cancelamento:", err);
      });
    }

    originalResetFlow();
  }, [
    recorder.mediaBlob,
    recorder.duration,
    currentStep,
    metadata,
    PostAPI,
    originalResetFlow,
    dryRun,
  ]);

  const getDerivedTitle = () => {
    if (metadata.name) return metadata.name;
    return "Gravação do Cliente";
  };

  const getDerivedDescription = () => {
    if (metadata.description) return metadata.description;
    const date = moment().format("DD/MM/YYYY HH:mm:ss");
    const type =
      metadata.consultationType === "IN_PERSON" ? "presencial" : "online";
    return `Reunião ${type} realizada em ${date}`;
  };

  const handleRecordingComplete = async (
    blob: Blob,
    duration: number,
    finalMediaType: "audio" | "video",
  ) => {
    // Dry run: simula um pequeno delay de processamento e encerra o fluxo
    // sem qualquer chamada de backend (upload, POST, refetch, etc.)
    if (dryRun) {
      setCurrentStep("processing");
      await new Promise((resolve) => setTimeout(resolve, 700));
      toast.success("Gravação simulada (modo demo) — nada foi enviado.");
      resetFlow();
      return;
    }

    try {
      setCurrentStep("processing");

      const uploadedUrl = await uploadMedia(blob, finalMediaType);
      const payload = {
        name: metadata.name.trim() || getDerivedTitle(),
        description: metadata.description || getDerivedDescription(),
        duration: formatDurationForAPI(duration),
        seconds: duration,
        audioUrl: uploadedUrl,
        type: "CLIENT",
        ...(metadata.selectedClientId
          ? { clientId: metadata.selectedClientId }
          : {}),
      };

      const response = await PostAPI("/recording", payload, true);

      if (response?.status >= 400) {
        const errorMessage = handleApiError(
          response,
          "Erro ao salvar gravação. Tente novamente.",
        );
        setError(errorMessage);
        toast.error(errorMessage);
        setCurrentStep("preview");
        return;
      }

      toast.success("Gravação salva com sucesso!");
      GetRecordings();
      handleGetAvailableRecording();
      resetFlow();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage =
        err.message || "Erro ao salvar gravação. Tente novamente.";
      setError(errorMessage);
      toast.error(errorMessage);
      setCurrentStep("preview");
    }
  };

  useEffect(() => {
    if (
      recorder.mediaBlob &&
      !recorder.isRecording &&
      currentStep === "recording"
    ) {
      setCurrentStep("preview");
    }
  }, [recorder.mediaBlob, recorder.isRecording, currentStep, setCurrentStep]);

  useEffect(() => {
    if (currentStep === "preview" && recorder.mediaUrl) {
      if (currentMediaType === "video" && videoPreviewRef.current) {
        videoPreviewRef.current.src = recorder.mediaUrl;
        videoPreviewRef.current.load();
      } else if (currentMediaType === "audio" && audioPreviewRef.current) {
        audioPreviewRef.current.src = recorder.mediaUrl;
        audioPreviewRef.current.load();
      }
    }
  }, [currentStep, recorder.mediaUrl, currentMediaType]);

  const handleStartRecording = async () => {
    if (!validateForm()) return;

    if (currentMediaType === "video") {
      setCurrentStep("instructions");
      return;
    }

    try {
      await recorder.startRecording();
      setCurrentStep("recording");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorMessage = "Erro ao iniciar gravação";
      if (err.name === "NotAllowedError") {
        errorMessage = "Permissão negada. Permita o acesso ao microfone.";
      } else if (err.name === "NotFoundError") {
        errorMessage = "Nenhum microfone encontrado.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setCurrentStep("save-dialog");
    }
  };

  const handleStartVideoRecording = async () => {
    try {
      await recorder.startRecording();
      setCurrentStep("recording");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      let errorMessage = "Erro ao iniciar gravação de vídeo";
      if (err.name === "NotAllowedError") {
        errorMessage = "Permissão negada. Permita o compartilhamento de tela.";
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setCurrentStep("save-dialog");
    }
  };

  const handleConfirmRecording = () => {
    setError("");
    if (recorder.mediaBlob) {
      handleRecordingComplete(
        recorder.mediaBlob,
        recorder.duration,
        currentMediaType,
      );
    }
  };

  const handleRetryRecording = () => {
    recorder.resetRecording();
    setCurrentStep("save-dialog");
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    originalResetFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Modo controlado externamente: abre/fecha via prop
  useEffect(() => {
    if (externalOpen === undefined) return;
    if (externalOpen && currentStep === "idle") {
      openSaveDialog("CLIENT");
    } else if (!externalOpen && currentStep !== "idle") {
      originalResetFlow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalOpen]);

  // Avisa o pai quando o modal fecha internamente (botão X, backdrop, etc.)
  useEffect(() => {
    if (externalOpen === undefined) return;
    if (externalOpen && currentStep === "idle") {
      onExternalOpenChange?.(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  useEffect(() => {
    if (skipNewRecordingRequest || !newRecordingRequest || currentStep !== "idle") {
      return;
    }
    const { type } = newRecordingRequest;
    resetNewRecordingRequest();
    if (type === "CLIENT") {
      openSaveDialog("CLIENT");
    }
  }, [
    newRecordingRequest,
    currentStep,
    skipNewRecordingRequest,
    resetNewRecordingRequest,
    openSaveDialog,
  ]);

  useEffect(() => {
    const isModalOpen = currentStep !== "idle";
    const body = document.body;
    if (isModalOpen) {
      body.classList.add("no-scroll");
    } else {
      body.classList.remove("no-scroll");
    }
    return () => {
      body.classList.remove("no-scroll");
    };
  }, [currentStep]);

  useEffect(() => {
    const clientId = initialClientId || selectedClient?.id;
    if (clientId && currentStep === "save-dialog" && !metadata.selectedClientId) {
      updateMetadata({ selectedClientId: clientId });
    }
  }, [
    initialClientId,
    selectedClient?.id,
    currentStep,
    metadata.selectedClientId,
    updateMetadata,
  ]);

  const renderTriggerButton = () => {
    if (hideTrigger) return null;
    const IconComponent = CustomIcon || Mic;
    const label = customLabel || "Nova Gravação";
    return (
      <button
        type="button"
        onClick={() => openSaveDialog("CLIENT")}
        className={cn(
          "flex cursor-pointer items-center gap-2 rounded-3xl px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30",
          buttonClassName,
        )}
      >
        <IconComponent className="h-5 w-5" />
        {label}
      </button>
    );
  };

  const currentSelectedClient = (() => {
    if (!metadata.selectedClientId) return null;
    const fromList = clients.find((c) => c.id === metadata.selectedClientId);
    if (fromList) return fromList;
    if (tempCreatedClient?.id === metadata.selectedClientId) {
      return tempCreatedClient;
    }
    return null;
  })();

  return (
    <>
      {currentStep === "idle" && renderTriggerButton()}

      {mounted &&
        createPortal(
          <div
            data-lenis-prevent
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                if (currentStep === "recording") return;
                resetFlow();
              }
            }}
            className={cn(
              "animate-in fade-in fixed inset-0 z-[99999] flex items-center justify-center overflow-y-auto bg-stone-950/70 p-4 backdrop-blur-[6px] duration-300",
              currentStep === "idle" && "hidden",
            )}
          >
            <div
              data-lenis-prevent
              className="animate-in zoom-in-95 slide-in-from-bottom-5 relative my-auto flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl duration-500 md:min-h-[540px] md:flex-row"
            >
              {/* Hero panel (hidden on mobile) */}
              <div className="relative hidden w-1/2 overflow-hidden bg-stone-900 md:block">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent" />

                <div className="absolute top-10 left-10 z-20">
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#AB8E63] shadow-[0_0_8px_rgba(171,142,99,0.8)]" />
                    <span className="text-xs font-semibold tracking-wide text-white">
                      Gravação Inteligente
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 z-20 max-w-md pr-8 text-white">
                  <h3 className="text-3xl leading-tight font-bold tracking-tight">
                    Transforme reuniões <br /> em insights valiosos.
                  </h3>
                  <p className="mt-4 text-base leading-relaxed font-light text-stone-100/90">
                    Grave, transcreva e analise suas conversas com inteligência
                    artificial.
                  </p>
                </div>

                {CAROUSEL_IMAGES.map((img, index) => (
                  <div
                    key={img}
                    className={cn(
                      "absolute inset-0 h-full w-full transform bg-cover bg-center transition-all duration-1000 ease-in-out",
                      index === currentImageIndex
                        ? "scale-105 opacity-100"
                        : "scale-100 opacity-0",
                    )}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}

                <div className="absolute right-10 bottom-10 z-20 flex gap-2">
                  {CAROUSEL_IMAGES.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 rounded-full transition-all duration-300",
                        i === currentImageIndex
                          ? "w-8 bg-[#AB8E63]"
                          : "w-2 bg-white/30",
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Form panel */}
              <div
                data-lenis-prevent
                className="relative flex w-full flex-col overflow-y-auto bg-white md:w-1/2"
              >
                {currentStep === "save-dialog" && (
                  <div className="p-6 md:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-stone-800">
                          Nova Gravação
                        </h2>
                        {dryRun && (
                          <span className="inline-flex items-center rounded-full border border-[#AB8E63]/40 bg-[#AB8E63]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8f7652]">
                            Modo Demo
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={resetFlow}
                        className="text-stone-500 transition-colors hover:text-stone-700"
                        aria-label="Fechar"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    {error && (
                      <div className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700">
                          Nome da Gravação
                        </label>
                        <input
                          type="text"
                          value={metadata.name}
                          onChange={(e) =>
                            updateMetadata({ name: e.target.value })
                          }
                          placeholder="Ex: Consulta - João Silva"
                          className="w-full rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition-all focus:border-[#AB8E63] focus:ring-2 focus:ring-[#AB8E63]/30"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700">
                          Descrição
                        </label>
                        <textarea
                          value={metadata.description}
                          onChange={(e) =>
                            updateMetadata({ description: e.target.value })
                          }
                          onWheel={(e) => e.stopPropagation()}
                          placeholder="Descrição da gravação (opcional)"
                          className="h-28 w-full resize-none rounded-lg border border-stone-300 px-4 py-3 text-stone-900 outline-none transition-all focus:border-[#AB8E63] focus:ring-2 focus:ring-[#AB8E63]/30"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700">
                          Tipo de Reunião
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() =>
                              updateMetadata({ consultationType: "IN_PERSON" })
                            }
                            className={cn(
                              "group rounded-lg border-2 p-4 transition-all",
                              metadata.consultationType === "IN_PERSON"
                                ? "border-[#AB8E63] bg-[#AB8E63]/10 shadow-sm"
                                : "border-stone-300 hover:border-[#AB8E63]/60 hover:bg-stone-50",
                            )}
                          >
                            <Mic
                              className={cn(
                                "mx-auto mb-2 h-6 w-6 transition-colors",
                                metadata.consultationType === "IN_PERSON"
                                  ? "text-[#8f7652]"
                                  : "text-stone-500 group-hover:text-[#8f7652]",
                              )}
                            />
                            <p
                              className={cn(
                                "font-semibold transition-colors",
                                metadata.consultationType === "IN_PERSON"
                                  ? "text-[#8f7652]"
                                  : "text-stone-800",
                              )}
                            >
                              Presencial
                            </p>
                            <p className="mt-1 text-xs text-stone-500">
                              Apenas áudio
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateMetadata({ consultationType: "ONLINE" })
                            }
                            className={cn(
                              "group rounded-lg border-2 p-4 transition-all",
                              metadata.consultationType === "ONLINE"
                                ? "border-[#AB8E63] bg-[#AB8E63]/10 shadow-sm"
                                : "border-stone-300 hover:border-[#AB8E63]/60 hover:bg-stone-50",
                            )}
                          >
                            <Video
                              className={cn(
                                "mx-auto mb-2 h-6 w-6 transition-colors",
                                metadata.consultationType === "ONLINE"
                                  ? "text-[#8f7652]"
                                  : "text-stone-500 group-hover:text-[#8f7652]",
                              )}
                            />
                            <p
                              className={cn(
                                "font-semibold transition-colors",
                                metadata.consultationType === "ONLINE"
                                  ? "text-[#8f7652]"
                                  : "text-stone-800",
                              )}
                            >
                              Online
                            </p>
                            <p className="mt-1 text-xs text-stone-500">
                              Vídeo + áudio
                            </p>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-stone-700">
                          Selecionar Contato
                        </label>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div
                              className={cn(
                                "flex w-full cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-all",
                                metadata.selectedClientId
                                  ? "border-[#AB8E63]/60 bg-[#AB8E63]/5 text-stone-800 shadow-sm"
                                  : "border-stone-300 hover:border-[#AB8E63]/50 hover:bg-stone-50",
                              )}
                            >
                              <input
                                type="text"
                                value={
                                  currentSelectedClient?.name ||
                                  "Selecione um contato"
                                }
                                className={cn(
                                  "w-full cursor-pointer bg-transparent outline-none",
                                  metadata.selectedClientId
                                    ? "text-stone-800"
                                    : "text-stone-500",
                                )}
                                required
                                readOnly
                              />
                              <ChevronDown
                                className={cn(
                                  "h-5 w-5 flex-shrink-0",
                                  metadata.selectedClientId
                                    ? "text-[#8f7652]"
                                    : "text-stone-500",
                                )}
                              />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side="top"
                            className="z-[999999] h-80 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-scroll"
                            onWheel={(e) => e.stopPropagation()}
                          >
                            {!dryRun && (
                              <DropdownMenuItem
                                onSelect={() =>
                                  setIsCreateClientSheetOpen(true)
                                }
                                className="sticky top-0 z-10 mb-2 flex items-center justify-start gap-2 border-b border-stone-100 bg-white py-3 font-semibold text-stone-700 hover:bg-stone-50"
                              >
                                <UserPlus className="h-4 w-4" />
                                Cadastrar Novo Contato
                              </DropdownMenuItem>
                            )}
                            {clients.length !== 0 ? (
                              clients.map((client, index) => (
                                <DropdownMenuItem
                                  key={client.id || index}
                                  className={cn(
                                    "hover:bg-stone-100",
                                    metadata.selectedClientId === client.id
                                      ? "bg-stone-100"
                                      : "",
                                  )}
                                  onClick={() =>
                                    updateMetadata({
                                      selectedClientId: client.id,
                                    })
                                  }
                                >
                                  {client?.name}
                                </DropdownMenuItem>
                              ))
                            ) : (
                              <div className="p-4 text-center text-sm text-stone-500">
                                Nenhum contato encontrado.
                              </div>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {!metadata.selectedClientId && (
                          <p className="mt-1.5 text-xs text-red-500 italic">
                            Selecione ou cadastre um contato*
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#AB8E63] to-[#8f7652] py-4 font-semibold text-white shadow-lg shadow-[#AB8E63]/25 transition-all hover:shadow-[#AB8E63]/40 active:scale-[0.98]"
                      >
                        {currentMediaType === "video" ? (
                          <>
                            <Video className="h-5 w-5" />
                            Continuar
                          </>
                        ) : (
                          <>
                            <Mic className="h-5 w-5" />
                            Iniciar Gravação
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === "instructions" && (
                  <div className="p-6 md:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-stone-800">
                        Instruções
                      </h2>
                      <button
                        type="button"
                        onClick={resetFlow}
                        className="text-stone-500 transition-colors hover:text-stone-700"
                        aria-label="Fechar"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                        <h3 className="mb-3 flex items-center gap-2 font-semibold text-stone-900">
                          <AlertCircle className="h-5 w-5" />
                          Instruções Importantes
                        </h3>
                        <ol className="space-y-3 text-sm text-stone-800">
                          <li className="flex items-start gap-2">
                            <span className="min-w-[24px] font-bold">1.</span>
                            <span>
                              Na próxima tela, selecione a{" "}
                              <strong>ABA do Google Meet</strong> (não a janela
                              inteira)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="min-w-[24px] font-bold">2.</span>
                            <span>
                              Marque a opção{" "}
                              <strong>
                                {"'"}Compartilhar áudio da aba{"'"}
                              </strong>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="min-w-[24px] font-bold">3.</span>
                            <span>
                              Clique em{" "}
                              <strong>
                                {"'"}Compartilhar{"'"}
                              </strong>
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="min-w-[24px] font-bold">4.</span>
                            <span>
                              A gravação iniciará automaticamente e capturará
                              vídeo + áudio da reunião
                            </span>
                          </li>
                        </ol>
                      </div>

                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <div className="flex items-start gap-2 text-sm text-emerald-800">
                          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" />
                          <p>
                            <strong>Dica:</strong> O áudio do seu microfone
                            também será capturado automaticamente para
                            registrar suas observações durante a reunião.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setCurrentStep("save-dialog")}
                          className="flex-1 rounded-lg bg-stone-200 py-4 font-semibold text-stone-700 transition-colors hover:bg-stone-300"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={handleStartVideoRecording}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#AB8E63] to-[#8f7652] py-4 font-semibold text-white shadow-lg shadow-[#AB8E63]/25 transition-all hover:shadow-[#AB8E63]/40 active:scale-[0.98]"
                        >
                          <Video className="h-5 w-5" />
                          Iniciar Gravação
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "recording" && (
                  <div className="p-6 md:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-stone-800">
                        Gravando...
                      </h2>
                      <button
                        type="button"
                        onClick={() => recorder.stopRecording()}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#AB8E63] to-[#8f7652] px-4 py-2 font-semibold text-white shadow-lg shadow-[#AB8E63]/25 transition-all hover:shadow-[#AB8E63]/40 active:scale-[0.98]"
                      >
                        <Pause className="h-5 w-5" />
                        Parar
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center rounded-lg border border-stone-200 bg-stone-50 p-12">
                        {currentMediaType === "video" ? (
                          <Video className="mb-4 h-16 w-16 animate-pulse text-[#8f7652]" />
                        ) : (
                          <Mic className="mb-4 h-16 w-16 animate-pulse text-[#8f7652]" />
                        )}
                        <p className="text-lg font-semibold text-stone-800">
                          Gravação em andamento...
                        </p>
                      </div>

                      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-stone-600">
                              Duração
                            </p>
                            <p className="text-lg font-bold text-stone-800">
                              {formatDuration(recorder.duration)}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-stone-600">Tipo</p>
                            <p className="text-lg font-bold text-stone-800">
                              {currentMediaType === "video"
                                ? "Vídeo + Áudio"
                                : "Áudio"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "preview" && (
                  <div className="p-6 md:p-8">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-stone-800">
                        Pré-visualização
                      </h2>
                      <button
                        type="button"
                        onClick={resetFlow}
                        className="text-stone-500 transition-colors hover:text-stone-700"
                        aria-label="Fechar"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="flex flex-col items-center justify-center rounded-lg border border-stone-200 bg-stone-50 p-8">
                        {currentMediaType === "video" ? (
                          <div className="w-full">
                            <Video className="mx-auto mb-4 h-10 w-10 text-[#8f7652]" />
                            <video
                              ref={videoPreviewRef}
                              controls
                              className="w-full max-w-md"
                            >
                              Seu navegador não suporta o elemento de vídeo.
                            </video>
                          </div>
                        ) : (
                          <div className="w-full">
                            <Volume2 className="mx-auto mb-4 h-10 w-10 text-[#8f7652]" />
                            <audio
                              ref={audioPreviewRef}
                              controls
                              className="w-full max-w-md"
                            >
                              Seu navegador não suporta o elemento de áudio.
                            </audio>
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-stone-600">
                              Duração
                            </p>
                            <p className="text-lg font-bold text-stone-800">
                              {formatDuration(recorder.duration)}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-stone-600">Tipo</p>
                            <p className="text-lg font-bold text-stone-800">
                              {currentMediaType === "video"
                                ? "Vídeo + Áudio"
                                : "Áudio"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                        <div className="flex items-start gap-2 text-sm text-stone-800">
                          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">Valide sua gravação</p>
                            <p className="mt-1">
                              {currentMediaType === "video"
                                ? "Reproduza o vídeo e verifique se o áudio e vídeo estão sincronizados e com boa qualidade."
                                : "Reproduza o áudio e verifique se está audível e com boa qualidade."}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={handleRetryRecording}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-stone-200 py-4 font-semibold text-stone-700 transition-colors hover:bg-stone-300"
                        >
                          <RefreshCw className="h-5 w-5" />
                          Gravar Novamente
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmRecording}
                          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#AB8E63] to-[#8f7652] py-4 font-semibold text-white shadow-lg shadow-[#AB8E63]/25 transition-all hover:shadow-[#AB8E63]/40 active:scale-[0.98]"
                        >
                          <Send className="h-5 w-5" />
                          Confirmar e Enviar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === "processing" && (
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#AB8E63] border-t-transparent" />
                      <p className="mt-6 text-lg font-semibold text-stone-800">
                        Processando gravação...
                      </p>
                      <p className="mt-2 text-center text-stone-600">
                        Aguarde enquanto preparamos sua gravação para
                        transcrição
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {!dryRun && isCreateClientSheetOpen && (
        <CreateClientSheet
          isOpen={isCreateClientSheetOpen}
          onClose={() => setIsCreateClientSheetOpen(false)}
          className="text-black"
          onClientCreated={(client) => {
            if (client?.id) {
              updateMetadata({ selectedClientId: client.id });
            }
            if (client?.name) {
              setPendingClientName(client.name);
              setTempCreatedClient(client);
            }
          }}
        />
      )}
    </>
  );
}
