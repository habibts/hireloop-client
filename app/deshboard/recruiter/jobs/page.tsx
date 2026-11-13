import Link from "next/link"
import { CirclePlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ManageJobsTable, type Job } from "@/app/components/ManageJobsTable"

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001"

async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      cache: "no-store",
    })
    if (!response.ok) return []
    return (await response.json()) as Job[]
  } catch {
    return []
  }
}

export default async function ManageJobsPage() {
  const jobs = await getJobs()

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Breadcrumb className="mb-3">
        <BreadcrumbList className="text-sm text-zinc-400">
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/deshboard/recruiter" />}
              className="hover:text-white"
            >
              Manage Jobs
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-[#a99bff]">
              Job Listings &amp; Postings
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          Manage Job Posts
        </h1>
        <Button
          render={<Link href="/deshboard/recruiter/add-job" />}
          nativeButton={false}
          className="h-11 rounded-xl bg-[#6941f6] px-5 text-[15px] font-medium text-white hover:bg-[#5a35db]"
        >
          <CirclePlusIcon className="size-4" aria-hidden="true" />
          New Job Post
        </Button>
      </div>
      <p className="text-zinc-400">
        Review live listings, monitor applicants, and update job details across
        your organization.
      </p>

      {jobs.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-6 py-14 text-center">
          <p className="text-lg font-medium text-white">No jobs yet</p>
          <p className="max-w-sm text-sm text-zinc-400">
            Publish your first listing to start attracting qualified talent.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <ManageJobsTable jobs={jobs} />
        </div>
      )}
    </div>
  )
}
