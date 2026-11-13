import { API_BASE_URL } from "@/lib/api"
import type { JobFormData } from "@/lib/types"

export const createJob = async (data: JobFormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error("Failed to create job")
    }

    return await response.json()
  } catch (error) {
    console.error(error)
    throw error
  }
}
