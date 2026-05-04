"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  Copy,
  Crown,
  Mail,
  MessageCircle,
  Mic,
  MicOff,
  Phone,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import type { MerkRecording, Participant } from "../mock/recording";
import { Avatar, GlassCard, Pill, ProgressBar, SectionHeader } from "./shared";

export function ContactsTab({
  recording,
  setRecording,
}: {
  recording: MerkRecording;
  setRecording: Dispatch<SetStateAction<MerkRecording>>;
}) {
  const toggleContacted = (id: string) => {
    setRecording((r) => ({
      ...r,
      participants: r.participants.map((p) =>
        p.id === id ? { ...p, contacted: !p.contacted } : p,
      ),
    }));
  };

  const leader = recording.participants.find(
    (p) => p.id === recording.conversationLeaderId,
  );
  const quietest = recording.participants.find(
    (p) => p.id === recording.quietestParticipantId,
  );

  return (
    <div className="flex flex-col gap-6">
      <GlassCard>
          <SectionHeader
            eyebrow="Participantes"
            title={`${recording.participants.length} pessoas na reunião`}
            description="Tempo de fala, contatos e pontos levantados"
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {recording.participants
              .slice()
              .sort((a, b) => b.speakingPercentage - a.speakingPercentage)
              .map((p, idx) => (
                <ParticipantCard
                  key={p.id}
                  participant={p}
                  isLeader={p.id === recording.conversationLeaderId}
                  delay={idx * 0.04}
                  onToggleContacted={() => toggleContacted(p.id)}
                />
              ))}
          </div>
        </GlassCard>

      <GlassCard>
            <SectionHeader eyebrow="Dinâmica" title="Quem moveu a conversa" />
            <div className="flex flex-col gap-3">
              {leader && (
                <DynamicRow
                  icon={<Crown className="h-4 w-4" />}
                  label="Liderou a conversa"
                  name={leader.name}
                  hue={leader.colorHue}
                  initials={leader.initials}
                  tone="primary"
                />
              )}
              {quietest && (
                <DynamicRow
                  icon={<MicOff className="h-4 w-4" />}
                  label="Mais silencioso"
                  name={quietest.name}
                  hue={quietest.colorHue}
                  initials={quietest.initials}
                  tone="neutral"
                />
              )}
              {recording.consensusPairs.length > 0 && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
                  <p className="mb-2 text-[11px] font-semibold tracking-wider text-emerald-800 uppercase">
                    Concordaram mais vezes
                  </p>
                  <div className="flex flex-col gap-2">
                    {recording.consensusPairs.map((pair, i) => {
                      const a = recording.participants.find((p) => p.id === pair.a);
                      const b = recording.participants.find((p) => p.id === pair.b);
                      if (!a || !b) return null;
                      return (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <div className="flex -space-x-1.5">
                            <Avatar initials={a.initials} hue={a.colorHue} size={22} />
                            <Avatar initials={b.initials} hue={b.colorHue} size={22} />
                          </div>
                          <span className="text-gray-700">
                            <span className="font-semibold">{a.name.split(" ")[0]}</span>
                            {" ↔ "}
                            <span className="font-semibold">{b.name.split(" ")[0]}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {recording.externalMentions.length > 0 && (
            <GlassCard className="border-amber-200/70 bg-amber-50/30">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-amber-800 uppercase">
                    Menção externa
                  </p>
                  <p className="text-sm font-semibold text-amber-900">
                    Pessoas a contactar depois
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {recording.externalMentions.map((m, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-amber-100 bg-white p-3"
                  >
                    <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                    <p className="mt-0.5 text-xs text-gray-600">{m.reason}</p>
                    <button
                      onClick={() => toast.success("Contato adicionado à lista")}
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 hover:text-amber-900"
                    >
                      <UserPlus className="h-3 w-3" />
                      Adicionar ao CRM
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
    </div>
  );
}

function ParticipantCard({
  participant: p,
  isLeader,
  delay,
  onToggleContacted,
}: {
  participant: Participant;
  isLeader: boolean;
  delay: number;
  onToggleContacted: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      toast.success(`${label} copiado`);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "group relative flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-4 transition-all",
        "hover:border-primary/20 hover:shadow-[0_10px_30px_-18px_rgba(120,90,50,0.35)]",
        p.contacted && "bg-emerald-50/30",
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar initials={p.initials} hue={p.colorHue} size={48} ring={isLeader} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-bold text-gray-900">{p.name}</p>
            {isLeader && (
              <Crown className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            )}
          </div>
          <p className="truncate text-xs text-gray-500">
            {p.role}
            {p.company && <span className="text-gray-400"> · {p.company}</span>}
          </p>
        </div>
        <button
          onClick={onToggleContacted}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all",
            p.contacted
              ? "border-emerald-200 bg-emerald-500 text-white"
              : "border-gray-200 bg-white text-gray-400 hover:border-emerald-200 hover:text-emerald-600",
          )}
          title={p.contacted ? "Marcado como contactado" : "Marcar como contactado"}
        >
          {p.contacted ? <Check className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
          <span className="flex items-center gap-1">
            <Mic className="h-3 w-3" />
            Tempo de fala
          </span>
          <span className="text-primary">{p.speakingPercentage}%</span>
        </div>
        <ProgressBar value={p.speakingPercentage} />
      </div>

      {(p.email || p.phone || p.whatsapp) && (
        <div className="flex flex-wrap gap-1.5">
          {p.email && (
            <ContactChip
              icon={<Mail className="h-3 w-3" />}
              label={p.email}
              copied={copied === "E-mail"}
              onClick={() => copy(p.email!, "E-mail")}
            />
          )}
          {p.phone && (
            <ContactChip
              icon={<Phone className="h-3 w-3" />}
              label={p.phone}
              copied={copied === "Telefone"}
              onClick={() => copy(p.phone!, "Telefone")}
            />
          )}
          {p.whatsapp && (
            <ContactChip
              icon={<MessageCircle className="h-3 w-3" />}
              label="WhatsApp"
              copied={copied === "WhatsApp"}
              onClick={() => copy(p.whatsapp!, "WhatsApp")}
            />
          )}
        </div>
      )}

      {p.mainPoints.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <p className="mb-1.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
            Pontos que levantou
          </p>
          <ul className="flex flex-col gap-1">
            {p.mainPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <span className="bg-primary/60 mt-1.5 h-1 w-1 shrink-0 rounded-full" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {p.contacted && (
        <Pill tone="success" className="absolute top-3 right-12">
          Contactado
        </Pill>
      )}
    </motion.div>
  );
}

function ContactChip({
  icon,
  label,
  copied,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  copied: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 truncate rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all",
        copied
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-gray-50/60 text-gray-600 hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
      )}
    >
      {copied ? <Check className="h-3 w-3" /> : icon}
      <span className="truncate">{label}</span>
      {!copied && <Copy className="h-3 w-3 opacity-40" />}
    </button>
  );
}

function DynamicRow({
  icon,
  label,
  name,
  hue,
  initials,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  hue: number;
  initials: string;
  tone: "primary" | "neutral";
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border p-3",
        tone === "primary"
          ? "border-primary/15 bg-primary/5"
          : "border-gray-100 bg-gray-50/60",
      )}
    >
      <Avatar initials={initials} hue={hue} size={34} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
          {icon}
          {label}
        </div>
        <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
      </div>
    </div>
  );
}
