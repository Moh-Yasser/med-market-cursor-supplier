import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/isAuthenticated"
import { PhpApiError } from "@/lib/error"

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

export async function requireSupplierCompanyId(req: NextRequest): Promise<number> {
  const me = await isAuthenticated(req);
  if(me.success==true){

  const companyId = Number(me.data.data.company?.id);
  if (!Number.isInteger(companyId) || companyId <= 0) {
    throw new PhpApiError(403, "Forbidden", "Supplier company is missing from session");
  }

  return companyId;
}
else {
    throw new PhpApiError(403, "Forbidden", "You do not have access to this resource");

}
}


export function safeErrorResponse(err: unknown, fallbackStatus = 500) {
  console.error("[API Error]", err);

  if (err instanceof PhpApiError) {
    return NextResponse.json(
      {
        success: false,
        error: err.title,
        message: err.message,
        ...(err.errors && { errors: err.errors }),
      },
      { status: err.status === 0 ? 503 : err.status },
    );
  }

  return NextResponse.json(
    { success: false, error: "Unexpected Error", message: "An unexpected error occurred" },
    { status: fallbackStatus },
  );
}



