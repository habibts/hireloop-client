import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { DashboardSidebar } from "../components/DashboardSidebar"

// Dark sidebar tokens (design is dark regardless of color mode).
// Desktop Sidebar and the mobile Sheet both read these.
const sidebarTokens = {
  "--sidebar": "#0b0b0c",
  "--sidebar-foreground": "#d4d4d8",
  "--sidebar-accent": "rgba(255, 255, 255, 0.05)",
  "--sidebar-accent-foreground": "#fafafa",
  "--sidebar-border": "rgba(255, 255, 255, 0.08)",
  "--sidebar-ring": "#8b7ff6",
} as React.CSSProperties

const dashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider style={sidebarTokens} className="bg-[#0b0b0c]">
      <DashboardSidebar />
      <main className="min-h-svh flex-1 bg-[#0b0b0c]">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default dashboardLayout
