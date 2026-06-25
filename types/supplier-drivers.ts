import type { ApiResponse } from "./api-response";

import { Company } from "./company";

export type DriverStatus = "available" | "On delivery" | "Off";

export type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "driver";
  company: Company;
  workStartTime: Date;
  workEndTime: Date;
  employmentStartDate: Date;
  employmentEndDate: Date;
  driverStatus: DriverStatus;
  deliveredOrderCount: number;
  totalOrderCount: number;
  createdAt: Date;
  updatedAt: Date;
};



export type DriversApiResponse = ApiResponse<Driver>;

export interface DriversFilters {
  status?: DriverStatus | "all";
  page?: number;
  per_page?: number;
}

export interface CreateDriverPayload {
  name: string;
  email: string;
  password: string;
}

export interface DriverOrdersFilters {
  status?: string
  page?: number
  per_page?: number
}