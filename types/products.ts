import { Company } from "./company";
import {  ProductOffer } from "./offers";
import { ApiResponse } from "./api-response";
export interface category{
    id:number,
    name:string,
    slug:string,
    description:string,
    isActive:true,
    sortOrder:9,
    createdAt:Date,
    updatedAt:Date,
}

export interface manufacturer{
    id:number,
    name:string,
    slug:string,
    description:string,
    isActive:true,
    phone:string|null,
    email:string|null,
    website:string|null,
    sortOrder:number,
    createdAt:Date,
    updatedAt:Date,
}


export interface Product {
    id: number ;
    name: string;
    description: string;
    sku: string;
    barcode: string;
    unit: string;
    wholesale_min_qty:number | null,
    wholesale_price:number | null
    pharmacistPrice: number;
    customerPrice: number,
    stockQuantity: number;
    minStockLevel: number;
    isActive: boolean;  
    category:category;
    discount: number;
    discountType: string;
    manufacturer: manufacturer,
    metadata: null;
    updatedAt: Date;
    createdAt: Date;
    supplierCompany: Company;
    offers:ProductOffer[];
}

export type ProductsApiResponse = ApiResponse<Product>;

export interface ProductDetailResponse {
    success: boolean;
    data: Product
  } 