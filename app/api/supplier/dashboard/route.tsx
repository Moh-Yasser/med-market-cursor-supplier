import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, requireSupplierCompanyId, safeErrorResponse } from "@/lib/api/auth-guard"
import type { DashboardApiResponse } from "@/types/dashboard"

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

    const supplierId = await requireSupplierCompanyId(request)

  try {
    const data = await phpFetch<DashboardApiResponse>(`/dashboard?days=7&limit=5&supplier_company_id=${supplierId}`, { method: "GET" })
    return NextResponse.json(data)
  } catch (error) {
    return safeErrorResponse(error)
  }
}
