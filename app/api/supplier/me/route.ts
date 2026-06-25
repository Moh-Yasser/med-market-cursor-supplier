import { NextResponse } from "next/server";
import { getMe } from "@/lib/api/auth"
export async function GET() {

  const data = await getMe();
  
  if (!data.success) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json(data);
}