export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative flex min-h-svh flex-col bg-[#08080a]">
      <main className="flex flex-1 items-center justify-center px-3 py-8 sm:px-5">
        {children}
      </main>
    </div>
  )
}
