import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001"

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = session.user as { id: string; role?: string }
  if (user.role !== "recruiter") {
    return NextResponse.json(
      { error: "Only recruiters can post jobs" },
      { status: 403 }
    )
  }

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
