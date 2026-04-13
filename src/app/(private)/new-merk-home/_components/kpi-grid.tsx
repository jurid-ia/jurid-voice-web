"use client";

import { AlarmClockCheck, AlertTriangle, CalendarClock, Mic2 } from "lucide-react";
import { kpisMock } from "../_mocks/kpis";
import { NewHomeKpiCard } from "./kpi-card";

export function KpiGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <NewHomeKpiCard
        title="Reuniões hoje"
        value={kpisMock.meetingsToday}
        icon={CalendarClock}
        accent="neutral"
        delay={0}
      />
      <NewHomeKpiCard
        title="Compromissos vencendo hoje"
        value={kpisMock.commitmentsDueToday}
        icon={AlarmClockCheck}
        accent="warning"
        delay={0.05}
      />
      <NewHomeKpiCard
        title="Follow-ups atrasados"
        value={kpisMock.overdueFollowups}
        icon={AlertTriangle}
        accent="danger"
        highlight={kpisMock.overdueFollowups > 0}
        delay={0.1}
      />
      <NewHomeKpiCard
        title="Gravações não processadas"
        value={kpisMock.unprocessedRecordings}
        icon={Mic2}
        accent="success"
        delay={0.15}
      />
    </div>
  );
}
