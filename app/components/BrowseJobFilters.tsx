"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CheckIcon } from "lucide-react"

import { cn } from "cn"
import { JOB_TYPES } from "@/lib/constants"
import {
  FILTER_CATEGORIES,
  REMOTE_PARAM_VALUE,
  SEARCH_PARAM_KEYS,
  buildQueryString,
} from "@/app/browse-jobs/params"

type Counts = Record<string, number>

function formatCount(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`
  }
  return `${count}`
}

function FilterGroup({
  label,
  paramKey,
  activeValue,
  options,
  counts,
  onSelect,
}: {
  label: string
  paramKey: string
  activeValue: string | null
  options: readonly { value: string; label: string }[]
  counts: Counts
  onSelect: (key: string, value: string | null) => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-white">{label}</p>
      <ul className="space-y-0.5">
        {options.map((option) => {
          const count = counts[option.value] ?? 0
          const checked = activeValue === option.value
          return (
            <li key={option.value}>
              <button
                type="button"
                role="checkbox"
                aria-checked={checked}
                disabled={count === 0 && !checked}
                onClick={() =>
                  onSelect(paramKey, checked ? null : option.value)
                }
                className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/[0.04] disabled:pointer-events-none disabled:opacity-40"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                    checked
                      ? "border-[#6941f6] bg-[#6941f6] text-white"
                      : "border-white/20 bg-transparent"
                  )}
                >
                  {checked && <CheckIcon className="size-3" />}
                </span>
                <span
                  className={cn(
                    "flex-1 truncate",
                    checked ? "font-medium text-white" : "text-zinc-400"
                  )}
                >
                  {option.label}
                </span>
                <span className="text-xs text-zinc-500">
                  {formatCount(count)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function BrowseJobFilters({
  jobTypeCounts,
  categoryCounts,
}: {
  jobTypeCounts: Counts
  categoryCounts: Counts
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeType = searchParams.get(SEARCH_PARAM_KEYS.jobType)
  const activeCategory = searchParams.get(SEARCH_PARAM_KEYS.category)
  const remoteOnly =
    searchParams.get(SEARCH_PARAM_KEYS.remote) === REMOTE_PARAM_VALUE
  const hasFilters = Boolean(
    searchParams.get(SEARCH_PARAM_KEYS.query) ||
    activeType ||
    activeCategory ||
    remoteOnly ||
    searchParams.get(SEARCH_PARAM_KEYS.sort)
  )

  function selectParam(key: string, value: string | null) {
    const query = buildQueryString(searchParams, { [key]: value })
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <aside className="h-fit rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 lg:sticky lg:top-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Filters</h2>
        {hasFilters && (
          <Link
            href="/browse-jobs"
            className="text-xs font-medium text-[#a99bff] hover:text-white"
          >
            Clear all
          </Link>
        )}
      </div>

      <div className="space-y-5">
        <FilterGroup
          label="Job Type"
          paramKey={SEARCH_PARAM_KEYS.jobType}
          activeValue={activeType}
          options={JOB_TYPES}
          counts={jobTypeCounts}
          onSelect={selectParam}
        />
        <FilterGroup
          label="Category"
          paramKey={SEARCH_PARAM_KEYS.category}
          activeValue={activeCategory}
          options={FILTER_CATEGORIES.map((category) => ({
            value: category,
            label: category,
          }))}
          counts={categoryCounts}
          onSelect={selectParam}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-white">Location</p>
          <button
            type="button"
            role="checkbox"
            aria-checked={remoteOnly}
            onClick={() =>
              selectParam(
                SEARCH_PARAM_KEYS.remote,
                remoteOnly ? null : REMOTE_PARAM_VALUE
              )
            }
            className="group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-white/[0.04]"
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
                remoteOnly
                  ? "border-[#6941f6] bg-[#6941f6] text-white"
                  : "border-white/20 bg-transparent"
              )}
            >
              {remoteOnly && <CheckIcon className="size-3" />}
            </span>
            <span
              className={cn(
                remoteOnly ? "font-medium text-white" : "text-zinc-400"
              )}
            >
              Remote only
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
