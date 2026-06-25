import { NextRequest } from "next/server";
import type { MeApiResponse } from "@/types/auth";
import { phpFetch } from "./api/php.server";
import { PhpApiError } from "./error";

type AuthResult =
  | { success: true; data: MeApiResponse }
  | { success: false; status: number; message: string };

export async function isAuthenticated(req: NextRequest): Promise<AuthResult> {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return { success: false, status: 401, message: "No access token found" };
  }

  try {
    const data = await phpFetch<MeApiResponse>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, data };
  } catch (err) {
    if (err instanceof PhpApiError) {
      return { success: false, status: err.status, message: err.message };
    }
    return { success: false, status: 500, message: "Unknown auth error" };
  }
}