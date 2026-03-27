import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, validateId, safeErrorResponse } from "@/lib/api/auth-guard"
import { z } from "zod"

type Ctx = { params: Promise<{ id: string }> }

const schema = z.object({ driver_id: z.number().int().positive() })

export async function POST(req: NextRequest, ctx: Ctx) {
  const denied = await requireAuth(req)
  if (denied) return denied

  const { id } = await ctx.params
  const invalid = validateId(id)
  if (invalid) return invalid

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request body", details: parsed.error.flatten() }, { status: 422 })
    }
    const data = await phpFetch(`/orders/${id}/assign-driver`, {
      method: "POST",
      body: JSON.stringify(parsed.data),
    })
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}
