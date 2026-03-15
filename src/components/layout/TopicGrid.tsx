"use client";

import Link from "next/link";
import { TOPIC_META } from "@/types/vocab";
import type { TopicId } from "@/types/vocab";

interface TopicStats {
  total: number;
  due: number;
  learned: number;
}

interface TopicGridProps {
  stats?: Partial<Record<TopicId, TopicStats>>;
}

const TOPIC_IDS = Object.keys(TOPIC_META) as TopicId[];

export function TopicGrid({ stats = {} }: TopicGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {TOPIC_IDS.map((topicId) => {
        const meta = TOPIC_META[topicId];
        const s = stats[topicId];

        return (
          <Link
            key={topicId}
            href={`/topic/${topicId}`}
            className="group relative bg-[#1a1a2e] border border-[#2a2a4a] rounded-xl p-4 hover:border-indigo-500 hover:bg-[#1e1e38] transition-all duration-200 flex flex-col gap-2"
          >
            <div className="text-3xl">{meta.emoji}</div>
            <div className="font-semibold text-sm leading-tight">{meta.name}</div>
            <div className="japanese text-xs text-gray-400">{meta.nameJa}</div>

            {s && (
              <div className="mt-auto pt-2 flex gap-2 text-xs">
                {s.due > 0 && (
                  <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                    {s.due} due
                  </span>
                )}
                <span className="text-gray-500">
                  {s.learned}/{s.total}
                </span>
              </div>
            )}

            {/* Progress bar */}
            {s && (
              <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl bg-[#2a2a4a] overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all"
                  style={{ width: `${(s.learned / Math.max(s.total, 1)) * 100}%` }}
                />
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
