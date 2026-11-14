/**
 * Shared display helpers for job listings (cards, tables).
 * Pure functions/constants — safe to import from server or client components.
 */

import {
  BriefcaseIcon,
  CodeXmlIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  LandmarkIcon,
  MegaphoneIcon,
  PaletteIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"

import type { Job } from "@/lib/types"

export type CategoryStyle = {
  icon: LucideIcon
  tile: string
  text: string
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Engineering & Tech": {
    icon: CodeXmlIcon,
    tile: "bg-[#6941f6]/15 text-[#8b7ff6]",
    text: "text-[#8b7ff6]",
  },
  "Design & Creative": {
    icon: PaletteIcon,
    tile: "bg-orange-500/15 text-orange-400",
    text: "text-orange-400",
  },
  "Marketing & Sales": {
    icon: MegaphoneIcon,
    tile: "bg-pink-500/15 text-pink-400",
    text: "text-pink-400",
  },
  "Finance & Legal": {
    icon: LandmarkIcon,
    tile: "bg-emerald-500/15 text-emerald-400",
    text: "text-emerald-400",
  },
  Healthcare: {
    icon: HeartPulseIcon,
    tile: "bg-red-500/15 text-red-400",
    text: "text-red-400",
  },
  "Education & Training": {
    icon: GraduationCapIcon,
    tile: "bg-sky-500/15 text-sky-400",
    text: "text-sky-400",
  },
  "Operations & Support": {
    icon: SettingsIcon,
    tile: "bg-amber-500/15 text-amber-400",
    text: "text-amber-400",
  },
  Other: {
    icon: BriefcaseIcon,
    tile: "bg-zinc-500/15 text-zinc-400",
    text: "text-zinc-400",
  },
}

export const FALLBACK_CATEGORY_STYLE: CategoryStyle = {
  icon: BriefcaseIcon,
  tile: "bg-zinc-500/15 text-zinc-400",
  text: "text-zinc-400",
}

export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] ?? FALLBACK_CATEGORY_STYLE
}

const FREQUENCY_SHORT: Record<string, string> = {
  "per hour": "hr",
  "per day": "day",
  "per week": "wk",
  "per month": "mo",
  "per year": "yr",
}

export function formatCompensation(job: Job) {
  if (job.minSalary == null && job.maxSalary == null) return "—"
  const format = (value: number) =>
    `€${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`
  if (job.minSalary != null && job.maxSalary != null) {
    return `${format(job.minSalary)} – ${format(job.maxSalary)}${
      job.frequency
        ? ` / ${FREQUENCY_SHORT[job.frequency] ?? job.frequency}`
        : ""
    }`
  }
  const single = format(job.minSalary ?? job.maxSalary ?? 0)
  return `${single}${job.frequency ? ` / ${FREQUENCY_SHORT[job.frequency] ?? job.frequency}` : ""}`
}

export function formatDeadline(value: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatPostedAgo(value: string | null) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const days = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  )
  if (days === 0) return "Posted today"
  return `Posted ${days}d ago`
}
