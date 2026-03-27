"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Users,
  Clock,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { logoutAction } from "@/lib/api/auth"

const navItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/dashboard" },
  { title: "المنتجات", icon: Package, href: "/products" },
  { title: " الطلبات", icon: Clock, href: "/orders" },
  { title: "العروض", icon: Tag, href: "/offers" },
  { title: "السائقين", icon: Users, href: "/drivers" },
  { title: "الإعدادات", icon: Settings, href: "/settings/profile" },
]

export function SidebarClient() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/orders" && pathname.startsWith("/orders")) return true
    if (href !== "/orders" && href !== "/orders/history" && pathname.startsWith(href)) return true
    return false
  }

  const handleLogout = async () => {
    await logoutAction()
    window.location.href = "/login"
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6" >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-base">
            M
          </div>
          <span className="text-lg font-semibold">Med Market</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="mr-auto xl:hidden"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed right-0 top-0 z-40 hidden h-screen w-60 border-l bg-card xl:block">
        {sidebar}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-screen w-60 border-l bg-card transition-transform duration-300 xl:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 xl:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-semibold">Med Market</span>
      </div>
    </>
  )
}
