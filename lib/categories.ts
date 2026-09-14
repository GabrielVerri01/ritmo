import { ActivityCategory } from "./types";
import { Moon, Utensils, Sparkles, Dumbbell, Briefcase, CircleDot } from "lucide-react";

export const categoryMeta: Record<
  ActivityCategory,
  { label: string; icon: typeof Moon; accent: string }
> = {
  sono: { label: "Sono", icon: Moon, accent: "#8CA3E8" },
  refeicao: { label: "Refeição", icon: Utensils, accent: "#D4E09B" },
  cuidados: { label: "Cuidados pessoais", icon: Sparkles, accent: "#E3B8E0" },
  academia: { label: "Academia", icon: Dumbbell, accent: "#6FCF97" },
  trabalho: { label: "Trabalho", icon: Briefcase, accent: "#EFA463" },
  outro: { label: "Outro", icon: CircleDot, accent: "#8CA396" },
};
