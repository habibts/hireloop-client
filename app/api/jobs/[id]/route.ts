import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = session.user as { role?: string }
  if (user.role !== "recruiter") {
    return NextResponse.json(
      { error: "Only recruiters can manage jobs" },
      { status: 403 }
    )
  }

  const { id } = await params

  try {
    const backendResponse = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: "DELETE",
    })

    if (!backendResponse.ok) {
      const data = await backendResponse.json().catch(() => null)
      return NextResponse.json(
        { error: data?.error ?? "Failed to delete the job" },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to reach the jobs API" },
      { status: 502 }
    )
  }
}
