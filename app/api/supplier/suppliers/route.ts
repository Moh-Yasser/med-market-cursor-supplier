import { NextRequest, NextResponse } from "next/server"
import { phpFetch } from "@/lib/api/php.server"
import { requireAuth } from "@/lib/api/auth-guard"
import {  SuppliersApiResponse } from "@/types/company"
 
export async function GET(request: NextRequest) {
  const denied = await requireAuth(request)
  if (denied) return denied

  try {
    const queryString = request.nextUrl.searchParams.toString()
   console.log("Query String:",queryString ? `?${queryString}` : "") // Debugging log
    const phpPath =  `/companies?type=supplier&${queryString ? `?${queryString}` : ""}`
    const data = await phpFetch<SuppliersApiResponse>(phpPath, { method: "GET" })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

