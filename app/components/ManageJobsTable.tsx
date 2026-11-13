"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  BriefcaseIcon,
  CalendarIcon,
  CodeXmlIcon,
  EllipsisVerticalIcon,
  GlobeIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  LandmarkIcon,
  MapPinIcon,
  MegaphoneIcon,
  PaletteIcon,
  PencilIcon,
  SettingsIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react"

import { cn } from "cn"
import { toast } from "@/components/ui/toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Job = {
  _id: string
  title: string
  companyName: string
  category: string
  jobType: string
  isRemote: boolean
  location: string
  deadline: string | null
  minSalary: number | null
  maxSalary: number | null
  frequency: string | null
  responsibilities: string
  qualifications: string
  status: string
  createdAt: string | null
}

type CategoryStyle = {
  icon: LucideIcon
  tile: string
  text: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
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

const FALLBACK_CATEGORY_STYLE: CategoryStyle = {
  icon: BriefcaseIcon,
  tile: "bg-zinc-500/15 text-zinc-400",
  text: "text-zinc-400",
}

const FREQUENCY_SHORT: Record<string, string> = {
  "per hour": "hr",
  "per day": "day",
  "per week": "wk",
  "per month": "mo",
  "per year": "yr",
}

const TABLE_HEAD_CLASSES =
  "px-4 text-xs font-medium tracking-wider text-zinc-500 uppercase"
const TABLE_CELL_CLASSES = "px-4"

function formatCompensation(job: Job) {
  if (job.minSalary == null && job.maxSalary == null) return "—"
  const format = (value: number) =>
    `€${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`
  if (job.minSalary != null && job.maxSalary != null) {
    return `${format(job.minSalary)} – ${format(job.maxSalary)}${
      job.frequency ? ` / ${FREQUENCY_SHORT[job.frequency] ?? job.frequency}` : ""
    }`
  }
  const single = format(job.minSalary ?? job.maxSalary ?? 0)
  return `${single}${job.frequency ? ` / ${FREQUENCY_SHORT[job.frequency] ?? job.frequency}` : ""}`
}

function formatDeadline(value: string | null) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatPostedAgo(value: string | null) {
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

export function ManageJobsTable({ jobs }: { jobs: Job[] }) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const [detailsJob, setDetailsJob] = useState<Job | null>(null)

  async function handleDelete(job: Job) {
    if (deletingId) return
    setDeletingId(job._id)
    try {
      const response = await fetch(`/api/jobs/${job._id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? "Failed to delete the job.")
      }
      toast.add({
        title: "Job post deleted",
        description: `${job.title} was removed from your listings.`,
        type: "success",
      })
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.add({
        title: "Failed to delete the job",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      })
    } finally {
      setDeletingId(null)
      setJobToDelete(null)
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className={cn(TABLE_HEAD_CLASSES, "min-w-56")}>
                Job Title &amp; Dept
              </TableHead>
              <TableHead className={cn(TABLE_HEAD_CLASSES, "min-w-48")}>
                Company &amp; Location
              </TableHead>
              <TableHead className={TABLE_HEAD_CLASSES}>Type</TableHead>
              <TableHead className={cn(TABLE_HEAD_CLASSES, "hidden lg:table-cell")}>
                Compensation
              </TableHead>
              <TableHead className={cn(TABLE_HEAD_CLASSES, "hidden xl:table-cell")}>
                Applicants
              </TableHead>
              <TableHead className={cn(TABLE_HEAD_CLASSES, "hidden md:table-cell")}>
                Status
              </TableHead>
              <TableHead className={cn(TABLE_HEAD_CLASSES, "hidden md:table-cell")}>
                Deadline
              </TableHead>
              <TableHead
                className={cn(TABLE_HEAD_CLASSES, "text-right")}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const category =
                CATEGORY_STYLES[job.category] ?? FALLBACK_CATEGORY_STYLE
              const CategoryIcon = category.icon
              const isClosed = job.status === "closed"
              const postedAgo = formatPostedAgo(job.createdAt)

              return (
                <TableRow
                  key={job._id}
                  className="border-white/[0.04] hover:bg-white/[0.02]"
                >
                  {/* Job title & dept */}
                  <TableCell className={TABLE_CELL_CLASSES}>
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg",
                          category.tile
                        )}
                      >
                        <CategoryIcon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">
                          {job.title}
                        </p>
                        <p
                          className={cn(
                            "truncate text-xs font-medium",
                            category.text
                          )}
                        >
                          {job.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Company & location */}
                  <TableCell className={TABLE_CELL_CLASSES}>
                    <p className="truncate text-sm font-medium text-white">
                      {job.companyName}
                    </p>
                    <p className="flex items-center gap-1.5 truncate text-xs text-zinc-400">
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
                      <span className="truncate">
                        {job.isRemote ? `Remote (${job.location})` : job.location}
                      </span>
                    </p>
                  </TableCell>

                  {/* Type */}
                  <TableCell className={TABLE_CELL_CLASSES}>
                    <span className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-zinc-300">
                      {job.jobType}
                    </span>
                  </TableCell>

                  {/* Compensation */}
                  <TableCell
                    className={cn(
                      TABLE_CELL_CLASSES,
                      "hidden text-sm text-zinc-200 lg:table-cell"
                    )}
                  >
                    {formatCompensation(job)}
                  </TableCell>

                  {/* Applicants (tracking not wired yet) */}
                  <TableCell
                    className={cn(
                      TABLE_CELL_CLASSES,
                      "hidden text-sm text-zinc-500 xl:table-cell"
                    )}
                  >
                    —
                  </TableCell>

                  {/* Status */}
                  <TableCell className={cn(TABLE_CELL_CLASSES, "hidden md:table-cell")}>
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                        isClosed
                          ? "border-white/10 bg-white/[0.04] text-zinc-400"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1.5 rounded-full",
                          isClosed ? "bg-zinc-500" : "bg-emerald-400"
                        )}
                      />
                      {isClosed ? "Expired" : "Active"}
                    </span>
                  </TableCell>

                  {/* Deadline */}
                  <TableCell className={cn(TABLE_CELL_CLASSES, "hidden md:table-cell")}>
                    <p className="text-sm text-zinc-200">
                      {formatDeadline(job.deadline)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {isClosed ? "Closed" : (postedAgo ?? "—")}
                    </p>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className={cn(TABLE_CELL_CLASSES, "text-right")}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        render={<Link href="/deshboard/recruiter/add-job" />}
                        nativeButton={false}
                        className="h-8 rounded-lg bg-[#6941f6]/15 px-3 text-xs font-medium text-[#a99bff] hover:bg-[#6941f6]/25"
                      >
                        <PencilIcon className="size-3.5" aria-hidden="true" />
                        Update
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setJobToDelete(job)}
                        aria-label={`Delete ${job.title}`}
                        className="size-8 rounded-lg text-zinc-400 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2Icon className="size-4" aria-hidden="true" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`More actions for ${job.title}`}
                              className="size-8 rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                            />
                          }
                        >
                          <EllipsisVerticalIcon
                            className="size-4"
                            aria-hidden="true"
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="border-white/10 bg-[#131316] text-zinc-200"
                        >
                          <DropdownMenuItem onClick={() => setDetailsJob(job)}>
                            View details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={jobToDelete !== null}
        onOpenChange={(open) => !open && setJobToDelete(null)}
      >
        <AlertDialogContent className="border-white/10 bg-[#131316] text-zinc-200 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete this job post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              You are about to permanently delete{" "}
              <span className="font-medium text-white">
                {jobToDelete?.title}
              </span>{" "}
              at {jobToDelete?.companyName}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-lg border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.06] hover:text-white"
              disabled={deletingId !== null}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault()
                if (jobToDelete) void handleDelete(jobToDelete)
              }}
              disabled={deletingId !== null}
              className="rounded-lg bg-red-600 text-white hover:bg-red-500"
            >
              {deletingId ? "Deleting..." : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details dialog (kebab menu) */}
      <Dialog
        open={detailsJob !== null}
        onOpenChange={(open) => !open && setDetailsJob(null)}
      >
        <DialogContent className="border-white/10 bg-[#131316] text-zinc-200 sm:max-w-lg">
          {detailsJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">
                  {detailsJob.title}
                </DialogTitle>
                <DialogDescription className="text-zinc-400">
                  {detailsJob.companyName} · {detailsJob.location}
                  {detailsJob.isRemote ? " · Remote" : ""}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="mb-1 font-medium text-white">
                    Key Responsibilities
                  </p>
                  <p className="whitespace-pre-line text-zinc-400">
                    {detailsJob.responsibilities}
                  </p>
                </div>
                <div>
                  <p className="mb-1 font-medium text-white">
                    Qualifications &amp; Requirements
                  </p>
                  <p className="whitespace-pre-line text-zinc-400">
                    {detailsJob.qualifications}
                  </p>
                </div>
                {detailsJob.deadline && (
                  <p className="flex items-center gap-2 text-zinc-400">
                    <CalendarIcon className="size-4" aria-hidden="true" />
                    Apply by {formatDeadline(detailsJob.deadline)}
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
