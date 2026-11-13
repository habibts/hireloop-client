"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  BanknoteIcon,
  BookmarkIcon,
  BriefcaseIcon,
  Building2Icon,
  CirclePlusIcon,
  FileTextIcon,
  LayoutGridIcon,
  LogOutIcon,
  SettingsIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"

import globeLogo from "@/app/images/logo.png"
import { cn } from "cn"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type Role = "seeker" | "recruiter" | "admin"

type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string | null
}

type NavItem = {
  label: string
  url: string
  icon: LucideIcon
}

// Route convention: /deshboard/<role>/<section>
const NAV_ITEMS_BY_ROLE: Record<Role, NavItem[]> = {
  seeker: [
    { label: "Dashboard", url: "/deshboard/seeker", icon: LayoutGridIcon },
    { label: "Jobs", url: "/deshboard/seeker/jobs", icon: BriefcaseIcon },
    { label: "Saved Jobs", url: "/deshboard/seeker/saved", icon: BookmarkIcon },
    {
      label: "Applications",
      url: "/deshboard/seeker/applications",
      icon: FileTextIcon,
    },
    { label: "Billing", url: "/deshboard/seeker/billing", icon: WalletIcon },
    {
      label: "Settings",
      url: "/deshboard/seeker/settings",
      icon: SettingsIcon,
    },
  ],
  recruiter: [
    { label: "Dashboard", url: "/deshboard/recruiter", icon: LayoutGridIcon },
    {
      label: "Add Job",
      url: "/deshboard/recruiter/add-job",
      icon: CirclePlusIcon,
    },
    {
      label: "Manage Jobs",
      url: "/deshboard/recruiter/jobs",
      icon: BriefcaseIcon,
    },
    {
      label: "Applications",
      url: "/deshboard/recruiter/applications",
      icon: FileTextIcon,
    },
    {
      label: "Settings",
      url: "/deshboard/recruiter/settings",
      icon: SettingsIcon,
    },
  ],
  admin: [
    { label: "Dashboard", url: "/deshboard/admin", icon: LayoutGridIcon },
    { label: "Users", url: "/deshboard/admin/users", icon: UsersIcon },
    {
      label: "Companies",
      url: "/deshboard/admin/companies",
      icon: Building2Icon,
    },
    { label: "Jobs", url: "/deshboard/admin/jobs", icon: BriefcaseIcon },
    { label: "Payments", url: "/deshboard/admin/payments", icon: BanknoteIcon },
    { label: "Settings", url: "/deshboard/admin/settings", icon: SettingsIcon },
  ],
}

const ROLE_HOME: Record<Role, string> = {
  seeker: "/deshboard/seeker",
  recruiter: "/deshboard/recruiter",
  admin: "/deshboard/admin",
}

function RoleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#6941f6]/60 bg-[#6941f6]/10 px-3 py-0.5 text-sm font-medium text-[#a99bff]",
        className
      )}
    >
      Premium account
    </span>
  )
}

function ProfileCard({
  image,
  name,
  subtitle,
  badge,
}: {
  image?: string | null
  name: string
  subtitle: string
  badge?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
      <Avatar className="size-12 shrink-0">
        {image ? <AvatarImage src={image} alt={name} /> : null}
        <AvatarFallback className="bg-[#6941f6] text-sm text-white">
          {name.trim()?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold text-white">{name}</p>
        <p className="truncate text-zinc-400">{subtitle}</p>
        {badge}
      </div>
    </div>
  )
}

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center px-1">
      <Image src={globeLogo} alt="hireloop" className="h-7 w-auto" priority />
    </Link>
  )
}

export function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user as SessionUser | undefined

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/sign-in")
    }
  }, [isPending, session, router])

  const role: Role =
    user?.role === "admin"
      ? "admin"
      : user?.role === "recruiter"
        ? "recruiter"
        : "seeker"

  const items = NAV_ITEMS_BY_ROLE[role]
  const roleHome = ROLE_HOME[role]
  const userName = user?.name ?? "User"

  async function handleLogout() {
    await authClient.signOut()
    router.push("/")
  }

  return (
    <Sidebar className="border-r border-white/[0.06]">
      <SidebarHeader className="gap-3 p-4 pb-0">
        <Logo />

        {isPending ? (
          <Skeleton className="h-20 rounded-2xl bg-white/[0.04]" />
        ) : role === "recruiter" ? (
          <ProfileCard
            image={user?.image}
            name={userName}
            subtitle="Recruiter"
            badge={<RoleBadge className="mt-1.5" />}
          />
        ) : role === "seeker" ? (
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
            <Avatar className="size-10 shrink-0">
              {user?.image ? (
                <AvatarImage src={user.image} alt={userName} />
              ) : null}
              <AvatarFallback className="bg-[#6941f6] text-sm text-white">
                {userName.trim()?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">Seeker Portal</p>
              <p className="truncate text-xs text-zinc-400">
                Professional Tier
              </p>
            </div>
          </div>
        ) : (
          <p className="px-1 text-sm text-zinc-400">Admin Console</p>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="p-3">
          <SidebarMenu className="gap-1">
            {items.map((item) => {
              const isActive =
                pathname === item.url ||
                (item.url !== roleHome && pathname.startsWith(`${item.url}/`))

              return (
                <SidebarMenuItem key={item.url} className="relative">
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 left-0 h-7 w-[3px] -translate-y-1/2 rounded-full bg-[#8b7ff6]"
                    />
                  )}
                  <SidebarMenuButton
                    render={<Link href={item.url} />}
                    isActive={isActive}
                    size="lg"
                    className={cn(
                      "rounded-lg px-3 text-[15px] font-medium text-zinc-400 hover:bg-white/[0.04] hover:text-white",
                      isActive && "bg-white/[0.06] text-white"
                    )}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 p-4">
        {role === "seeker" && (
          <>
            <Button
              render={<Link href={`${roleHome}/post-resume`} />}
              nativeButton={false}
              className="h-11 w-full rounded-xl bg-white text-[15px] font-semibold text-black hover:bg-zinc-200"
            >
              Post Resume
            </Button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[15px] text-zinc-400 hover:text-white"
            >
              <LogOutIcon className="size-4" aria-hidden="true" />
              Logout
            </button>
          </>
        )}

        {!isPending && role === "admin" && (
          <ProfileCard
            image={user?.image}
            name={userName}
            subtitle="Super Admin"
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
