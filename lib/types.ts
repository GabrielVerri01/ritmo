export type ActivityCategory =
  | "sono"
  | "refeicao"
  | "cuidados"
  | "academia"
  | "trabalho"
  | "outro";

export type WeekDay = "dom" | "seg" | "ter" | "qua" | "qui" | "sex" | "sab";

// Configuração de uma atividade para um dia específico da semana — cada dia
// tem seu próprio horário/duração/aviso, para que alterar um dia não afete
// os demais.
export interface DaySchedule {
  startTime: string; // "HH:mm"
  durationMinutes: number;
  notifyBeforeMinutes: 15 | 30;
  active: boolean;
}

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  schedule: Partial<Record<WeekDay, DaySchedule>>;
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  routineGoal?: string;
  gymName?: string;
}
