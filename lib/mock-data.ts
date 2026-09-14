import { Activity, DaySchedule, WeekDay } from "./types";

const allDays: WeekDay[] = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
const weekdays: WeekDay[] = ["seg", "ter", "qua", "qui", "sex"];

function scheduleFor(
  days: WeekDay[],
  config: Omit<DaySchedule, "active">
): Activity["schedule"] {
  const schedule: Activity["schedule"] = {};
  for (const day of days) {
    schedule[day] = { ...config, active: true };
  }
  return schedule;
}

export const seedActivities: Activity[] = [
  {
    id: "acordar",
    title: "Acordar",
    category: "cuidados",
    schedule: scheduleFor(weekdays, {
      startTime: "06:45",
      durationMinutes: 15,
      notifyBeforeMinutes: 15,
    }),
  },
  {
    id: "cafe",
    title: "Café da manhã",
    category: "refeicao",
    schedule: scheduleFor(weekdays, {
      startTime: "07:15",
      durationMinutes: 30,
      notifyBeforeMinutes: 15,
    }),
  },
  {
    id: "trabalho",
    title: "Trabalho / faculdade",
    category: "trabalho",
    schedule: scheduleFor(weekdays, {
      startTime: "08:30",
      durationMinutes: 300,
      notifyBeforeMinutes: 15,
    }),
  },
  {
    id: "academia",
    title: "Academia",
    category: "academia",
    schedule: scheduleFor(["seg", "qua", "sex"], {
      startTime: "18:00",
      durationMinutes: 60,
      notifyBeforeMinutes: 30,
    }),
  },
  {
    id: "jantar",
    title: "Jantar",
    category: "refeicao",
    schedule: scheduleFor(allDays, {
      startTime: "20:00",
      durationMinutes: 40,
      notifyBeforeMinutes: 15,
    }),
  },
  {
    id: "dormir",
    title: "Dormir",
    category: "sono",
    schedule: scheduleFor(allDays, {
      startTime: "23:00",
      durationMinutes: 480,
      notifyBeforeMinutes: 30,
    }),
  },
];
