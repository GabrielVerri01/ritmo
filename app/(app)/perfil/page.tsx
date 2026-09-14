"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import { UserProfile } from "@/lib/types";
import { getProfile, logout } from "@/lib/storage";
import {
  NotificationSupport,
  getNotificationSupport,
  isNotificationsEnabled,
  requestNotificationPermission,
  setNotificationsEnabled,
} from "@/lib/notifications";
import { LogOut, Bell } from "lucide-react";

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permission, setPermission] = useState<NotificationSupport>("unsupported");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setProfile(getProfile());
    setPermission(getNotificationSupport());
    setEnabled(isNotificationsEnabled());
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

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!profile) return null;

  return (
    <div>
      <TopBar title="Perfil" />
      <div className="px-8 py-6 max-w-md">
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
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-base transition-transform ${
                    enabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-card border border-line px-4 py-2.5 text-sm text-ink-muted hover:border-pulse hover:text-ink transition-colors"
        >
          <LogOut size={16} />
          Sair da conta
        </button>
      </div>
    </div>
  );
}
