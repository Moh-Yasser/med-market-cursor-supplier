import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/isAuthenticated"

export async function requireAuth(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get("access_token")?.value

  if (!token) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  return null
}

export function validateId(id: string): NextResponse | null {
  if (!id || !/^\d+$/.test(id)) {
    return NextResponse.json({ success: false, error: "Invalid ID" }, { status: 400 })
  }
  return null
}

type SupplierCompanyAuthResult =
  | { ok: true; companyId: number }
  | { ok: false; response: NextResponse }

export async function requireSupplierCompanyId(req: NextRequest): Promise<SupplierCompanyAuthResult> {
  const me = await isAuthenticated(req)

  if (!("success" in me) || !me.success) {
    return {
      ok: false,
      response: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }),
    }
  }

  if (me.data.role !== "supplier") {
    return {
      ok: false,
      response: NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }),
    }
  }

  const companyId = Number(me.data.company?.id)
  if (!Number.isInteger(companyId) || companyId <= 0) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Supplier company is missing from session" },
        { status: 403 },
      ),
    }
  }

  return { ok: true, companyId }
}


export function safeErrorResponse(err: unknown, fallbackStatus = 500) {
  if (err && typeof err === "object" && "status" in err && "message" in err) {
    const e = err as { status: number; message: string; payload?: unknown }
    return NextResponse.json(
      { success: false, error: e.message },
      { status: e.status },
    )
  }
  return NextResponse.json(
    { success: false, error: "An unexpected error occurred" },
    { status: fallbackStatus },
  )
}
