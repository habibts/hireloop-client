import Image from "next/image"
import Link from "next/link"

import globeLogo from "@/app/images/logo.png"

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "/company" },
      { label: "Companies", href: "/company" },
      { label: "Salary data", href: "/pricing" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "/pricing" },
      { label: "Career library", href: "/jobs" },
      { label: "Contact", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "/pricing" },
      { label: "Newsroom", href: "/pricing" },
    ],
  },
]

function FacebookBrandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14 8.5V6.75c0-.69.56-1.25 1.25-1.25H17V2h-2.5A4.5 4.5 0 0 0 10 6.5v2H7.5V12H10v10h4V12h2.5l.5-3.5H14Z"
        fill="currentColor"
      />
    </svg>
  )
}

function LinkedInBrandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5.4 3a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8ZM3.3 9.4h4.2V21H3.3V9.4Zm6.9 0h4v1.6h.06c.56-1.06 1.93-2.18 3.97-2.18 4.25 0 5.03 2.8 5.03 6.43V21h-4.2v-5.1c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V21h-4.2V9.4Z"
        fill="currentColor"
      />
    </svg>
  )
}

function PayPalBrandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M7.07 20.5 4.2 21.75c-.5.22-1.05-.21-.96-.74L6.6 3.7a1.5 1.5 0 0 1 1.48-1.25h6.27c3.05 0 5.13 1.95 4.7 4.9-.43 3-2.9 4.9-5.92 4.9h-2.3a1.5 1.5 0 0 0-1.47 1.24l-1.3 7.01Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M8.9 22.05 7.6 22.3a1.04 1.04 0 0 1-1.2-1.3l1.05-5.62a1.5 1.5 0 0 1 1.47-1.23h2.85c2.9 0 4.98-1.92 5.42-4.9.06-.4.08-.78.06-1.15.98.66 1.46 1.8 1.25 3.2-.43 2.98-2.9 4.88-5.92 4.88h-.98a1.5 1.5 0 0 0-1.47 1.23l-.84 4.51a1.5 1.5 0 0 1-1.39 1.13Z"
        fill="currentColor"
      />
    </svg>
  )
}

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: FacebookBrandIcon },
  { label: "PayPal", href: "https://paypal.com", icon: PayPalBrandIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInBrandIcon },
]

export function Footer() {
  return (
    <footer className="w-full px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-[#08080a] px-4 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 sm:gap-8 lg:grid-cols-[1fr_2fr]">
          {/* Brand block */}
          <div className="flex max-w-xs flex-col gap-5">
            <Link href="/" className="w-fit">
              <Image
                src={globeLogo}
                alt="hireloop"
                className="h-9 w-auto"
                priority
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/40 sm:text-base">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-4">
            {footerColumns.map((column) => (
              <nav
                key={column.title}
                aria-label={column.title}
                className="flex flex-col gap-4 sm:gap-5"
              >
                <h3 className="text-sm font-medium text-[#8b7ff6] sm:text-base">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-3 sm:gap-4">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/40 transition-colors hover:text-white sm:text-[15px]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col gap-6 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex items-center gap-2.5">
            {socialLinks.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white/70 transition-colors hover:bg-[#6941f6] hover:text-white"
                >
                  <social.icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 text-sm text-white/40 sm:flex-row sm:items-center sm:gap-8">
            <p>Copyright 2024. —Programming Hero</p>
            <p>
              <Link
                href="/pricing"
                className="transition-colors hover:text-white"
              >
                Terms &amp; Policy
              </Link>
              <span className="mx-2">·</span>
              <Link
                href="/pricing"
                className="transition-colors hover:text-white"
              >
                Privacy Guideline
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
