"use client"

import { useRef, type FormEvent } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SearchIcon, XIcon } from "lucide-react"

import { SEARCH_PARAM_KEYS, buildQueryString } from "@/app/browse-jobs/params"

export function BrowseJobSearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentQuery = searchParams.get(SEARCH_PARAM_KEYS.query) ?? ""
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function setQuery(query: string) {
    const trimmed = query.trim()
    if (trimmed === currentQuery) return
    const queryString = buildQueryString(searchParams, {
      [SEARCH_PARAM_KEYS.query]: trimmed || null,
    })
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    })
  }

  // Debounced live search while typing (uncontrolled input — no state to sync).
  function handleChange() {
    const value = inputRef.current?.value ?? ""
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.trim() === currentQuery) return
    debounceRef.current = setTimeout(() => setQuery(value), 350)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setQuery(inputRef.current?.value ?? "")
    inputRef.current?.blur()
  }

  function handleClear() {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (inputRef.current) inputRef.current.value = ""
    setQuery("")
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex-row sm:items-center"
      role="search"
    >
      <div className="relative flex-1">
        <SearchIcon
          className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          name={SEARCH_PARAM_KEYS.query}
          defaultValue={currentQuery}
          onChange={handleChange}
          placeholder="Search by job title, keywords..."
          aria-label="Search jobs"
          className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] pr-9 pl-10 text-sm text-white transition-colors outline-none placeholder:text-zinc-500 focus:border-[#6941f6]/60 focus:ring-3 focus:ring-[#6941f6]/20 [&::-webkit-search-cancel-button]:hidden"
        />
        {currentQuery && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <XIcon className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="h-11 shrink-0 rounded-xl bg-white px-5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
      >
        Search Jobs
      </button>
    </form>
  )
}
