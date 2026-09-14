import { DaySchedule, WeekDay } from "./types";

export const weekDayOrder: WeekDay[] = [
  "dom",
  "seg",
  "ter",
  "qua",
  "qui",
  "sex",
  "sab",
];

export const weekDayLabels: Record<WeekDay, string> = {
  dom: "Dom",
  seg: "Seg",
  ter: "Ter",
  qua: "Qua",
  qui: "Qui",
  sex: "Sex",
  sab: "Sáb",
};

export function todayWeekDay(): WeekDay {
  return weekDayOrder[new Date().getDay()];
}

// Resume os dias/horários configurados de uma atividade, ex:
// "Seg, Qua, Sex · 18:00" ou "Ter, Qui · horários variam".
export function describeSchedule(
  schedule: Partial<Record<WeekDay, DaySchedule>>
): string {
  const days = weekDayOrder.filter((d) => schedule[d]);
  if (days.length === 0) return "Nenhum dia configurado";

  const dayLabels = days.map((d) => weekDayLabels[d]).join(", ");
  const times = new Set(days.map((d) => schedule[d]!.startTime));
  const timeLabel =
    times.size === 1 ? schedule[days[0]]!.startTime : "horários variam";

  return `${dayLabels} · ${timeLabel}`;
}
