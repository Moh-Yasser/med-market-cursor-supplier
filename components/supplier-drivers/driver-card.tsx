import { Driver, DriverStatus } from "@/types/supplier-drivers";
import { MapPin } from "lucide-react";

const statusStyles: Record<DriverStatus, { label: string; className: string , dotClassName: string}> =
  {
    "On delivery": {
      label: "قيد التوصيل",
      className: "bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]",
      dotClassName: "#10b981",
    },
    available: {
      label: "متاح",
      className: "bg-warning text-warning-foreground border-warning",
      dotClassName: "#f59e0b",
    },
    "Off": {
      label: "غير متصل",
      className:
        "bg-surface-container text-on-surface-variant border-outline-variant",
        dotClassName: "#9ca3af",
    },
  };

function QuickInformation({ driver }: { driver: Driver }) {
  if (driver.driverStatus == "On delivery") {
    return (
      <>
        <div>
          <p className="text-[10px] uppercase text-on-surface-variant">
            بدء العمل
          </p>
          <p className="text-sm font-medium text-on-surface">
              <span dir='ltr'>
              {new Date(driver.workEndTime)
              .toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              .toLowerCase()}
            </span>
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-on-surface-variant">
            الطلبات المكتملة
          </p>
          <p className="text-sm font-medium text-on-surface">
            {driver.deliveredOrderCount}
          </p>
        </div>
      </>
    );
  } else if (driver.driverStatus == "available") {
    return (
      <>
        <div>
          <p className="text-[10px] uppercase text-on-surface-variant">
            آخر نشاط
          </p>
          <p className="text-sm  font-medium text-on-surface" >
            <span dir='ltr'>
              {new Date(driver.workEndTime)
              .toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              .toLowerCase()}
            </span>
            
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-on-surface-variant">
            تسليمات اليوم
          </p>
          <p className="text-sm font-medium text-on-surface">
            {driver.deliveredOrderCount}
          </p>
        </div>
      </>
    );
  } else if (driver.driverStatus == "Off") {
    return (
      <>
        <div>
          <p className="text-[10px] uppercase text-on-surface-variant">
            آخر نشاط
          </p>
          <p className="text-sm font-medium text-on-surface">
             <span dir='ltr'>
            {new Date(driver.workEndTime)
              .toLocaleString("en-US", {
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              .replace(",", "")
              .toLowerCase()}
                </span>
          </p>
        </div>
      </>
    );
  }
}

export function DriverCard({ driver }: { driver: Driver }) {
  const status = statusStyles[driver.driverStatus];
  return (
    <div className="group relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest p-4 transition-shadow duration-200 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="flex size-12 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-lg font-bold text-on-surface">
              {driver.name[0]}
            </div>
            <span
             className="absolute bottom-0 left-0 size-3 rounded-full "
              style={{ backgroundColor: status.dotClassName }}
            />
          </div>
          <div>
            <h4 className="text-right text-sm font-semibold text-on-surface">
              {driver.name}
            </h4>
            <div className="mt-1 flex items-center gap-1 text-on-surface-variant">
              <MapPin className="size-3.5" />
              <span className="text-muted-foreground text-[10px] tracking-wider">
                لم يتم تعيين أي مناطق لهذا السائق بعد .
              </span>
            </div>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <QuickInformation driver={driver} />
      </div>
    </div>
  );
}
