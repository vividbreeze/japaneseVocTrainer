"use client";

interface ProgressBarProps {
  /** How many cards mastered so far */
  current: number;
  /** Original total (constant) — can be passed directly or derived */
  total: number;
  /** Same as current (kept for API compat) */
  correct?: number;
}

export function ProgressBar({ current, total, correct }: ProgressBarProps) {
  const mastered = correct ?? current;
  const pct = total > 0 ? (mastered / total) * 100 : 0;
  const remaining = total - mastered;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-400">
        <span className="text-green-400 font-medium">{mastered} / {total} gelernt</span>
        {remaining > 0 && (
          <span className="text-indigo-400">{remaining} verbleibend</span>
        )}
      </div>
      <div className="w-full h-2 bg-[#2a2a4a] rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
