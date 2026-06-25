import type React from "react"
import { SupplierDashboardShell } from "@/components/supplier-layout/supplier-dashboard-shell"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"
import { getMe } from "@/lib/api/auth"

export const metadata = {
  title: "سوق الدواء — بوابة المورد",
  description: "لوحة إدارة التوريدات الطبية",
}

export default async function SupplierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
  })

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2e]">
      <SupplierDashboardShell />
      <div className="min-h-screen xl:mr-64 max-xl:mt-6">
        <main className="min-h-screen">
          <div className="mx-auto max-w-360 p-4  sm:pX-6 ">
            <HydrationBoundary state={dehydrate(queryClient)}>
              {children}
            </HydrationBoundary>
          </div>
        </main>
      </div>
    </div>
  )
}
