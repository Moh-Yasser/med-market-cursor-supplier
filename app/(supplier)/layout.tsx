import type React from "react"
import { SidebarClient } from "@/components/supplier-layout/sidebar-client"

export const metadata = {
  title: "سوق الدواء — بوابة الصيدلية",
  description: "لوحة إدارة الصيدلية",
}

export default function SupplierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SidebarClient />
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 xl:mr-60">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </>
  )
}
