/**
 * URL search-param contract for /browse-jobs.
 *
 * Every filter is a single value in the query string, e.g.
 *   /browse-jobs?q=design&type=full-time&category=Design+%26+Creative&remote=1&sort=recent&page=2
 *
 * Changing any filter resets `page` to 1. Shared by the server page,
 * the client filter widgets and the pagination links.
 */

import { JOB_CATEGORIES } from "@/lib/constants"

/** Query-string keys used by the browse page. */
export const SEARCH_PARAM_KEYS = {
  query: "q",
  jobType: "type",
  category: "category",
  remote: "remote",
  sort: "sort",
  page: "page",
} as const

export const REMOTE_PARAM_VALUE = "1"

export const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary-high", label: "Salary: High to Low" },
  { value: "salary-low", label: "Salary: Low to High" },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]["value"]

const DEFAULT_SORT: SortValue = "recent"

export const PAGE_SIZE = 6

/** Read one param, collapsing repeated params (`?type=a&type=b`) to a string. */
export function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string | null {
  const value = params[key]
  if (Array.isArray(value)) return value[0] ?? null
  return value ?? null
}

export function parseSort(raw: string | null): SortValue {
  return SORT_OPTIONS.some((option) => option.value === raw)
    ? (raw as SortValue)
    : DEFAULT_SORT
}

export function parsePage(raw: string | null): number {
  const page = Number.parseInt(raw ?? "", 10)
  return Number.isFinite(page) && page >= 1 ? page : 1
}

/**
 * Build a query string from the current params with overrides applied.
 * Passing `null` removes the key. `page` is dropped automatically when any
 * filter changes (pass `resetPage: false` to keep it, e.g. for pagination).
 */
export function buildQueryString(
  params: URLSearchParams,
  overrides: Record<string, string | null>,
  { resetPage = true }: { resetPage?: boolean } = {}
): string {
  const next = new URLSearchParams(params)
  for (const [key, value] of Object.entries(overrides)) {
    if (value == null || value === "") {
      next.delete(key)
    } else {
      next.set(key, value)
    }
  }
  if (resetPage) next.delete(SEARCH_PARAM_KEYS.page)
  return next.toString()
}

/** Valid category values for the sidebar (prefilled from constants). */
export const FILTER_CATEGORIES: readonly string[] = JOB_CATEGORIES
