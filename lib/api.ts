import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"

/**
 * Base URL of the external hireloop-server backend (Express + MongoDB).
 * Set API_BASE_URL in .env; falls back to the local dev server.
 */
export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001"

/**
 * Route-handler guard: returns a 401/403 NextResponse when the caller is not a
 * signed-in recruiter, or null when the request may proceed.
 */
export async function requireRecruiter() {
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

  return null
}
