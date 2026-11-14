"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import {
  SORT_OPTIONS,
  SEARCH_PARAM_KEYS,
  buildQueryString,
} from "@/app/browse-jobs/params"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function BrowseJobSortSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeSort = searchParams.get(SEARCH_PARAM_KEYS.sort) ?? "recent"

  function handleSortChange(value: string | null) {
    // "recent" is the default — omit it to keep URLs clean.
    const next = value === "recent" ? null : value
    const query = buildQueryString(searchParams, {
      [SEARCH_PARAM_KEYS.sort]: next,
    })
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-sm text-zinc-500 sm:inline">Sort by:</span>
      <Select value={activeSort} onValueChange={handleSortChange}>
        <SelectTrigger
          size="sm"
          aria-label="Sort jobs"
          className="h-8 border-white/10 bg-white/[0.04] text-zinc-300"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-white/10 bg-[#131316] text-zinc-200">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
