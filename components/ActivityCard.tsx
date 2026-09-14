"use client";

import Link from "next/link";
import { Activity, WeekDay } from "@/lib/types";
import { categoryMeta } from "@/lib/categories";
import { Bell, BellOff } from "lucide-react";

function status(startTime: string, durationMinutes: number) {
  const now = new Date();
  const [h, m] = startTime.split(":").map(Number);
  const start = new Date(now);
  start.setHours(h, m, 0, 0);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  if (now >= start && now <= end) return "agora";
  if (now < start) return "proxima";
  return "concluida";
}

export default function ActivityCard({
  activity,
  day,
  onToggle,
}: {
  activity: Activity;
  day: WeekDay;
  onToggle: (id: string, day: WeekDay) => void;
}) {
  const config = activity.schedule[day];
  if (!config) return null;

  const meta = categoryMeta[activity.category];
  const Icon = meta.icon;
  const st = status(config.startTime, config.durationMinutes);

  return (
    <div
      className={`flex items-center gap-4 rounded-card border px-5 py-4 transition-colors ${
        st === "agora"
          ? "border-pulse bg-pulse-dim/40"
          : "border-line bg-base-raised"
      } ${!config.active ? "opacity-50" : ""}`}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${meta.accent}22`, color: meta.accent }}
      >
        <Icon size={18} />
      </div>

      <Link href={`/atividade/${activity.id}?day=${day}`} className="flex-1 min-w-0">
        <p className="text-ink font-medium truncate">{activity.title}</p>
        <p className="text-ink-muted text-sm">
          {config.startTime} · {meta.label}
          {st === "agora" && (
            <span className="ml-2 text-signal font-medium">em andamento</span>
          )}
        </p>
      </Link>

      <button
        onClick={() => onToggle(activity.id, day)}
        className="text-ink-faint hover:text-ink-muted transition-colors shrink-0"
        aria-label={config.active ? "Desativar aviso" : "Ativar aviso"}
      >
        {config.active ? <Bell size={18} /> : <BellOff size={18} />}
      </button>
    </div>
  );
}
