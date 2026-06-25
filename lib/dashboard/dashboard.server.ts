import { phpFetch } from "@/lib/api/php.server";
import { DashboardApiResponse } from "@/types/dashboard";

const DASHBOARD_PATH = "/dashboard";
export async function getDashboardData (): Promise<DashboardApiResponse   > {
    return phpFetch<DashboardApiResponse>(DASHBOARD_PATH, { method: "GET" });
  }
