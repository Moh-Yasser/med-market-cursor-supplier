"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginActionResult, LoginApiResponse, ApiErrorResponse } from "@/types/auth";

const PHP_API_BASE = process.env.PHP_API_BASE!;

export async function loginAction(
  prevState: LoginActionResult | null,
  formData: FormData
): Promise<LoginActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  try {
    const phpRes = await fetch(`${PHP_API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data: LoginApiResponse | ApiErrorResponse = await phpRes.json();

    if (!phpRes.ok || !data.success) {
      return {
        success: false,
        error: (data as ApiErrorResponse).message || (data as ApiErrorResponse).error || "Login failed",
      };
    }

    const loginData = data as LoginApiResponse;

    // Set the access token cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", loginData.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return {
      success: true,
      user: loginData.data.user,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.set("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}

export async function loginAndRedirect(formData: FormData) {
  const result = await loginAction(null, formData);

  if (result.success) {
    if (result.user.role === "supplier") {
      redirect("/dashboard");
    }
    const pharmacyUrl = process.env.PHARMACY_APP_URL || "/login";
    redirect(pharmacyUrl);
  }

  return result;
}