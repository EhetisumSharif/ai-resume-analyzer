import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ScoreEntry {
  date: string;
  score: number;
}

interface ProgressChartProps {
  history?: ScoreEntry[];
}

export default function ProgressChart({ history = [] }: ProgressChartProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="space-y-2.5 pt-2">
      <span className="text-[10px] font-black text-teal-300 tracking-widest uppercase flex items-center space-x-1.5">
        <span>📈 Score Progress Analytics</span>
      </span>
      <div className="h-60 bg-slate-950/70 backdrop-blur-xl p-4 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group">

        {/* Soft Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none"></div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              domain={[0, 100]}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                fontSize: "11px",
                borderRadius: "16px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                color: "#f8fafc",
                padding: "10px 14px",
              }}
              labelStyle={{ color: "#34d399", fontWeight: "bold", marginBottom: "4px" }}
              itemStyle={{ color: "#e2e8f0", padding: 0 }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#34d399"
              strokeWidth={3}
              dot={{ r: 4, fill: "#10b981", stroke: "#020617", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#34d399", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}