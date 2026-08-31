"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

const AXIS_COLOR = "#2a231a80";

export function PipelineChart({ data }: { data: { status: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ bottom: 48 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a231a14" vertical={false} />
        <XAxis
          dataKey="status"
          stroke={AXIS_COLOR}
          fontSize={11}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-35}
          textAnchor="end"
          height={60}
        />
        <YAxis stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "#faf6ef", border: "1px solid #2a231a1a", borderRadius: 6, fontSize: 12 }}
        />
        <Bar dataKey="count" fill="#b8863f" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function LeadsTrendChart({ data }: { data: { date: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#b8863f" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#b8863f" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a231a14" vertical={false} />
        <XAxis dataKey="date" stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: "#faf6ef", border: "1px solid #2a231a1a", borderRadius: 6, fontSize: 12 }}
        />
        <Area type="monotone" dataKey="count" stroke="#b8863f" strokeWidth={2} fill="url(#leadsFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
