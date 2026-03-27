import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"

export async function GET(req: NextRequest) {
  const denied = await requireAuth(req)
  if (denied) return denied

  try {
    const qs = req.nextUrl.searchParams.toString()
    const data = await phpFetch(`/products${qs ? `?${qs}` : ""}`)
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth(req)
  if (denied) return denied

  try {
    const body = await req.json()
    const data = await phpFetch("/products", {
      method: "POST",
      body: JSON.stringify(body),
    })
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}
