"use client"

import Link from "next/link"
import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type AuthMode = "sign-in" | "sign-up"

const AUTH_TABS: Array<{
  mode: AuthMode
  value: string
  label: string
  href: string
}> = [
  { mode: "sign-in", value: "sign-in", label: "Sign In", href: "/sign-in" },
  {
    mode: "sign-up",
    value: "sign-up",
    label: "Create Account",
    href: "/sign-up",
  },
]

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [collectedData, setCollectedData] = useState<Record<
    string,
    FormDataEntryValue
  > | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())

    // TODO: replace with real auth integration (better-auth signIn/signUp)
    console.log(`[${mode}] collected form data:`, data)
    setCollectedData(data)
  }

  const isSignIn = mode === "sign-in"

  return (
    <Card className="w-full max-w-md rounded-3xl border-0 bg-[#101012] text-white shadow-2xl ring-1 shadow-black/60 ring-white/10 [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {isSignIn ? "Welcome back" : "Create your account"}
        </CardTitle>
        <CardDescription className="text-white/50">
          {isSignIn
            ? "Sign in to continue your job hunt."
            : "Join HireLoop and find your dream job."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={mode} className="gap-0">
          {/* Toggle between the two auth pages */}
          <TabsList className="h-auto w-full rounded-full border border-white/10 bg-white/[0.04] p-1">
            {AUTH_TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                render={<Link href={tab.href} />}
                className="h-9 rounded-full text-white/50 hover:text-white data-active:bg-[#6941f6] data-active:text-white dark:data-active:border-transparent"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <form onSubmit={handleSubmit} className="mt-6">
            <FieldGroup className="gap-4">
              {!isSignIn && (
                <Field>
                  <FieldLabel htmlFor="name" className="text-white/80">
                    Full name
                  </FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="John Doe"
                    className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/40"
                  />
                  <FieldError />
                </Field>
              )}

              <Field>
                <FieldLabel htmlFor="email" className="text-white/80">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 border-white/10 bg-white/[0.04] text-white placeholder:text-white/40"
                />
                <FieldError />
              </Field>

              <Field>
                <FieldLabel
                  htmlFor="password"
                  className="w-full items-center justify-between text-white/80"
                >
                  Password
                  {isSignIn && (
                    <a
                      href="#"
                      className="text-xs font-normal text-[#8b7ff6] hover:text-[#a99bff]"
                    >
                      Forgot password?
                    </a>
                  )}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete={
                      isSignIn ? "current-password" : "new-password"
                    }
                    placeholder="••••••••"
                    className="h-11 border-white/10 bg-white/[0.04] pr-10 text-white placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((show) => !show)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {showPassword ? (
                      <EyeOffIcon aria-hidden="true" className="size-4" />
                    ) : (
                      <EyeIcon aria-hidden="true" className="size-4" />
                    )}
                  </button>
                </div>
                {!isSignIn && (
                  <FieldDescription className="text-white/40">
                    Must be at least 8 characters.
                  </FieldDescription>
                )}
                <FieldError />
              </Field>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`${mode}-terms`}
                  name="accepted"
                  value="true"
                  required={!isSignIn}
                  className="border-white/20 bg-white/[0.04] text-[#6941f6]"
                />
                <Label
                  htmlFor={`${mode}-terms`}
                  className="text-xs text-white/60"
                >
                  {isSignIn
                    ? "Keep me signed in"
                    : "I agree to the Terms of Service and Privacy Policy"}
                </Label>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl bg-[#6941f6] text-[15px] text-white hover:bg-[#5a35db]"
              >
                {isSignIn ? "Sign In" : "Create Account"}
              </Button>
            </FieldGroup>
          </form>

          {collectedData && (
            <pre className="mt-4 max-h-32 overflow-auto rounded-xl bg-white/[0.04] p-3 text-xs text-white/50">
              {`Collected: ${JSON.stringify(collectedData, null, 2)}`}
            </pre>
          )}
        </Tabs>
      </CardContent>

      <CardFooter className="justify-center gap-1.5 bg-transparent text-sm text-white/50">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-medium text-[#8b7ff6] hover:text-[#a99bff]"
        >
          {isSignIn ? "Get Started" : "Sign In"}
        </Link>
      </CardFooter>
    </Card>
  )
}
