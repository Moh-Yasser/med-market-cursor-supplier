import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, safeErrorResponse } from "@/lib/api/auth-guard"
import { z } from "zod"

export async function GET(req: NextRequest) {
  const denied = await requireAuth(req)
  if (denied) return denied

  try {
    const qs = req.nextUrl.searchParams.toString()
    const data = await phpFetch(`/drivers${qs ? `?${qs}` : ""}`)
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}

const createSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  const denied = await requireAuth(req)
  if (denied) return denied

  try {
    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request body", details: parsed.error.flatten() }, { status: 422 })
    }
    const data = await phpFetch("/drivers", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return safeErrorResponse(err)
  }
}
