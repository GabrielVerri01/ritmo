"use client";

const ENABLED_KEY = "ritmo:notifications-enabled";
const NOTIFIED_KEY = "ritmo:notified-today";

export type NotificationSupport = "unsupported" | "default" | "granted" | "denied";

export function getNotificationSupport(): NotificationSupport {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationSupport> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.requestPermission();
}

// Preferência do usuário (independente da permissão do navegador) — permite
// pausar os avisos sem revogar a permissão já concedida.
export function isNotificationsEnabled(): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(ENABLED_KEY);
  return raw === null ? true : raw === "true";
}

export function setNotificationsEnabled(enabled: boolean) {
  window.localStorage.setItem(ENABLED_KEY, String(enabled));
}

// Evita repetir o mesmo aviso várias vezes no mesmo dia — guarda os ids já
// notificados hoje, descartando dias anteriores automaticamente.
function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
}

function getNotifiedToday(): string[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(NOTIFIED_KEY);
  if (!raw) return [];
  const data = JSON.parse(raw) as { day: string; ids: string[] };
  return data.day === todayKey() ? data.ids : [];
}

export function wasAlreadyNotified(activityId: string): boolean {
  return getNotifiedToday().includes(activityId);
}

export function markNotified(activityId: string) {
  const ids = new Set(getNotifiedToday());
  ids.add(activityId);
  window.localStorage.setItem(
    NOTIFIED_KEY,
    JSON.stringify({ day: todayKey(), ids: Array.from(ids) })
  );
}
