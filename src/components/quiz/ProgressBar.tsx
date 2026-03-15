"use client";

interface ProgressBarProps {
  current: number;
  total: number;
  correct?: number;
}

export function ProgressBar({ current, total, correct }: ProgressBarProps) {
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{current} / {total}</span>
        {correct !== undefined && (
          <span className="text-green-400">{correct} correct</span>
        )}
      </div>
      <div className="w-full h-2 bg-[#2a2a4a] rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
