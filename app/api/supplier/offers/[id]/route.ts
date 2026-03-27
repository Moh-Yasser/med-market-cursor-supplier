import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, validateId, safeErrorResponse } from "@/lib/api/auth-guard"

type Ctx = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, ctx: Ctx) {
  const denied = await requireAuth(req)
  if (denied) return denied

  const { id } = await ctx.params
  const invalid = validateId(id)
  if (invalid) return invalid

  try {
    const data = await phpFetch(`/offers/${id}`)
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const denied = await requireAuth(req)
  if (denied) return denied

  const { id } = await ctx.params
  const invalid = validateId(id)
  if (invalid) return invalid

  try {
    const body = await req.json()
    const data = await phpFetch(`/offers/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    })
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const denied = await requireAuth(req)
  if (denied) return denied

  const { id } = await ctx.params
  const invalid = validateId(id)
  if (invalid) return invalid

  try {
    const data = await phpFetch(`/offers/${id}`, { method: "DELETE" })
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}
