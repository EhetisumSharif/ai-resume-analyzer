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
  history?: ScoreEntry[]; // নিরাপদ করার জন্য অপশনাল করা হলো
}

export default function ProgressChart({ history = [] }: ProgressChartProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold text-emerald-800/80 tracking-wider uppercase">
        Score Over Time
      </span>
      <div className="h-56 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-emerald-100 shadow-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #a7f3d0",
                fontSize: "11px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(16, 185, 129, 0.1)",
              }}
              labelStyle={{ color: "#0f172a", fontWeight: "bold" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#059669"
              strokeWidth={2}
              dot={{ r: 3, fill: "#059669" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}