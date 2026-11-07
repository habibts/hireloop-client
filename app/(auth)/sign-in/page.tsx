"use client"

import { useRouter } from "next/navigation"

import { AuthForm, type AuthSubmitHandler } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()

  const handleSignIn: AuthSubmitHandler = async (data) => {
    const { error } = await authClient.signIn.email({
      email: String(data.email ?? ""),
      password: String(data.password ?? ""),
      rememberMe: data.accepted === "true",
    })

    if (error) {
      throw new Error(
        error.message ? "Invalid email or password." : "Failed to sign in."
      )
    }

    router.push("/")
  }

  return <AuthForm mode="sign-in" onSubmit={handleSignIn} />
}
