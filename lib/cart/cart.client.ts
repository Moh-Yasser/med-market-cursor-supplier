import axios from "axios";
import { AxiosApi, handleAxiosError } from "@/lib/api/nextBff.client";
import type {  CartApiResponse } from "@/types/orders_cart";

export interface AddCartItemPayload {
  product_id: number;
  quantity: number;
  notes?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
  notes?: string;
}

const CART_ROUTE = "/api/supplier/cart";

export async function getCart(): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.get<CartApiResponse>(CART_ROUTE);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}



export async function addCartItem(
  payload: AddCartItemPayload
): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.post<CartApiResponse>(
      `${CART_ROUTE}/items`,
      payload
    );
    return response.data;
  } catch (error) {
   handleAxiosError(error);
  }
}

export async function updateCartItem(
  id: string | number,
  payload: UpdateCartItemPayload
): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.put<CartApiResponse>(
      `${CART_ROUTE}/items/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}


export async function removeCartItem(
  id: string | number
): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.delete<CartApiResponse>(
      `${CART_ROUTE}/items/${id}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}


export async function clearCart(): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.delete<CartApiResponse>(CART_ROUTE);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}


export async function checkoutCart(supplierId:number): Promise<CartApiResponse> {
  try {
    const response = await AxiosApi.post<CartApiResponse>(
      `${CART_ROUTE}/checkout`,
      { supplierId }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
