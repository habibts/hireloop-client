/**
 * Shared domain types for the jobs feature.
 * Consumed by pages, components, server actions and API routes.
 */

/** Payload sent by the add-job form / POST /api/jobs. */
export type JobFormData = {
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
}

/** A stored job as returned by the backend API. */
export type Job = JobFormData & {
  _id: string
  /** "open" | "closed" — assigned by the backend on create. */
  status: string
  createdAt: string | null
}
