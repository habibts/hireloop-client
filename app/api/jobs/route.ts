import { NextResponse } from "next/server"

import { API_BASE_URL, requireRecruiter } from "@/lib/api"

export async function POST(request: Request) {
  const guard = await requireRecruiter()
  if (guard) return guard

  const body = await request.json()

  const requiredFields = [
    "title",
    "companyName",
    "category",
    "jobType",
    "location",
    "responsibilities",
    "qualifications",
  ] as const

  const missing = requiredFields.filter(
    (field) => !body?.[field] || String(body[field]).trim() === ""
  )
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    )
  }

  try {
    const backendResponse = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!backendResponse.ok) {
      const data = await backendResponse.json().catch(() => null)
      return NextResponse.json(
        { error: data?.error ?? "Failed to save the job" },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json().catch(() => null)
    return NextResponse.json(data ?? {}, { status: backendResponse.status })
  } catch {
    return NextResponse.json(
      { error: "Failed to reach the jobs API" },
      { status: 502 }
    )
  }
}
