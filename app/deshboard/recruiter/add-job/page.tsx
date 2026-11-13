"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  ArrowRightIcon,
  BuildingIcon,
  CalendarIcon,
  EuroIcon,
  GlobeIcon,
  MapPinIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  FieldLabel,
  LabeledInput,
  LabeledSelect,
  LabeledTextarea,
} from "@/components/form/fields"
import { Switch } from "@/components/ui/switch"
import {
  JOB_CATEGORIES,
  JOB_TYPES,
  SALARY_FREQUENCIES,
} from "@/lib/constants"

const categoryOptions = JOB_CATEGORIES.map((category) => ({
  value: category,
  label: category,
}))

const frequencyOptions = SALARY_FREQUENCIES.map((frequency) => ({
  value: frequency,
  label: frequency,
}))

export default function AddJobPage() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [category, setCategory] = useState("")
  const [jobType, setJobType] = useState("")
  const [isRemote, setIsRemote] = useState(false)
  const [location, setLocation] = useState("")
  const [deadline, setDeadline] = useState("")
  const [minSalary, setMinSalary] = useState("")
  const [maxSalary, setMaxSalary] = useState("")
  const [frequency, setFrequency] = useState("")
  const [responsibilities, setResponsibilities] = useState("")
  const [qualifications, setQualifications] = useState("")

  async function handlePublish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (
      !title.trim() ||
      !companyName.trim() ||
      !category ||
      !jobType ||
      !location.trim() ||
      !responsibilities.trim() ||
      !qualifications.trim()
    ) {
      setError("Please fill in all required fields.")
      return
    }

    setPending(true)
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          companyName,
          category,
          jobType,
          isRemote,
          location,
          deadline: deadline || null,
          minSalary: minSalary === "" ? null : Number(minSalary),
          maxSalary: maxSalary === "" ? null : Number(maxSalary),
          frequency: frequency || null,
          responsibilities,
          qualifications,
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error ?? "Failed to publish the job.")
      }

      router.push("/deshboard/recruiter/jobs")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to publish the job."
      )
      setPending(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <Breadcrumb className="mb-3">
        <BreadcrumbList className="text-sm text-zinc-400">
          <BreadcrumbItem>
            <BreadcrumbLink
              render={<Link href="/deshboard/recruiter/jobs" />}
              className="hover:text-white"
            >
              Manage Jobs
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-[#a99bff]">
              Create New Listing
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold text-white sm:text-4xl">
          Post a New Job
        </h1>
        <Button
          type="submit"
          form="add-job-form"
          disabled={pending}
          className="h-11 rounded-xl bg-[#6941f6] px-5 text-[15px] font-medium text-white hover:bg-[#5a35db]"
        >
          {pending ? "Publishing..." : "Publish Job"}
          <ArrowRightIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <p className="text-zinc-400">
        Fill in the position specifications to attract qualified talent across
        our network.
      </p>

      <form
        id="add-job-form"
        onSubmit={handlePublish}
        className="mt-8 space-y-10 border-t border-white/5 pt-8"
      >
        {/* 1. Basic Information */}
        <section className="space-y-5">
          <h2 className="flex items-center gap-2.5 text-lg font-medium text-white">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#8b7ff6]"
            />
            1. Basic Information
          </h2>

          <div className="space-y-1.5">
            <LabeledInput
              id="job-title"
              label="Job Title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Frontend Developer"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LabeledInput
              id="company-name"
              label="Company Name"
              required
              icon={BuildingIcon}
              value={companyName}
              onChange={(event) => setCompanyName(event.target.value)}
              placeholder="HirePulse Network"
            />

            <LabeledSelect
              label="Job Category"
              required
              placeholder="Select a category"
              options={categoryOptions}
              value={category}
              onValueChange={(value) => setCategory(value ?? "")}
            />
          </div>

          <div className="space-y-1.5">
            <FieldLabel required>Job Type</FieldLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {JOB_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setJobType(type.value)}
                  aria-pressed={jobType === type.value}
                  className={
                    jobType === type.value
                      ? "h-11 cursor-pointer rounded-lg border border-[#8b7ff6]/60 bg-[#6941f6]/10 text-[15px] font-medium text-white"
                      : "h-11 cursor-pointer rounded-lg border border-white/[0.06] bg-white/[0.03] text-[15px] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                  }
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Location, Compensation & Timeline */}
        <section className="space-y-5">
          <h2 className="flex items-center gap-2.5 text-lg font-medium text-white">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#8b7ff6]"
            />
            2. Location, Compensation &amp; Timeline
          </h2>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#6941f6]/15 text-[#8b7ff6]">
                <GlobeIcon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-white">
                  Remote Work Allowed (isRemote)
                </p>
                <p className="text-sm text-zinc-400">
                  Enable worldwide or distributed candidate applications
                </p>
              </div>
            </div>
            <Switch
              checked={isRemote}
              onCheckedChange={setIsRemote}
              aria-label="Remote work allowed"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <LabeledInput
              id="job-location"
              label="Job Location"
              hint="Required"
              icon={MapPinIcon}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="New York, USA"
            />

            <LabeledInput
              id="application-deadline"
              label="Application Deadline"
              type="date"
              icon={CalendarIcon}
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
              className="[color-scheme:dark]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <LabeledInput
              id="min-salary"
              label="Min Salary / Rate"
              type="number"
              min="0"
              icon={EuroIcon}
              value={minSalary}
              onChange={(event) => setMinSalary(event.target.value)}
              placeholder="25"
            />

            <LabeledInput
              id="max-salary"
              label="Max Salary / Rate"
              type="number"
              min="0"
              icon={EuroIcon}
              value={maxSalary}
              onChange={(event) => setMaxSalary(event.target.value)}
              placeholder="40"
            />

            <LabeledSelect
              label="Frequency"
              placeholder="per hour"
              options={frequencyOptions}
              value={frequency}
              onValueChange={(value) => setFrequency(value ?? "")}
            />
          </div>
        </section>

        {/* 3. Responsibilities & Requirements */}
        <section className="space-y-5">
          <h2 className="flex items-center gap-2.5 text-lg font-medium text-white">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#8b7ff6]"
            />
            3. Responsibilities &amp; Requirements
          </h2>

          <LabeledTextarea
            id="responsibilities"
            label="Key Responsibilities"
            required
            value={responsibilities}
            onChange={(event) => setResponsibilities(event.target.value)}
            placeholder="Describe the day-to-day responsibilities..."
            className="min-h-28"
          />

          <LabeledTextarea
            id="qualifications"
            label="Qualifications & Requirements"
            required
            value={qualifications}
            onChange={(event) => setQualifications(event.target.value)}
            placeholder={
              "• 3+ years of experience with React...\n• Solid understanding of..."
            }
            className="min-h-36"
          />
        </section>

        {error && (
          <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
