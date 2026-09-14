import { WeekDay } from "./types";

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
