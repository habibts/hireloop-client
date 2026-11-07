import Image from "next/image"
import Link from "next/link"

import globeLogo from "@/app/images/logo.png"

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex min-h-svh flex-col bg-[#08080a]">
      <header className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="mx-auto flex w-full max-w-7xl items-center rounded-2xl border border-white/5 bg-[#0b0b0c] px-4 sm:px-5">
          <Link href="/" className="flex items-center py-3 sm:py-3.5">
            <Image
              src={globeLogo}
              alt="hireloop"
              className="h-7 w-auto sm:h-8"
              priority
            />
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-3 py-8 sm:px-5">
        {children}
      </main>
    </div>
  )
}
