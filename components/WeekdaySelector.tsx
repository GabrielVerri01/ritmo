"use client";

import { WeekDay } from "@/lib/types";
import { weekDayLabels, weekDayOrder } from "@/lib/weekdays";

export default function WeekdaySelector({
  selected,
  onChange,
}: {
  selected: WeekDay[];
  onChange: (days: WeekDay[]) => void;
}) {
  function toggle(day: WeekDay) {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day]);
    }
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {weekDayOrder.map((day) => {
        const isSelected = selected.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggle(day)}
            className={`h-9 px-2.5 rounded-full border text-xs font-medium transition-colors ${
              isSelected
                ? "border-pulse bg-pulse-dim text-ink"
                : "border-line text-ink-muted hover:border-line"
            }`}
          >
            {weekDayLabels[day]}
          </button>
        );
      })}
    </div>
  );
}
