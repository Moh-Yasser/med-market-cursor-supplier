import axios from "axios";
import { AxiosApi, handleAxiosError } from "@/lib/api/nextBff.client";


const DASHBOARD_ROUTE = "/api/supplier/dashboard";

import type { DashboardApiResponse } from "@/types/dashboard";

export async function getDashboardData(
): Promise<DashboardApiResponse> {
    try {

        const response = await AxiosApi.get<DashboardApiResponse>(DASHBOARD_ROUTE);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}
