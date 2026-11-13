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

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:3001"

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
