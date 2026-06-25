'use client'
import { DriversApiResponse, DriverStatus,Driver,DriversFilters } from "@/types/supplier-drivers";
import { CheckCircle2, Truck, UserPlus, ListFilter } from "lucide-react";
import { DriverCard } from "./driver-card";
import { useQuery } from "@tanstack/react-query";
import { DRIVERS_KEYS } from "@/lib/drivers/drivers-keys";
import { fetchDrivers } from "@/lib/drivers/drivers.client";
import { ORDERS_KEYS } from "@/lib/orders/orders-keys";
import { fetchOrders } from "@/lib/orders/orders.client";
import {  SupplierOrdersFilters } from "@/types/supplier-orders";
import { useSearchParams } from "next/dist/client/components/navigation";
import { useState } from "react";
import { Order } from "@/types/orders_cart";
import { Button } from "../ui/button";
import Link from "next/link";
import { AddDriverDialog } from "./add-driver-dialog";
import { DriversContentSkeleton } from "./drivers-content-skeleton";
import { DriversContentError } from "./drivers-content-error";

function StatCard({
  label,
  value,
  caption,
  icon,
  iconClassName,
}: {
  label: string;
  value: string;
  caption: string;
  icon: React.ReactNode;
  iconClassName: string;
}) {
  return (
    <div className="flex flex-col justify-center rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        {label}
      </p>
      <div className="flex items-center gap-4">
        <div
          className={`flex size-12 items-center justify-center rounded-full ${iconClassName}`}
        >
          {icon}
        </div>
        <div>
          <span className="font-heading text-4xl font-bold text-on-surface">
            {value}
          </span>
          <p className="text-xs text-on-surface-variant">{caption}</p>
        </div>
      </div>
    </div>
  );
}

function getFiltersFromParams(params: URLSearchParams): DriversFilters {
  return {
    status: (params.get("status") as DriverStatus | "all" | null) || "all",
    page: parseInt(params.get("page") || "1", 10),
    per_page: parseInt(params.get("per_page") || "15", 10),
  };
}

export function DriversContent() {
  const searchParams = useSearchParams();
 const [showAdd, setShowAdd] = useState(false)
  const [driversFilters, setDriversFilters] = useState<DriversFilters>(() =>
    getFiltersFromParams(searchParams),
  );
  const OrdersFilters: SupplierOrdersFilters = {
    status: "pending",
  };

const {
  data: DriversData,
  isLoading: driversLoading,
  isError: driversError,
  isFetching: driversFetching,
  refetch: refetchDrivers,
} = useQuery<DriversApiResponse>({
  queryKey: DRIVERS_KEYS.list(driversFilters),
  queryFn: () => fetchDrivers(driversFilters),
});

const {
  data: ordersData,
  isLoading: ordersLoading,
  isError: ordersError,
  isFetching: ordersFetching,
  refetch: refetchOrders,
} = useQuery({
  queryKey: ORDERS_KEYS.list(OrdersFilters),
  queryFn: () => fetchOrders(OrdersFilters),
});
  const drivers : Driver[] = DriversData?.data || [] ;
  const pendingOrders : Order[] = ordersData?.data || [] ;

if (driversLoading || ordersLoading) {
  return <DriversContentSkeleton />;
}

if (driversError || ordersError) {
  return (
    <DriversContentError
      isRetrying={driversFetching || ordersFetching}
      onRetry={() => {
        void refetchDrivers();
        void refetchOrders();
      }}
    />
  );
}

  return (
    <div className="flex-1 overflow-y-auto ">
      {/* Page Header */}
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-heading text-lg font-bold text-on-surface sm:text-xl">
            نظرة عامة على السائقين
          </h2>
          <p className="mt-1 text-xs text-on-surface-variant">
            إدارة المسارات النشطة وحالات السائقين ومقاييس الأداء.
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <UserPlus className="size-4.5" />
          إضافة سائق
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <StatCard
          label="السائقين المتاحين"
          value={drivers.reduce(
            (acc: number, driver) =>
              driver.driverStatus === "available" ||
              driver.driverStatus === "On delivery"
                ? acc + 1
                : acc,
            0,
          ).toString()}
          caption="متصل "
          icon={<CheckCircle2 className="size-6" />}
          iconClassName="bg-teal/20 text-teal"
        />
        <StatCard
          label="الطلبات المعلقة"
          value={pendingOrders.length.toString()}
          caption="في انتظار الإرسال"
          icon={<Truck className="size-6" />}
          iconClassName="bg-warning text-warning-foreground"
        />
      </div>

      <div className="mb-4 mt-8 flex items-center justify-between">
        <h3 className="font-heading text-xl font-bold text-on-surface">
          القائمة النشطة
        </h3>
        <div className="flex gap-2">
          <select className="h-8 rounded border border-outline-variant bg-surface-container-lowest px-2 text-xs font-semibold text-on-surface outline-none focus:ring-1 focus:ring-on-surface">
            <option>جميع الحالات</option>
            <option>قيد التوصيل</option>
            <option>متاح</option>
          </select>
          <button
            aria-label="تصفية"
            className="flex size-8 items-center justify-center rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
          >
            <ListFilter className="size-4" />
          </button>
        </div>
      </div>

      {/* Driver Cards */}
      <div className="grid grid-cols-1 gap-4 pb-8 md:grid-cols-2 xl:grid-cols-3">
        {drivers.map((driver) => (
          <Link
  href={`/drivers/${driver.id}`}
  className="block h-full w-full"
  key={driver.name}
>
          <DriverCard  driver={driver} />
        </Link>
        ))}
      </div>
       <AddDriverDialog open={showAdd} onOpenChange={setShowAdd} />
    </div>
  );
}
