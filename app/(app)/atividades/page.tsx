"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import ActivityCard from "@/components/ActivityCard";
import AddActivityModal from "@/components/AddActivityModal";
import { Activity, WeekDay } from "@/lib/types";
import { addActivity, getActivities, toggleDayActive } from "@/lib/storage";
import { weekDayLabels, weekDayOrder, todayWeekDay } from "@/lib/weekdays";
import { Plus } from "lucide-react";

export default function AtividadesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedDay, setSelectedDay] = useState<WeekDay>(todayWeekDay());
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setActivities(getActivities());
  }, []);

  function handleToggle(id: string, day: WeekDay) {
    setActivities(toggleDayActive(id, day));
  }

  function handleCreate(title: string, startTime: string, daysActive: WeekDay[]) {
    setActivities(addActivity({ title, startTime, daysActive }));
    setShowAddModal(false);
  }

  const filtered = activities
    .filter((a) => a.schedule[selectedDay])
    .sort((a, b) =>
      a.schedule[selectedDay]!.startTime.localeCompare(
        b.schedule[selectedDay]!.startTime
      )
    );

  return (
    <div>
      <TopBar title="Atividades" />

      <div className="border-b border-line px-4 sm:px-8">
        <div className="flex gap-1 max-w-2xl overflow-x-auto scrollbar-hide">
          {weekDayOrder.map((day) => {
            const isSelected = day === selectedDay;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px whitespace-nowrap shrink-0 transition-colors ${
                  isSelected
                    ? "border-pulse text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {weekDayLabels[day]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 max-w-2xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <p className="text-ink-muted text-sm">
            Rotina de {weekDayLabels[selectedDay].toLowerCase()}.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-card bg-pulse px-4 py-2 text-sm font-medium text-base shrink-0 hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Nova atividade
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-card border border-line bg-base-raised px-5 py-8 text-center">
            <p className="text-ink-muted text-sm">
              Nenhuma atividade cadastrada para{" "}
              {weekDayLabels[selectedDay].toLowerCase()} ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                day={selectedDay}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddActivityModal
          defaultDay={selectedDay}
          onClose={() => setShowAddModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
