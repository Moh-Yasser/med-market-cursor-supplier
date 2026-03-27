import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"

export async function GET(req: NextRequest) {
  const denied = await requireAuth(req)
  if (denied) return denied

  try {
    const qs = req.nextUrl.searchParams.toString()
    const data = await phpFetch(qs ? `/orders?${qs}` : `/orders`)
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}
