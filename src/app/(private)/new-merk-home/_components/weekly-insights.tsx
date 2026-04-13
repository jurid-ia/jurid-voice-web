"use client";

import { cn } from "@/utils/cn";
import { CheckCircle2, Percent } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  dailyInsightsMock,
  InsightPoint,
  monthlyInsightsMock,
  weeklyInsightsMock,
} from "../_mocks/insights";

type PeriodKey = "week" | "month" | "year";

type MetricKey = "commitmentsCompleted" | "completionRate";

interface ChartRow {
  label: string;
  commitmentsCompleted: number;
  commitmentsCreated: number;
  completionRate: number;
}

const periodOptions: {
  key: PeriodKey;
  label: string;
  data: InsightPoint[];
}[] = [
  { key: "week", label: "Semana", data: dailyInsightsMock },
  { key: "month", label: "Mês", data: weeklyInsightsMock },
  { key: "year", label: "Ano", data: monthlyInsightsMock },
];

const metricConfig: Record<
  MetricKey,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    iconBg: string;
    strokeColor: string;
    fillId: string;
    formatter: (n: number) => string;
  }
> = {
  commitmentsCompleted: {
    label: "Compromissos concluídos",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    strokeColor: "#059669",
    fillId: "fillCommitments",
    formatter: (n: number) => String(n),
  },
  completionRate: {
    label: "Taxa de conclusão",
    icon: Percent,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    strokeColor: "#2563eb",
    fillId: "fillRate",
    formatter: (n: number) => `${n.toFixed(0)}%`,
  },
};

function buildRows(source: InsightPoint[]): ChartRow[] {
  return source.map((w) => ({
    label: w.label,
    commitmentsCompleted: w.commitmentsCompleted,
    commitmentsCreated: w.commitmentsCreated,
    completionRate:
      w.commitmentsCreated === 0
        ? 0
        : (w.commitmentsCompleted / w.commitmentsCreated) * 100,
  }));
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartRow }>;
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3 text-xs shadow-lg">
      <p className="mb-1.5 font-semibold text-gray-800">{row.label}</p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Compromissos concluídos</span>
          <span className="font-semibold text-emerald-600">
            {row.commitmentsCompleted}
            <span className="text-[10px] font-normal text-gray-400">
              {" "}
              / {row.commitmentsCreated}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-500">Taxa de conclusão</span>
          <span className="font-semibold text-blue-600">
            {row.completionRate.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function WeeklyInsights({ className }: { className?: string }) {
  const [period, setPeriod] = useState<PeriodKey>("month");
  const [selectedMetric, setSelectedMetric] =
    useState<MetricKey>("commitmentsCompleted");

  const activePeriod = periodOptions.find((p) => p.key === period)!;
  const rows = useMemo(() => buildRows(activePeriod.data), [activePeriod]);

  const current = rows[rows.length - 1];
  const currentMetrics: Record<MetricKey, number> = current
    ? {
        commitmentsCompleted: current.commitmentsCompleted,
        completionRate: current.completionRate,
      }
    : { commitmentsCompleted: 0, completionRate: 0 };

  const activeCfg = metricConfig[selectedMetric];

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-gray-800">
          Insights da operação
        </h2>
        <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-stone-50 p-0.5">
          {periodOptions.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-all",
                period === p.key
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(Object.keys(metricConfig) as MetricKey[]).map((key) => {
          const cfg = metricConfig[key];
          const Icon = cfg.icon;
          const isActive = selectedMetric === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedMetric(key)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border bg-white p-4 text-left transition-all focus-visible:border-[#AB8E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30",
                isActive
                  ? "border-[#AB8E63]/60 shadow-md ring-1 ring-[#AB8E63]/30"
                  : "border-stone-200 hover:border-[#AB8E63]/30 hover:shadow-sm",
              )}
            >
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                  {cfg.label}
                </span>
                <span className="text-3xl font-bold leading-none text-gray-800">
                  {cfg.formatter(currentMetrics[key])}
                </span>
              </div>
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  cfg.iconBg,
                  cfg.iconColor,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={rows}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillCommitments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#059669" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f5f5f4"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={{ stroke: "#e7e5e4" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
              width={36}
              tickFormatter={(v: number) =>
                selectedMetric === "completionRate" ? `${v}%` : String(v)
              }
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: "#d6d3d1", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey={selectedMetric}
              stroke={activeCfg.strokeColor}
              strokeWidth={2.5}
              fill={`url(#${activeCfg.fillId})`}
              dot={{ r: 3, fill: activeCfg.strokeColor, strokeWidth: 0 }}
              activeDot={{
                r: 5,
                fill: activeCfg.strokeColor,
                strokeWidth: 2,
                stroke: "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
