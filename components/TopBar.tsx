"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProfile } from "@/lib/storage";
import { UserProfile } from "@/lib/types";

export default function TopBar({ title }: { title: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const initial = profile?.name?.charAt(0).toUpperCase() || "?";

  return (
    <header className="h-16 border-b border-line flex items-center justify-between px-8">
      <h1 className="font-head text-lg font-semibold text-ink">{title}</h1>

      <Link
        href="/perfil"
        className="flex items-center gap-2 rounded-full border border-line pl-1 pr-3 py-1 hover:border-pulse transition-colors"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pulse-dim text-pulse-strong text-xs font-semibold">
          {initial}
        </span>
        <span className="text-sm text-ink-muted">{profile?.name || "Perfil"}</span>
      </Link>
    </header>
  );
}
