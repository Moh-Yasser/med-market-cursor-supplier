import Link from "next/link"
import { Button } from "../ui/button"
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react"
import { Card, CardContent } from "../ui/card"

export function OrderDetailsErrorState({
  onRetry,
  isRetrying,
}: {
  onRetry: () => void
  isRetrying: boolean
}) {
  return (
    <div dir="rtl" className="space-y-5">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="w-fit rounded-full px-3 text-muted-foreground hover:text-foreground"
      >
        <Link href="/orders">
          <ArrowRight className="h-4 w-4" />
          العودة إلى السجل
        </Link>
      </Button>

      <Card className="overflow-hidden rounded-4xl border-dashed bg-card shadow-sm">
        <CardContent className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-xl font-semibold">لم يتم العثور على الطلب</h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            قد يكون الطلب غير موجود، أو حدث خطأ أثناء تحميل البيانات. يمكنك
            العودة إلى السجل أو إعادة المحاولة.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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

            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/orders">العودة إلى الطلبات</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}