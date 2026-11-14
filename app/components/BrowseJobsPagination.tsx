import Link from "next/link"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "cn"
import { SEARCH_PARAM_KEYS, buildQueryString } from "@/app/browse-jobs/params"

function getPageItems(
  page: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }
  const wanted = new Set(
    [1, 2, page - 1, page, page + 1, totalPages - 1, totalPages].filter(
      (item) => item >= 1 && item <= totalPages
    )
  )
  const items: (number | "ellipsis")[] = []
  let previous = 0
  for (const item of [...wanted].sort((a, b) => a - b)) {
    if (item - previous > 1) items.push("ellipsis")
    items.push(item)
    previous = item
  }
  return items
}

export function BrowseJobsPagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number
  totalPages: number
  searchParams: URLSearchParams
}) {
  if (totalPages <= 1) return null

  function hrefFor(targetPage: number) {
    const query = buildQueryString(
      searchParams,
      { [SEARCH_PARAM_KEYS.page]: `${targetPage}` },
      { resetPage: false }
    )
    return query ? `/browse-jobs?${query}` : "/browse-jobs"
  }

  const itemClasses =
    "flex size-9 items-center justify-center rounded-lg border text-sm transition-colors"
  const idleClasses =
    "border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08] hover:text-white"

  return (
    <nav aria-label="Job pages" className="mt-6 flex justify-center">
      <ul className="flex flex-wrap items-center gap-1.5">
        <li>
          {page > 1 ? (
            <Link
              href={hrefFor(page - 1)}
              aria-label="Previous page"
              className={cn(itemClasses, idleClasses)}
            >
              <ChevronLeftIcon className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className={cn(
                itemClasses,
                "border-white/5 bg-transparent text-zinc-700"
              )}
            >
              <ChevronLeftIcon className="size-4" />
            </span>
          )}
        </li>

        {getPageItems(page, totalPages).map((item, index) =>
          item === "ellipsis" ? (
            <li
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-1 text-sm text-zinc-500"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={hrefFor(item)}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  itemClasses,
                  item === page
                    ? "border-transparent bg-[#6941f6] font-medium text-white"
                    : idleClasses
                )}
              >
                {item}
              </Link>
            </li>
          )
        )}

        <li>
          {page < totalPages ? (
            <Link
              href={hrefFor(page + 1)}
              aria-label="Next page"
              className={cn(itemClasses, idleClasses)}
            >
              <ChevronRightIcon className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className={cn(
                itemClasses,
                "border-white/5 bg-transparent text-zinc-700"
              )}
            >
              <ChevronRightIcon className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}
