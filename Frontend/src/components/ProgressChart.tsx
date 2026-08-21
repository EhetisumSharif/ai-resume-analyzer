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
  history: ScoreEntry[];
}

export default function ProgressChart({ history }: ProgressChartProps) {
  if (history.length === 0) return null;

  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">
        Score Over Time
      </span>
      <div className="h-56 bg-[#030712]/50 p-3 rounded-lg border border-slate-800/60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
            <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0b0f19",
                border: "1px solid #1e293b",
                fontSize: "11px",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Line
              type="monotone"
              dataKey="score"
              
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3, fill: "#6366f1" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}