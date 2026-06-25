"use client";

import { AlertTriangle, RefreshCw, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";

type DriversContentErrorProps = {
  onRetry?: () => void;
  isRetrying?: boolean;
};

export function DriversContentError({
  onRetry,
  isRetrying = false,
}: DriversContentErrorProps) {
  return (
    <main
      dir="rtl"
      className="flex min-h-[calc(100vh-120px)] flex-1 items-center justify-center bg-background p-4 sm:p-6"
    >
      <div className="w-full max-w-xl rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 text-center shadow-sm">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <UserX className="size-8" />
        </div>

        <div className="mt-5">
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-outline-variant bg-background px-3 py-1 text-xs font-semibold text-on-surface-variant">
            <AlertTriangle className="size-3.5 text-warning-foreground" />
            خطأ في تحميل البيانات
          </div>

          <h2 className="font-heading text-xl font-bold text-on-surface">
            تعذر تحميل قائمة السائقين
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-on-surface-variant">
            حدث خطأ أثناء جلب بيانات السائقين أو الطلبات المعلقة. يمكنك إعادة
            المحاولة، وإذا استمرت المشكلة تحقق من الاتصال أو الخادم.
          </p>
        </div>

        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-6"
          >
            <RefreshCw
              className={`size-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            إعادة المحاولة
          </Button>
        )}
      </div>
    </main>
  );
}