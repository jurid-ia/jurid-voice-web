"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  Calendar,
  Download,
  Pause,
  Play,
  Share2,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { MerkRecording } from "../mock/recording";
import { formatDate, formatDuration } from "./shared";

export function HeroHeader({ recording }: { recording: MerkRecording }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const bars = useMemo(
    () =>
      Array.from({ length: 64 }).map((_, i) => {
        const seed = Math.sin(i * 12.9898) * 43758.5453;
        return 0.25 + Math.abs(seed - Math.floor(seed)) * 0.75;
      }),
    [],
  );

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
      return;
    }
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setProgress((p) => {
        const next = p + dt / recording.durationSeconds;
        if (next >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, recording.durationSeconds]);

  const currentSeconds = Math.floor(progress * recording.durationSeconds);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#9E8258] via-[#8a6f4a] to-[#6e5537] p-6 text-white shadow-[0_20px_60px_-30px_rgba(120,90,50,0.6)] sm:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 60%, white 0, transparent 35%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase backdrop-blur"
          >
            <Sparkles className="h-3 w-3" />
            Gravação analisada por IA
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-2xl leading-tight font-bold sm:text-3xl"
          >
            {recording.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/80"
          >
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(recording.date)}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{formatDuration(recording.durationSeconds)}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{recording.participantsCount} participantes</span>
          </motion.div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setIsFavorite((v) => !v);
                toast.success(
                  isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
                );
              }}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-lg border border-white/20 px-3 text-xs font-semibold backdrop-blur transition",
                isFavorite
                  ? "bg-amber-300/20 text-amber-100"
                  : "bg-white/5 text-white hover:bg-white/15",
              )}
            >
              <Star
                className={cn("h-3.5 w-3.5", isFavorite && "fill-amber-300 text-amber-300")}
              />
              {isFavorite ? "Favoritado" : "Favoritar"}
            </button>
            <button
              onClick={() => toast.success("Exportando PDF...")}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 text-xs font-semibold backdrop-blur transition hover:bg-white/15"
            >
              <Download className="h-3.5 w-3.5" />
              Exportar PDF
            </button>
            <button
              onClick={() => toast.success("Link copiado para compartilhamento")}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 text-xs font-semibold backdrop-blur transition hover:bg-white/15"
            >
              <Share2 className="h-3.5 w-3.5" />
              Compartilhar
            </button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12 }}
          className="w-full rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md lg:w-[380px]"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#6e5537] shadow-lg transition-transform hover:scale-[1.04] active:scale-95"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex h-10 items-center gap-[3px]">
                {bars.map((h, i) => {
                  const reached = i / bars.length <= progress;
                  return (
                    <span
                      key={i}
                      className={cn(
                        "w-[3px] rounded-full transition-all duration-300",
                        reached ? "bg-white" : "bg-white/30",
                      )}
                      style={{
                        height: `${h * 100}%`,
                        transform: isPlaying && reached ? `scaleY(${0.9 + (h * 0.2)})` : "none",
                      }}
                    />
                  );
                })}
              </div>
              <div className="mt-1 flex justify-between font-mono text-[10px] text-white/70">
                <span>{formatClock(currentSeconds)}</span>
                <span>{formatClock(recording.durationSeconds)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
