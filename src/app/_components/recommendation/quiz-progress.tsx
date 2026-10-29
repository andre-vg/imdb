"use client";

import { ProgressBar } from "@heroui/react";

interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="space-y-2">
      <div className="text-muted flex items-center justify-between text-xs font-medium">
        <span>
          Passo {current} de {total}
        </span>
        <span>{percentage}%</span>
      </div>

      <ProgressBar
        aria-label="Progresso do quiz"
        maxValue={100}
        value={percentage}
      >
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
    </div>
  );
}
