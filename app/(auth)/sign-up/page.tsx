import type { Metadata } from "next"

import { AuthForm } from "@/components/auth/auth-form"

export const metadata: Metadata = {
  title: "Create Account — HireLoop",
}

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />
}
