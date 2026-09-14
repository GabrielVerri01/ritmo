"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { WeekDay } from "@/lib/types";
import WeekdaySelector from "./WeekdaySelector";

export default function AddActivityModal({
  defaultDay,
  heading = "Nova atividade",
  nameLabel = "Nome da atividade",
  namePlaceholder = "Ex: Ler um livro",
  submitLabel = "Adicionar",
  onClose,
  onCreate,
}: {
  defaultDay: WeekDay;
  heading?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  submitLabel?: string;
  onClose: () => void;
  onCreate: (title: string, startTime: string, daysActive: WeekDay[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [daysActive, setDaysActive] = useState<WeekDay[]>([defaultDay]);

  const canSubmit =
    title.trim().length > 0 && startTime.length > 0 && daysActive.length > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onCreate(title.trim(), startTime, daysActive);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-card border border-line bg-base-raised p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-head text-base font-semibold text-ink">
            {heading}
          </h2>
          <button
            onClick={onClose}
            className="text-ink-faint hover:text-ink-muted transition-colors"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">
              {nameLabel}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={namePlaceholder}
              autoFocus
              className="w-full rounded-card bg-base border border-line px-4 py-2.5 text-ink outline-none focus:border-pulse transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">
              Horário
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-card bg-base border border-line px-4 py-2.5 text-ink outline-none focus:border-pulse transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5">
              Dias da semana
            </label>
            <WeekdaySelector selected={daysActive} onChange={setDaysActive} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-card px-4 py-2 text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-card bg-pulse px-4 py-2 text-sm font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
