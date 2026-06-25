"use client";

export function DriverDetailsLoader() {
  return (
    <div
      dir="rtl"
      className="flex min-h-[50vh] items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative size-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary/15" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        </div>

        <div className="text-center">
          <p className="text-sm font-semibold text-on-surface">
            جاري تحميل بيانات السائق
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">
            يرجى الانتظار قليلاً...
          </p>
        </div>
      </div>
    </div>
  );
}