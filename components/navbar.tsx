"use client"

import Image from "next/image"
import Link from "next/link"
import { MenuIcon } from "lucide-react"

import globeLogo from "@/app/images/logo.png"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
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

            <Button
              render={<Link href="/sign-in" />}
              variant="ghost"
              className="text-[#8b7ff6] hover:bg-white/10 hover:text-[#a99bff]"
            >
              Sign In
            </Button>
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
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {navLinks.map((link) => (
                  <DropdownMenuItem
                    key={link.label}
                    render={<Link href={link.href} />}
                    className="cursor-pointer py-1.5"
                  >
                    {link.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={<Link href="/sign-in" />}
                  className="cursor-pointer py-1.5 text-[#8b7ff6]"
                >
                  Sign In
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              render={<Link href="/sign-up" />}
              className="h-9 rounded-xl bg-[#6941f6] px-3.5 text-sm text-white hover:bg-[#5a35db] sm:h-10 sm:px-5 sm:text-[15px]"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}
