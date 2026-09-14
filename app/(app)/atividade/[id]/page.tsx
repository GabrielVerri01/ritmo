"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import WeekdaySelector from "@/components/WeekdaySelector";
import { Activity, DaySchedule, WeekDay } from "@/lib/types";
import { categoryMeta } from "@/lib/categories";
import {
  getActivities,
  removeActivityDay,
  setActivityDays,
  updateDaySchedule,
} from "@/lib/storage";
import { todayWeekDay, weekDayLabels, weekDayOrder } from "@/lib/weekdays";
import { ArrowLeft, Trash2 } from "lucide-react";

function scheduledDays(activity: Activity): WeekDay[] {
  return weekDayOrder.filter((d) => activity.schedule[d]);
}

function AtividadePageInner() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [day, setDay] = useState<WeekDay | null>(null);

  useEffect(() => {
    const found = getActivities().find((a) => a.id === params.id) ?? null;
    setActivity(found);

    if (!found) {
      setDay(null);
      return;
    }

    const requestedDay = searchParams.get("day") as WeekDay | null;
    if (requestedDay && found.schedule[requestedDay]) {
      setDay(requestedDay);
      return;
    }

    const today = todayWeekDay();
    if (found.schedule[today]) {
      setDay(today);
      return;
    }

    setDay(scheduledDays(found)[0] ?? null);
  }, [params.id, searchParams]);

  if (!activity || !day) {
    return (
      <div>
        <TopBar title="Atividade" />
        <div className="px-4 sm:px-8 py-6">
          <button
            onClick={() => router.push("/atividades")}
            className="flex items-center gap-2 text-ink-faint hover:text-ink-muted text-sm transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Voltar para atividades
          </button>
          <p className="text-ink-muted text-sm">Atividade não encontrada.</p>
        </div>
      </div>
    );
  }

  const config = activity.schedule[day]!;
  const meta = categoryMeta[activity.category];
  const Icon = meta.icon;

  function handleChange<K extends keyof DaySchedule>(key: K, value: DaySchedule[K]) {
    if (!activity || !day) return;
    const updatedActivities = updateDaySchedule(activity.id, day, { [key]: value });
    const updated = updatedActivities.find((a) => a.id === activity.id) ?? null;
    setActivity(updated);
  }

  function handleDaysChange(days: WeekDay[]) {
    if (!activity || !day) return;
    const updatedActivities = setActivityDays(activity.id, days, {
      ...config,
    });
    const updated = updatedActivities.find((a) => a.id === activity.id) ?? null;

    if (!updated || !updated.schedule[day]) {
      // O dia que estava sendo visualizado foi removido da rotina.
      router.push("/atividades");
      return;
    }

    setActivity(updated);
  }

  function handleDelete() {
    if (!activity || !day) return;
    const confirmed = window.confirm(
      `Remover "${activity.title}" de ${weekDayLabels[day].toLowerCase()}? Os outros dias configurados continuam intactos.`
    );
    if (!confirmed) return;
    removeActivityDay(activity.id, day);
    router.push("/atividades");
  }

  return (
    <div>
      <TopBar title={`${activity.title} · ${weekDayLabels[day]}`} />
      <div className="px-4 sm:px-8 py-6 max-w-xl">
        <button
          onClick={() => router.push("/atividades")}
          className="flex items-center gap-2 text-ink-faint hover:text-ink-muted text-sm transition-colors mb-5"
        >
          <ArrowLeft size={16} />
          Voltar para atividades
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: `${meta.accent}22`, color: meta.accent }}
          >
            <Icon size={22} />
          </div>
          <div>
            <p className="font-head text-lg font-semibold text-ink">
              {activity.title}
            </p>
            <p className="text-ink-muted text-sm">
              {meta.label} · {weekDayLabels[day]}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">
              Horário de início ({weekDayLabels[day]})
            </label>
            <input
              type="time"
              value={config.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="rounded-card bg-base-raised border border-line px-4 py-2.5 text-ink outline-none focus:border-pulse transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">
              Duração (minutos)
            </label>
            <input
              type="number"
              min={5}
              value={config.durationMinutes}
              onChange={(e) =>
                handleChange("durationMinutes", Number(e.target.value))
              }
              className="w-32 rounded-card bg-base-raised border border-line px-4 py-2.5 text-ink outline-none focus:border-pulse transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">
              Dias da semana
            </label>
            <p className="text-ink-faint text-xs mb-2">
              Cada dia mantém seu próprio horário — adicionar um dia novo
              copia o horário de {weekDayLabels[day].toLowerCase()}.
            </p>
            <WeekdaySelector
              selected={scheduledDays(activity)}
              onChange={handleDaysChange}
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">
              Avisar com antecedência de
            </label>
            <div className="flex gap-2">
              {[15, 30].map((min) => (
                <button
                  key={min}
                  onClick={() =>
                    handleChange("notifyBeforeMinutes", min as 15 | 30)
                  }
                  className={`rounded-card border px-4 py-2 text-sm transition-colors ${
                    config.notifyBeforeMinutes === min
                      ? "border-pulse bg-pulse-dim text-ink"
                      : "border-line text-ink-muted hover:border-line"
                  }`}
                >
                  {min} min
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-card border border-line bg-base-raised px-5 py-4">
            <div>
              <p className="text-ink text-sm font-medium">
                Avisos ativos ({weekDayLabels[day]})
              </p>
              <p className="text-ink-faint text-xs">
                Desative para pausar essa atividade nesse dia, sem excluí-la.
              </p>
            </div>
            <button
              onClick={() => handleChange("active", !config.active)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                config.active ? "bg-pulse" : "bg-line"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-base transition-transform ${
                  config.active ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-ink-faint hover:text-signal text-sm transition-colors pt-2"
          >
            <Trash2 size={16} />
            Remover atividade da rotina
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AtividadePage() {
  return (
    <Suspense fallback={null}>
      <AtividadePageInner />
    </Suspense>
  );
}
