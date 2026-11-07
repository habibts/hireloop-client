"use client"

import { useRouter } from "next/navigation"

import { AuthForm, type AuthSubmitHandler } from "@/components/auth/auth-form"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()

  const handleSignUp: AuthSubmitHandler = async (data) => {
    const { error } = await authClient.signUp.email({
      name: String(data.name ?? ""),
      email: String(data.email ?? ""),
      password: String(data.password ?? ""),
      callbackURL: "/",
    })

    if (error) {
      throw new Error(error.message ?? "Failed to create your account.")
    }

    // better-auth creates the session immediately (no email verification configured),
    // so land the new user on the home page.
    router.push("/")
  }

  return <AuthForm mode="sign-up" onSubmit={handleSignUp} />
}
