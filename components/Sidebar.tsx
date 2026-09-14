"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, Settings, ChevronsLeft, ChevronsRight } from "lucide-react";

const links = [
  { href: "/", label: "Hoje", icon: Home },
  { href: "/atividades", label: "Atividades", icon: ListChecks },
  { href: "/perfil", label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`h-screen shrink-0 bg-base-raised border-r border-line flex flex-col transition-[width] duration-200 ease-out ${
        expanded ? "w-60" : "w-[72px]"
      }`}
    >
      <div className="h-16 flex items-center px-5 gap-3 border-b border-line">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-pulse" />
        </span>
        {expanded && (
          <span className="font-head font-semibold text-ink text-lg whitespace-nowrap">
            Ritmo
          </span>
        )}
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-card px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-pulse-dim text-ink"
                  : "text-ink-muted hover:bg-base-hover hover:text-ink"
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {expanded && <span className="whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setExpanded((v) => !v)}
        className="h-14 flex items-center gap-3 px-5 border-t border-line text-ink-faint hover:text-ink-muted transition-colors"
      >
        {expanded ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
        {expanded && <span className="text-sm">Recolher</span>}
      </button>
    </aside>
  );
}
