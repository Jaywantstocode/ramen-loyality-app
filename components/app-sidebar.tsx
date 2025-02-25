"use client"
import { createSvgIcon } from '@mui/material/utils';

import { Home, Gift, QrCode, User, BarChart, Menu, X } from "lucide-react"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

const menuItems = [
  { icon: Home, label: "ホーム", href: "/" },
  { icon: Gift, label: "特典", href: "/rewards" },
  { icon: QrCode, label: "ポイント獲得", href: "/collect-points" },
  { icon: User, label: "プロフィール", href: "/profile" },
  { icon: BarChart, label: "管理", href: "/admin" },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* デスクトップサイドバー */}
      <Sidebar className="border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:flex min-w-[70px] lg:min-w-[240px]">
        <SidebarHeader className="flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-lg font-semibold hidden lg:block">麺ポイント</h2>
          </Link>
          <SidebarTrigger className="lg:hidden">
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-accent transition-colors",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-2 w-full">
                      <item.icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "hidden lg:block",
                        isActive ? "font-medium" : "text-muted-foreground"
                      )}>
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      {/* モバイルボトムナビゲーション */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/40 md:hidden">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full py-1",
                  isActive && "text-primary"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs",
                  isActive ? "font-medium" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* モバイルでボトムナビゲーションの高さ分の余白を確保 */}
      <div className="h-16 md:hidden" />
    </>
  )
}

