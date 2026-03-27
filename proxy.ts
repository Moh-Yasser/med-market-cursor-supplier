import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "./lib/isAuthenticated"

const PUBLIC_ROUTES = ["/login"]

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublic = PUBLIC_ROUTES.some((route) => path.startsWith(route))
  const authResult = await isAuthenticated(req)

  if (!isPublic) {
    if (!authResult.success) {
      return NextResponse.redirect(new URL("/login", req.nextUrl))
    }

    const user = authResult.data
    if (user.role === "buyer") {
      const pharmacyUrl = process.env.PHARMACY_APP_URL || "/login"
      return NextResponse.redirect(new URL(pharmacyUrl))
    }
  }

  if (isPublic && authResult.success) {
    const user = authResult.data
    if (user.role === "supplier") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
    }
    if (user.role === "buyer") {
      const pharmacyUrl = process.env.PHARMACY_APP_URL || "/login"
      return NextResponse.redirect(new URL(pharmacyUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
}
