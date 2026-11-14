import Link from "next/link"
import type { Metadata } from "next"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SearchXIcon } from "lucide-react"

import { API_BASE_URL } from "@/lib/api"
import type { Job } from "@/lib/types"
import { BrowseJobFilters } from "@/app/components/BrowseJobFilters"
import { BrowseJobCard } from "@/app/components/BrowseJobCard"
import { BrowseJobSearchBar } from "@/app/components/BrowseJobSearchBar"
import { BrowseJobSortSelect } from "@/app/components/BrowseJobSortSelect"
import { BrowseJobsPagination } from "@/app/components/BrowseJobsPagination"
import {
  PAGE_SIZE,
  REMOTE_PARAM_VALUE,
  SEARCH_PARAM_KEYS,
  parsePage,
  parseSort,
  readParam,
} from "@/app/browse-jobs/params"
import type { SortValue } from "@/app/browse-jobs/params"

export const metadata: Metadata = {
  title: "Browse Jobs — HireLoop",
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>

async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      cache: "no-store",
    })
    if (!response.ok) return []
    const jobs = (await response.json()) as Job[]
    return jobs.filter((job) => job.status !== "closed")
  } catch {
    return []
  }
}

function matchesQuery(job: Job, query: string) {
  const haystack = [
    job.title,
    job.companyName,
    job.category,
    job.jobType,
    job.location,
  ]
    .join(" ")
    .toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

function sortJobs(jobs: Job[], sort: SortValue) {
  const salaryOf = (job: Job) => job.maxSalary ?? job.minSalary ?? -1
  const timeOf = (job: Job) =>
    job.createdAt ? new Date(job.createdAt).getTime() : 0

  return [...jobs].sort((a, b) => {
    switch (sort) {
      case "oldest":
        return timeOf(a) - timeOf(b)
      case "salary-high":
        return salaryOf(b) - salaryOf(a)
      case "salary-low":
        return salaryOf(a) - salaryOf(b)
      default:
        return timeOf(b) - timeOf(a)
    }
  })
}

function tallyBy(jobs: Job[], key: (job: Job) => string) {
  const counts: Record<string, number> = {}
  for (const job of jobs) {
    counts[key(job)] = (counts[key(job)] ?? 0) + 1
  }
  return counts
}

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams

  const query = readParam(params, SEARCH_PARAM_KEYS.query) ?? ""
  const jobType = readParam(params, SEARCH_PARAM_KEYS.jobType)
  const category = readParam(params, SEARCH_PARAM_KEYS.category)
  const remoteOnly =
    readParam(params, SEARCH_PARAM_KEYS.remote) === REMOTE_PARAM_VALUE
  const sort = parseSort(readParam(params, SEARCH_PARAM_KEYS.sort))
  const requestedPage = parsePage(readParam(params, SEARCH_PARAM_KEYS.page))

  const jobs = await getJobs()

  const jobTypeCounts = tallyBy(jobs, (job) => job.jobType)
  const categoryCounts = tallyBy(jobs, (job) => job.category)

  const filteredJobs = sortJobs(
    jobs.filter(
      (job) =>
        (!query || matchesQuery(job, query)) &&
        (!jobType || job.jobType.toLowerCase() === jobType.toLowerCase()) &&
        (!category || job.category === category) &&
        (!remoteOnly || job.isRemote)
    ),
    sort
  )

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE))
  const page = Math.min(requestedPage, totalPages)
  const visibleJobs = filteredJobs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

  const currentUrlSearchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue
    for (const item of Array.isArray(value) ? value : [value]) {
      currentUrlSearchParams.append(key, item)
    }
  }
  const hasActiveFilters = Boolean(
    query ||
    jobType ||
    category ||
    remoteOnly ||
    readParam(params, SEARCH_PARAM_KEYS.sort)
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList className="text-sm text-zinc-400">
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/" />}
              className="hover:text-white"
            >
              Public
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-[#a99bff]">
              Browse Jobs
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <BrowseJobSearchBar />

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <BrowseJobFilters
          jobTypeCounts={jobTypeCounts}
          categoryCounts={categoryCounts}
        />

        <section className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              Found{" "}
              <span className="text-[#a99bff]">{filteredJobs.length}</span>{" "}
              {filteredJobs.length === 1 ? "Job" : "Jobs"}
            </h1>
            <BrowseJobSortSelect />
          </div>

          {visibleJobs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-14 text-center">
              <span
                aria-hidden="true"
                className="flex size-12 items-center justify-center rounded-xl bg-white/[0.05] text-zinc-500"
              >
                <SearchXIcon className="size-5" />
              </span>
              <p className="text-lg font-medium text-white">
                {jobs.length === 0
                  ? "No jobs available right now"
                  : "No jobs match your filters"}
              </p>
              <p className="max-w-sm text-sm text-zinc-400">
                {jobs.length === 0
                  ? "Check back soon — new listings appear here as recruiters publish them."
                  : "Try removing some filters or searching for different keywords."}
              </p>
              {hasActiveFilters && (
                <Link
                  href="/browse-jobs"
                  className="mt-1 inline-flex h-9 items-center rounded-xl bg-[#6941f6]/15 px-4 text-sm font-medium text-[#a99bff] transition-colors hover:bg-[#6941f6]/25"
                >
                  Clear all filters
                </Link>
              )}
            </div>
          ) : (
            <>
              <ul className="space-y-4">
                {visibleJobs.map((job) => (
                  <li key={job._id}>
                    <BrowseJobCard job={job} />
                  </li>
                ))}
              </ul>
              <BrowseJobsPagination
                page={page}
                totalPages={totalPages}
                searchParams={currentUrlSearchParams}
              />
            </>
          )}
        </section>
      </div>
    </div>
  )
}
