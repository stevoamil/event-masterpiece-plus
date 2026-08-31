"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

const COLORS = ["#b8863f", "#cda05f", "#14110d", "#8a6a3c", "#e9dcc2"];
const AXIS_COLOR = "#2a231a80";

export function SourcePieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12 }} />
        <Tooltip contentStyle={{ background: "#faf6ef", border: "1px solid #2a231a1a", borderRadius: 6, fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ServiceDemandChart({ data }: { data: { name: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a231a14" horizontal={false} />
        <XAxis type="number" stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="name" stroke={AXIS_COLOR} fontSize={11} tickLine={false} axisLine={false} width={110} />
        <Tooltip contentStyle={{ background: "#faf6ef", border: "1px solid #2a231a1a", borderRadius: 6, fontSize: 12 }} />
        <Bar dataKey="count" fill="#b8863f" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
