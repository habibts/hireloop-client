"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOutIcon, MenuIcon } from "lucide-react"

import globeLogo from "@/app/images/logo.png"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

export function Navbar() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/")
  }

  return (
    <header className="w-full px-3 pt-3 sm:px-5 sm:pt-4">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between rounded-2xl border border-white/5 bg-[#0b0b0c] px-3 sm:h-16 sm:px-5 lg:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={globeLogo}
            alt="hireloop"
            className="h-7 w-auto sm:h-9"
            priority
          />
        </Link>

        {/* Right cluster: links + actions, flush right as in the design */}
        <div className="flex items-center">
          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Button
                key={link.label}
                render={<Link href={link.href} />}
                nativeButton={false}
                variant="ghost"
                className="text-white/90 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Button>
            ))}

            <Separator
              orientation="vertical"
              className="mx-2 h-6 bg-white/15"
            />

            {isPending ? null : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Open account menu"
                      className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#8b7ff6]"
                    />
                  }
                >
                  <Avatar className="size-8">
                    {user.image ? (
                      <AvatarImage src={user.image} alt={user.name ?? "User"} />
                    ) : null}
                    <AvatarFallback className="bg-[#6941f6] text-sm text-white">
                      {(
                        user.name?.trim()?.[0] ??
                        user.email?.[0] ??
                        "U"
                      ).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>
                      <p className="truncate font-medium text-white">
                        {user.name ?? "User"}
                      </p>
                      <p className="truncate text-xs font-normal text-white/60">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={handleSignOut}
                      className="cursor-pointer py-1.5"
                    >
                      <LogOutIcon aria-hidden="true" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                render={<Link href="/sign-in" />}
                nativeButton={false}
                variant="ghost"
                className="text-[#8b7ff6] hover:bg-white/10 hover:text-[#a99bff]"
              >
                Sign In
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-lg"
                    aria-label="Open menu"
                    className="text-white hover:bg-white/10 md:hidden"
                  />
                }
              >
                <MenuIcon aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 md:hidden">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Menu</DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {navLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.label}
                    render={<Link href={link.href} />}
                    nativeButton={false}
                    className="cursor-pointer py-1.5"
                  >
                    {link.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        <p className="truncate font-medium text-white">
                          {user.name ?? "User"}
                        </p>
                        <p className="truncate text-xs font-normal text-white/60">
                          {user.email}
                        </p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={handleSignOut}
                        className="cursor-pointer py-1.5"
                      >
                        <LogOutIcon aria-hidden="true" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                ) : (
                  <DropdownMenuItem
                    render={<Link href="/sign-in" />}
                    className="cursor-pointer py-1.5 text-[#8b7ff6]"
                  >
                    Sign In
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {!user && (
              <Button
                render={<Link href="/sign-up" />}
                nativeButton={false}
                className="h-9 rounded-xl bg-[#6941f6] px-3.5 text-sm text-white hover:bg-[#5a35db] sm:h-10 sm:px-5 sm:text-[15px]"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
