import Link from "next/link"
import {
  BanknoteIcon,
  BookmarkIcon,
  ClockIcon,
  GlobeIcon,
  MapPinIcon,
} from "lucide-react"

import { cn } from "cn"
import type { Job } from "@/lib/types"
import {
  formatCompensation,
  formatPostedAgo,
  getCategoryStyle,
} from "@/lib/job-display"

export function BrowseJobCard({ job }: { job: Job }) {
  const category = getCategoryStyle(job.category)
  const CategoryIcon = category.icon
  const postedAgo = formatPostedAgo(job.createdAt)

  return (
    <article className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-xl",
            category.tile
          )}
        >
          <CategoryIcon className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-white">
                <Link
                  href={`/browse-jobs?q=${encodeURIComponent(job.title)}`}
                  className="transition-colors hover:text-[#a99bff]"
                >
                  {job.title}
                </Link>
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-zinc-400">
                <span className="truncate">{job.companyName}</span>
                <span aria-hidden="true" className="text-zinc-600">
                  •
                </span>
                <span className="flex shrink-0 items-center gap-1 truncate">
                  {job.isRemote ? (
                    <GlobeIcon
                      className="size-3.5 shrink-0 text-zinc-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <MapPinIcon
                      className="size-3.5 shrink-0 text-zinc-500"
                      aria-hidden="true"
                    />
                  )}
                  {job.isRemote ? `Remote (${job.location})` : job.location}
                </span>
              </p>
            </div>
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
              title="Save job"
            >
              <BookmarkIcon className="size-4" aria-hidden="true" />
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-300">
              <BanknoteIcon
                className="size-3.5 text-zinc-500"
                aria-hidden="true"
              />
              {formatCompensation(job)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-300 capitalize">
              <ClockIcon
                className="size-3.5 text-zinc-500"
                aria-hidden="true"
              />
              {job.jobType}
            </span>
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium",
                category.tile
              )}
            >
              {job.category}
            </span>
            {postedAgo && (
              <span className="text-xs text-zinc-500">{postedAgo}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
