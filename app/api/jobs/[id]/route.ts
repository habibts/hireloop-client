import { NextResponse } from "next/server"

import { API_BASE_URL, requireRecruiter } from "@/lib/api"

async function forwardToBackend(
  id: string,
  method: "DELETE" | "PATCH",
  body?: string
) {
  try {
    const backendResponse = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method,
      ...(body !== undefined
        ? {
            headers: { "Content-Type": "application/json" },
            body,
          }
        : {}),
    })

    if (!backendResponse.ok) {
      const data = await backendResponse.json().catch(() => null)
      return NextResponse.json(
        { error: data?.error ?? "Failed to update the job" },
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireRecruiter()
  if (guard) return guard

  const { id } = await params
  const body = await request.json()
  return forwardToBackend(id, "PATCH", JSON.stringify(body))
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireRecruiter()
  if (guard) return guard

  const { id } = await params
  return forwardToBackend(id, "DELETE")
}
