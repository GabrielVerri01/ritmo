"use client";

import { useEffect } from "react";
import { getActivities } from "@/lib/storage";
import { todayWeekDay } from "@/lib/weekdays";
import {
  getNotificationSupport,
  isNotificationsEnabled,
  markNotified,
  wasAlreadyNotified,
} from "@/lib/notifications";

const CHECK_INTERVAL_MS = 20_000;
// Se a aba ficou em segundo plano e o navegador atrasou o check além disso,
// desiste de notificar (evita um aviso "atrasado" sem sentido).
const LATE_TOLERANCE_MINUTES = 5;

function minutesOfDay(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function NotificationScheduler() {
  useEffect(() => {
    function check() {
      if (getNotificationSupport() !== "granted") return;
      if (!isNotificationsEnabled()) return;

      const today = todayWeekDay();
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      for (const activity of getActivities()) {
        const config = activity.schedule[today];
        if (!config || !config.active) continue;
        if (wasAlreadyNotified(activity.id)) continue;

        const notifyAt = minutesOfDay(config.startTime) - config.notifyBeforeMinutes;
        if (nowMinutes < notifyAt) continue;

        if (nowMinutes > notifyAt + LATE_TOLERANCE_MINUTES) {
          markNotified(activity.id);
          continue;
        }

        new Notification(activity.title, {
          body: `Começa às ${config.startTime} · em ${config.notifyBeforeMinutes} min`,
          tag: `${activity.id}:${today}`,
        });
        markNotified(activity.id);
      }
    }

    check();
    const interval = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return null;
}
