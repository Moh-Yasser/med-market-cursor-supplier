import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth, requireSupplierCompanyId, safeErrorResponse } from "@/lib/api/auth-guard"
import { z } from "zod"
import { createQueryString } from "@/lib/api/queryString"



export async function GET(req: NextRequest) {
  try {
    const companyId = await requireSupplierCompanyId(req)
    const qs = req.nextUrl.searchParams.toString()
    const data = await phpFetch(`/offers?supplier_company_id=${companyId}&${qs}`)
    return NextResponse.json(data)
  } catch (err) {
    return safeErrorResponse(err)
  }
}

const createSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  offer_type: z.enum(["buy_x_get_y", "percentage_discount", "fixed_discount", "bundle"]),
  quantity_required: z.number().int().min(1).optional(),
  quantity_free: z.number().int().min(1).optional(),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  product_ids: z.array(z.number().int().positive()),
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
    const data = await phpFetch("/offers", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return safeErrorResponse(err)
  }
}
