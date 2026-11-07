"use client"

import { BriefcaseBusinessIcon, MapPinIcon, SearchIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

// Deterministic star positions so server/client markup match (no hydration drift)
const STARS = [
  { top: "12%", left: "8%", size: 2, opacity: 0.35 },
  { top: "26%", left: "15%", size: 1, opacity: 0.25 },
  { top: "18%", left: "31%", size: 2, opacity: 0.3 },
  { top: "9%", left: "44%", size: 1, opacity: 0.2 },
  { top: "30%", left: "55%", size: 2, opacity: 0.25 },
  { top: "14%", left: "63%", size: 1, opacity: 0.3 },
  { top: "33%", left: "72%", size: 2, opacity: 0.35 },
  { top: "10%", left: "84%", size: 1, opacity: 0.25 },
  { top: "24%", left: "91%", size: 2, opacity: 0.3 },
  { top: "42%", left: "5%", size: 1, opacity: 0.2 },
  { top: "48%", left: "87%", size: 1, opacity: 0.25 },
  { top: "64%", left: "10%", size: 1, opacity: 0.2 },
  { top: "60%", left: "94%", size: 2, opacity: 0.2 },
  { top: "82%", left: "6%", size: 1, opacity: 0.15 },
  { top: "86%", left: "90%", size: 1, opacity: 0.15 },
  { top: "52%", left: "38%", size: 1, opacity: 0.15 },
  { top: "70%", left: "58%", size: 1, opacity: 0.15 },
  { top: "44%", left: "70%", size: 1, opacity: 0.15 },
]

export function HeroSection() {
  return (
    <section className="px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl bg-[#08080a] px-4 py-14 sm:px-8 sm:py-20 lg:py-24">
        {/* Scattered stars */}
        {STARS.map((star, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative flex flex-col items-center gap-6 text-center sm:gap-8">
          {/* Stat badge with fading side lines */}
          <div className="relative flex items-center">
            <div
              aria-hidden="true"
              className="absolute top-1/2 right-full -mr-24 hidden h-px w-48 bg-gradient-to-l from-violet-500/60 to-transparent sm:block"
            />
            <div
              aria-hidden="true"
              className="absolute top-1/2 -left-24 -ml-24 hidden h-px w-48 bg-gradient-to-r from-violet-500/60 to-transparent sm:block"
            />
            <Badge
              variant="secondary"
              className="h-auto gap-2.5 rounded-full border border-white/10 bg-[#141416] px-4 py-2.5 sm:px-5 sm:py-3"
            >
              <BriefcaseBusinessIcon className="size-4! text-[#b0793e]" />
              <span className="font-mono text-sm font-bold text-white sm:text-base">
                50,000+
              </span>
              <span className="font-mono text-xs tracking-widest text-white/40 sm:text-sm sm:tracking-[0.15em]">
                NEW JOBS THIS MONTH
              </span>
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance text-white sm:text-6xl lg:text-7xl">
            Find Your Dream Job Today
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl text-base text-balance text-white/60 sm:text-lg lg:text-2xl">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>

          {/* Search bar */}
          <div className="mt-2 flex w-full max-w-4xl flex-col gap-2 rounded-2xl border border-white/10 bg-[#101012]/90 p-2.5 shadow-2xl shadow-black/60 sm:flex-row sm:items-center sm:gap-0 sm:p-2.5">
            <div className="relative flex-1">
              <SearchIcon
                aria-hidden="true"
                className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-white/60"
              />
              <Input
                type="text"
                placeholder="Job title, skill or company"
                className="h-11 border-0 bg-transparent pr-3 pl-12 text-base text-white placeholder:text-white/50 focus-visible:ring-0 lg:h-12"
              />
            </div>

            <Separator
              orientation="vertical"
              className="hidden self-stretch bg-white/10 sm:block"
            />

            <div className="relative flex-1">
              <MapPinIcon
                aria-hidden="true"
                className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-white/60"
              />
              <Input
                type="text"
                placeholder="Location or Remote"
                className="h-11 border-0 bg-transparent pr-3 pl-12 text-base text-white placeholder:text-white/50 focus-visible:ring-0 lg:h-12"
              />
            </div>

            <Button
              aria-label="Search jobs"
              className="h-11 shrink-0 rounded-xl bg-[#6941f6] px-4 text-white hover:bg-[#5a35db] lg:h-11 lg:w-11 lg:px-0"
            >
              <SearchIcon className="size-5" />
            </Button>
          </div>

          {/* Trending positions */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="mr-1 text-sm text-white/60 sm:text-lg">
              Trending Position
            </span>
            {trendingPositions.map((position) => (
              <Button
                key={position}
                render={<a href={`/jobs?q=${encodeURIComponent(position)}`} />}
                nativeButton={false}
                variant="secondary"
                className="h-9 rounded-full border border-white/10 bg-white/[0.06] px-4 text-sm text-white/90 hover:bg-white/10 hover:text-white"
              >
                {position}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
