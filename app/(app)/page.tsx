"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import ActivityCard from "@/components/ActivityCard";
import { Activity } from "@/lib/types";
import { getActivities, toggleDayActive } from "@/lib/storage";
import { todayWeekDay } from "@/lib/weekdays";

export default function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(getActivities());
  }, []);

  const today = todayWeekDay();
  const todays = activities
    .filter((a) => a.schedule[today])
    .sort((a, b) =>
      a.schedule[today]!.startTime.localeCompare(b.schedule[today]!.startTime)
    );

  function handleToggle(id: string) {
    setActivities(toggleDayActive(id, today));
  }

  return (
    <div>
      <TopBar title="Hoje" />
      <div className="px-4 sm:px-8 py-6 max-w-2xl">
        <p className="text-ink-muted text-sm mb-6">
          {todays.filter((a) => a.schedule[today]!.active).length} atividades
          programadas para hoje.
        </p>

        {todays.length === 0 ? (
          <div className="rounded-card border border-line bg-base-raised px-5 py-8 text-center">
            <p className="text-ink-muted text-sm">
              Nenhuma atividade configurada para hoje ainda.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todays.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                day={today}
                onToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
