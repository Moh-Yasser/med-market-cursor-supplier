import { cookies } from "next/headers";
import { PhpApiError, BackendErrorBody } from "@/lib/error";

const PHP_API_BASE = process.env.PHP_API_BASE!;

export async function phpFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = (await cookies()).get("access_token")?.value;

  const headers = new Headers(options.headers);
  if (!headers.has("Authorization") && token)
    headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  if (options.body && !headers.get("Content-Type"))
    headers.set("Content-Type", "application/json");

  const res = await fetch(`${PHP_API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const body =
      typeof data === "object" && data !== null
        ? (data as Partial<BackendErrorBody>)
        : {};

    throw new PhpApiError(
      res.status,
      body.error ?? `PHP API error (${res.status})`,
      body.message ?? `PHP API error (${res.status})`,
      body.errors,
      data,
    );
  }

  return data as T;
}
