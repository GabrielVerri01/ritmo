"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import AddActivityModal from "@/components/AddActivityModal";
import { Activity, UserProfile, WeekDay } from "@/lib/types";
import {
  addActivity,
  getActivities,
  getProfile,
  logout,
  updateProfile,
} from "@/lib/storage";
import { describeSchedule, todayWeekDay } from "@/lib/weekdays";
import {
  NotificationSupport,
  getNotificationSupport,
  isNotificationsEnabled,
  requestNotificationPermission,
  setNotificationsEnabled,
} from "@/lib/notifications";
import { LogOut, Bell, Dumbbell, Plus, ChevronRight } from "lucide-react";

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permission, setPermission] = useState<NotificationSupport>("unsupported");
  const [enabled, setEnabled] = useState(true);
  const [gymName, setGymName] = useState("");
  const [workouts, setWorkouts] = useState<Activity[]>([]);
  const [showAddWorkout, setShowAddWorkout] = useState(false);

  useEffect(() => {
    const p = getProfile();
    setProfile(p);
    setGymName(p.gymName ?? "");
    setPermission(getNotificationSupport());
    setEnabled(isNotificationsEnabled());
    setWorkouts(getActivities().filter((a) => a.category === "academia"));
  }, []);

  async function handleRequestPermission() {
    const result = await requestNotificationPermission();
    setPermission(result);
  }

  function handleToggleEnabled() {
    const next = !enabled;
    setEnabled(next);
    setNotificationsEnabled(next);
  }

  function handleGymNameBlur() {
    setProfile(updateProfile({ gymName: gymName.trim() }));
  }

  function handleCreateWorkout(title: string, startTime: string, daysActive: WeekDay[]) {
    const activities = addActivity({
      title,
      startTime,
      category: "academia",
      daysActive,
    });
    setWorkouts(activities.filter((a) => a.category === "academia"));
    setShowAddWorkout(false);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!profile) return null;

  return (
    <div>
      <TopBar title="Perfil" />
      <div className="px-4 sm:px-8 py-6 max-w-md">
        <div className="flex items-center gap-4 mb-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pulse-dim text-pulse-strong text-xl font-semibold">
            {profile.name.charAt(0).toUpperCase() || "?"}
          </span>
          <div>
            <p className="font-head text-lg font-semibold text-ink">
              {profile.name}
            </p>
            <p className="text-ink-muted text-sm">{profile.email}</p>
          </div>
        </div>

        <div className="rounded-card border border-line bg-base-raised px-5 py-4 mb-4">
          <p className="text-ink text-sm font-medium mb-1">Sobre a rotina</p>
          <p className="text-ink-faint text-xs leading-relaxed">
            Edite os horários de cada atividade na aba "Atividades". Os
            avisos são recalculados automaticamente a partir daí — não é
            preciso configurar alarmes manualmente.
          </p>
        </div>

        <div className="rounded-card border border-line bg-base-raised px-5 py-4 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={15} className="text-ink-muted" />
            <p className="text-ink text-sm font-medium">
              Notificações do navegador
            </p>
          </div>

          {permission === "unsupported" && (
            <p className="text-ink-faint text-xs leading-relaxed">
              Seu navegador não suporta notificações.
            </p>
          )}

          {permission === "denied" && (
            <p className="text-ink-faint text-xs leading-relaxed">
              Você bloqueou as notificações para o Ritmo. Ative nas
              configurações do navegador (ícone de cadeado na barra de
              endereço) para voltar a receber avisos.
            </p>
          )}

          {permission === "default" && (
            <div>
              <p className="text-ink-faint text-xs leading-relaxed mb-3">
                Receba um aviso no navegador alguns minutos antes de cada
                atividade começar (conforme configurado em cada uma).
              </p>
              <button
                onClick={handleRequestPermission}
                className="rounded-card bg-pulse px-4 py-2 text-sm font-medium text-base hover:opacity-90 transition-opacity"
              >
                Ativar notificações
              </button>
            </div>
          )}

          {permission === "granted" && (
            <div className="flex items-center justify-between mt-2">
              <p className="text-ink-faint text-xs leading-relaxed pr-4">
                Você vai receber um aviso no navegador antes de cada
                atividade, enquanto o Ritmo estiver aberto.
              </p>
              <button
                onClick={handleToggleEnabled}
                className={`relative h-6 w-11 rounded-full shrink-0 transition-colors ${
                  enabled ? "bg-pulse" : "bg-line"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-base transition-transform ${
                    enabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="rounded-card border border-line bg-base-raised px-5 py-4 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Dumbbell size={15} className="text-ink-muted" />
            <p className="text-ink text-sm font-medium">Academia</p>
          </div>
          <p className="text-ink-faint text-xs leading-relaxed mb-3">
            Cadastre onde você treina e organize os horários dos seus
            treinos — eles entram na sua rotina normalmente, com aviso
            incluso.
          </p>

          <label className="block text-xs text-ink-muted mb-1.5">
            Nome da academia
          </label>
          <input
            type="text"
            value={gymName}
            onChange={(e) => setGymName(e.target.value)}
            onBlur={handleGymNameBlur}
            placeholder="Ex: Smart Fit - Unidade Centro"
            className="w-full rounded-card bg-base border border-line px-3 py-2 text-sm text-ink outline-none focus:border-pulse transition-colors mb-4"
          />

          {workouts.length > 0 && (
            <div className="space-y-2 mb-3">
              {workouts.map((workout) => (
                <Link
                  key={workout.id}
                  href={`/atividade/${workout.id}`}
                  className="flex items-center justify-between gap-3 rounded-card border border-line px-3 py-2.5 hover:border-pulse transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-ink text-sm truncate">{workout.title}</p>
                    <p className="text-ink-faint text-xs">
                      {describeSchedule(workout.schedule)}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-ink-faint shrink-0" />
                </Link>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowAddWorkout(true)}
            className="flex items-center gap-1.5 rounded-card border border-line px-3 py-2 text-xs text-ink-muted hover:border-pulse hover:text-ink transition-colors"
          >
            <Plus size={14} />
            Adicionar treino
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-card border border-line px-4 py-2.5 text-sm text-ink-muted hover:border-pulse hover:text-ink transition-colors"
        >
          <LogOut size={16} />
          Sair da conta
        </button>
      </div>

      {showAddWorkout && (
        <AddActivityModal
          defaultDay={todayWeekDay()}
          heading="Novo treino"
          nameLabel="Nome do treino"
          namePlaceholder="Ex: Musculação"
          submitLabel="Adicionar treino"
          onClose={() => setShowAddWorkout(false)}
          onCreate={handleCreateWorkout}
        />
      )}
    </div>
  );
}
