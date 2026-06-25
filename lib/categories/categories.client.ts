import axios from "axios";
import { AxiosApi, handleAxiosError } from "@/lib/api/nextBff.client";


const CATEGORIES_ROUTE = "/api/supplier/categories";

import type { CategoriesApiResponse } from "@/types/filters";

export async function getAllCategories(
): Promise<CategoriesApiResponse> {
    try {

        const response = await AxiosApi.get<CategoriesApiResponse>(CATEGORIES_ROUTE);
        return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
}
