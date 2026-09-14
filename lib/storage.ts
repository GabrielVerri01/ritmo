"use client";

import { Activity, DaySchedule, UserProfile, WeekDay } from "./types";
import { seedActivities } from "./mock-data";

const ACTIVITIES_KEY = "ritmo:activities";
const AUTH_KEY = "ritmo:auth";
const PROFILE_KEY = "ritmo:profile";

// Converte uma atividade salva no formato antigo (startTime/daysActive únicos
// para todos os dias) para o formato atual (schedule por dia). Também cobre
// qualquer registro malformado, preenchendo valores padrão.
function migrateActivity(raw: any): Activity {
  if (raw && typeof raw === "object" && raw.schedule && typeof raw.schedule === "object") {
    return raw as Activity;
  }

  const days: WeekDay[] = Array.isArray(raw?.daysActive) ? raw.daysActive : [];
  const config: DaySchedule = {
    startTime: typeof raw?.startTime === "string" ? raw.startTime : "08:00",
    durationMinutes:
      typeof raw?.durationMinutes === "number" ? raw.durationMinutes : 30,
    notifyBeforeMinutes: raw?.notifyBeforeMinutes === 30 ? 30 : 15,
    active: raw?.active ?? true,
  };

  const schedule: Activity["schedule"] = {};
  for (const day of days) {
    schedule[day] = { ...config };
  }

  return {
    id: raw?.id ?? `atividade-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title: raw?.title ?? "Atividade",
    category: raw?.category ?? "outro",
    schedule,
    notes: raw?.notes,
  };
}

export function getActivities(): Activity[] {
  if (typeof window === "undefined") return seedActivities;
  const raw = window.localStorage.getItem(ACTIVITIES_KEY);
  if (!raw) {
    window.localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(seedActivities));
    return seedActivities;
  }

  const parsed = JSON.parse(raw) as unknown[];
  const migrated = parsed.map(migrateActivity);
  saveActivities(migrated);
  return migrated;
}

export function saveActivities(activities: Activity[]) {
  window.localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

export function updateActivity(updated: Activity) {
  const activities = getActivities().map((a) => (a.id === updated.id ? updated : a));
  saveActivities(activities);
  return activities;
}

// Atualiza a configuração (horário, duração, aviso, ativo) de uma atividade
// apenas para um dia específico — os demais dias ficam intactos.
export function updateDaySchedule(
  activityId: string,
  day: WeekDay,
  patch: Partial<DaySchedule>
) {
  const activities = getActivities().map((a) => {
    if (a.id !== activityId) return a;
    const current = a.schedule[day];
    if (!current) return a;
    return {
      ...a,
      schedule: { ...a.schedule, [day]: { ...current, ...patch } },
    };
  });
  saveActivities(activities);
  return activities;
}

export function toggleDayActive(activityId: string, day: WeekDay) {
  const activities = getActivities().map((a) => {
    if (a.id !== activityId) return a;
    const current = a.schedule[day];
    if (!current) return a;
    return {
      ...a,
      schedule: {
        ...a.schedule,
        [day]: { ...current, active: !current.active },
      },
    };
  });
  saveActivities(activities);
  return activities;
}

// Ajusta em quais dias a atividade ocorre. Dias novos herdam a configuração
// passada em `fallback`; dias removidos perdem sua configuração.
export function setActivityDays(
  activityId: string,
  days: WeekDay[],
  fallback: DaySchedule
) {
  const activities = getActivities().map((a) => {
    if (a.id !== activityId) return a;
    const schedule: Activity["schedule"] = {};
    for (const day of days) {
      schedule[day] = a.schedule[day] ?? { ...fallback };
    }
    return { ...a, schedule };
  });
  saveActivities(activities);
  return activities;
}

export function deleteActivity(id: string) {
  const activities = getActivities().filter((a) => a.id !== id);
  saveActivities(activities);
  return activities;
}

// Remove a atividade apenas de um dia específico. Se não sobrar nenhum dia
// configurado, a atividade inteira é removida.
export function removeActivityDay(activityId: string, day: WeekDay) {
  const activities = getActivities()
    .map((a) => {
      if (a.id !== activityId) return a;
      const { [day]: _removed, ...rest } = a.schedule;
      return { ...a, schedule: rest };
    })
    .filter((a) => a.id !== activityId || Object.keys(a.schedule).length > 0);
  saveActivities(activities);
  return activities;
}

export function addActivity(input: {
  title: string;
  startTime: string;
  category?: Activity["category"];
  durationMinutes?: number;
  notifyBeforeMinutes?: 15 | 30;
  daysActive?: WeekDay[];
}) {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `atividade-${Date.now()}`;

  const days: WeekDay[] =
    input.daysActive ?? ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

  const dayConfig: DaySchedule = {
    startTime: input.startTime,
    durationMinutes: input.durationMinutes ?? 30,
    notifyBeforeMinutes: input.notifyBeforeMinutes ?? 15,
    active: true,
  };

  const schedule: Activity["schedule"] = {};
  for (const day of days) {
    schedule[day] = { ...dayConfig };
  }

  const newActivity: Activity = {
    id,
    title: input.title,
    category: input.category ?? "outro",
    schedule,
  };

  const activities = [...getActivities(), newActivity];
  saveActivities(activities);
  return activities;
}

// --- Auth simplificada (mock local, sem backend ainda) ---

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function login(profile: UserProfile) {
  window.localStorage.setItem(AUTH_KEY, "true");
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function logout() {
  window.localStorage.removeItem(AUTH_KEY);
}

export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    return { name: "", email: "" };
  }
  const raw = window.localStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : { name: "", email: "" };
}

export function updateProfile(patch: Partial<UserProfile>) {
  const updated = { ...getProfile(), ...patch };
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  return updated;
}
