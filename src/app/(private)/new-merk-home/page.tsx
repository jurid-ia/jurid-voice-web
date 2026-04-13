"use client";

import { AudioRecorderV2 } from "@/components/audio-recorder-v2/audio-recorder-v2";
import { FlaskConical } from "lucide-react";
import { useCallback, useState } from "react";
import { CalendarHub } from "./_components/calendar-hub";
import { CommitmentsList } from "./_components/commitments-list";
import { CreateMeetingDialog } from "./_components/create-meeting-dialog";
import { KpiGrid } from "./_components/kpi-grid";
import { MeetingsList } from "./_components/meetings-list";
import { PreMeetingDialog } from "./_components/pre-meeting-dialog";
import { RecentRecordings } from "./_components/recent-recordings";
import { ScheduleMeetingDialog } from "./_components/schedule-meeting-dialog";
import { SearchBarTrigger } from "./_components/search-bar-trigger";
import { Section } from "./_components/section";
import { WeeklyInsights } from "./_components/weekly-insights";
import { MeetingsStoreProvider } from "./_context/meetings-store";
import { Meeting } from "./_types";

function NewMerkHomeContent() {
  const today = new Date();
  const formattedToday = today.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [createTargetDate, setCreateTargetDate] = useState<Date | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleInitialDate, setScheduleInitialDate] = useState<Date | null>(
    null,
  );
  const [preMeetingOpen, setPreMeetingOpen] = useState(false);
  const [preMeetingTarget, setPreMeetingTarget] = useState<Meeting | null>(
    null,
  );
  const [recorderOpen, setRecorderOpen] = useState(false);
  const [recorderClientId, setRecorderClientId] = useState<string | undefined>(
    undefined,
  );

  const handleEmptySlotClick = useCallback((date: Date) => {
    setCreateTargetDate(date);
    setCreateOpen(true);
  }, []);

  const handleMeetingClick = useCallback((meeting: Meeting) => {
    const start = new Date(meeting.start).getTime();
    if (start <= Date.now()) {
      // Reuniões passadas: sem ação por enquanto (decisão do usuário)
      return;
    }
    setPreMeetingTarget(meeting);
    setPreMeetingOpen(true);
  }, []);

  const handleStartInstant = useCallback(() => {
    setRecorderClientId(undefined);
    setRecorderOpen(true);
  }, []);

  const handleSchedule = useCallback(() => {
    setScheduleInitialDate(createTargetDate);
    setScheduleOpen(true);
  }, [createTargetDate]);

  const handleStartRecordingFromPreMeeting = useCallback(
    (meeting: Meeting) => {
      setPreMeetingOpen(false);
      setPreMeetingTarget(null);
      setRecorderClientId(meeting.clientId);
      setRecorderOpen(true);
    },
    [],
  );

  return (
    <main className="flex w-full flex-col gap-6" aria-label="Nova home JuridIA">
      <Section delay={0} ariaLabel="Cabeçalho">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-800">
                Seu dia na JuridIA
              </h1>
              <span
                className="inline-flex items-center gap-1 rounded-full border border-[#AB8E63]/30 bg-[#AB8E63]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#8f7652] uppercase"
                title="Esta é uma versão experimental com dados mock para validação de UX/UI"
              >
                <FlaskConical className="h-3 w-3" />
                Dados mock · validação UX/UI
              </span>
            </div>
            <p className="text-sm text-gray-500 capitalize">{formattedToday}</p>
          </div>
          <SearchBarTrigger />
        </div>
      </Section>

      <Section delay={0.05} ariaLabel="Indicadores do dia">
        <KpiGrid />
      </Section>

      <Section delay={0.1} ariaLabel="Calendário">
        <CalendarHub
          onMeetingClick={handleMeetingClick}
          onEmptySlotClick={handleEmptySlotClick}
        />
      </Section>

      <Section delay={0.15} ariaLabel="Compromissos">
        <CommitmentsList />
      </Section>

      <Section delay={0.2} ariaLabel="Gravações processadas recentemente">
        <RecentRecordings />
      </Section>

      <Section delay={0.25} ariaLabel="Reuniões">
        <MeetingsList onMeetingClick={handleMeetingClick} />
      </Section>

      <Section delay={0.3} ariaLabel="Insights semanais">
        <WeeklyInsights />
      </Section>

      <CreateMeetingDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        targetDate={createTargetDate}
        onStartInstant={handleStartInstant}
        onSchedule={handleSchedule}
      />

      <ScheduleMeetingDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        initialDate={scheduleInitialDate}
      />

      <PreMeetingDialog
        open={preMeetingOpen}
        onOpenChange={(o) => {
          setPreMeetingOpen(o);
          if (!o) setPreMeetingTarget(null);
        }}
        meeting={preMeetingTarget}
        onStartRecording={handleStartRecordingFromPreMeeting}
      />

      <AudioRecorderV2
        hideTrigger
        dryRun
        externalOpen={recorderOpen}
        onExternalOpenChange={setRecorderOpen}
        initialClientId={recorderClientId}
        skipNewRecordingRequest
      />
    </main>
  );
}

export default function NewMerkHomePage() {
  return (
    <MeetingsStoreProvider>
      <NewMerkHomeContent />
    </MeetingsStoreProvider>
  );
}
