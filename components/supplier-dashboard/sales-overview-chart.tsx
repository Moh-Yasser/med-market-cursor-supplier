"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { BarChart2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SalesSeries } from "@/types/dashboard"

const PERIODS = [
  { value: "7d",      label: "آخر 7 أيام" },
  { value: "30d",     label: "آخر 30 يوم" },
  { value: "quarter", label: "هذا الربع"   },
] as const

type Period = (typeof PERIODS)[number]["value"]

// ─── Component ───────────────────────────────────────────────────────────────
export function SalesOverviewChart({
  data,
  isLoading = false,
  onPeriodChange,
}: {
  data: SalesSeries[]
  isLoading?: boolean
  /** Optional callback so the parent can re-fetch when the period changes */
  onPeriodChange?: (period: Period) => void
}) {
  const [period, setPeriod] = useState<Period>("7d")

  function handlePeriodChange(value: Period) {
    setPeriod(value)
    onPeriodChange?.(value)
  }

  const isEmpty = !isLoading && (!data || data.length === 0)

  return (
    <section className="rounded-xl bg-white p-6 shadow-[0_4px_20px_rgba(26,54,93,0.07)]">
      {/* Header row */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-[#002045]">
          نظرة عامة على المبيعات
        </h2>

        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="h-10 w-fit min-w-[140px] rounded-md border-[#c4c6cf] bg-[#f8f9ff] text-sm text-[#0d1c2e] focus:border-[#13696a] focus:ring-[#13696a]/25">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PERIODS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body */}
      {isLoading ? (
        <Skeleton className="h-80 w-full rounded-lg" />
      ) : isEmpty ? (
        <div className="flex h-80 flex-col items-center justify-center gap-3 text-[#43474e]">
          <BarChart2 className="h-10 w-10 text-[#c4c6cf]" />
          <p className="text-sm">لا توجد بيانات للفترة المحددة</p>
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 4, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%"   stopColor="#13696a" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="#13696a" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#c4c6cf"
                strokeOpacity={0.35}
                vertical={false}
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#0d1c2e", fontSize: 12, fontWeight: 700 }}
                padding={{ left: 8, right: 8 }}
              />

              {/* Y-axis: gives values readable context */}
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#43474e", fontSize: 11 }}
                width={64}
                tickFormatter={(v: number) => v.toLocaleString("ar-SA")}
              />

              <Tooltip
                cursor={{ stroke: "#13696a", strokeOpacity: 0.2 }}
                contentStyle={{
                  border: "1px solid #d4e4fc",
                  borderRadius: 8,
                  boxShadow: "0 10px 30px rgba(26,54,93,0.12)",
                  direction: "rtl",
                }}
                formatter={(value: number) => [
                  value.toLocaleString("ar-SA"),
                  "المبيعات",
                ]}
              />

              <Area
                type="linear"
                dataKey="sales"
                stroke="#13696a"
                strokeWidth={2}
                fill="url(#salesGradient)"
                dot={{ r: 5, fill: "#ffffff", stroke: "#13696a", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#ffffff", stroke: "#13696a", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}



