"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  ShieldAlert,
  UserX,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DriverDetailsErrorProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
};

export function DriverDetailsError({
  title = "تعذر تحميل بيانات السائق",
  description = "قد يكون السائق غير موجود، أو حدث خطأ أثناء جلب البيانات. يمكنك إعادة المحاولة أو العودة إلى صفحة السائقين.",
  onRetry,
  isRetrying = false,
}: DriverDetailsErrorProps) {
  return (
    <div dir="rtl" className="space-y-6">
      <Link href="/drivers" className="inline-flex">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 hover:bg-transparent hover:text-primary"
        >
          <ArrowRight className="h-4 w-4" />
          العودة إلى السائقين
        </Button>
      </Link>

      <Card className="relative overflow-hidden rounded-3xl border-dashed bg-card shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.10),transparent_35%)]" />

        <CardContent className="relative flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-red-500/10 blur-xl" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-red-200 bg-red-50 text-red-600 shadow-sm dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              <UserX className="h-10 w-10" />
            </div>
          </div>

          <div className="mt-6 max-w-md space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
              <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
              Driver details unavailable
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {title}
            </h2>

            <p className="text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {onRetry && (
              <Button
                type="button"
                onClick={onRetry}
                disabled={isRetrying}
                className="rounded-xl"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
                />
                إعادة المحاولة
              </Button>
            )}

            <Link href="/drivers">
              <Button variant="outline" className="rounded-xl">
                <ArrowRight className="h-4 w-4" />
                العودة إلى القائمة
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl border bg-background/70 px-4 py-3 text-xs text-muted-foreground">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            تأكد من اتصال الشبكة أو صحة رقم السائق.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}