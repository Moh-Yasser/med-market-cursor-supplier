import {
    BadgePercent,
    Boxes,
    Gift,
    PlusCircle,
    ShoppingCart,
    Sparkles,
    TrendingUp
  } from "lucide-react"
import Link from "next/link"
  
  export default function SupplierOfferIntro() {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-background p-3 md:p-6">
        <section className="relative mx-auto grid w-full max-w-7xl items-center gap-6 overflow-hidden rounded-2xl border border-border/60 bg-card/95 p-5 shadow-sm md:p-8 xl:grid-cols-[1.1fr_1fr]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
          </div>
  
          <div className="relative order-2 xl:order-1">
            <div className="relative mx-auto flex h-[330px] w-full max-w-xl items-center justify-center">
              <div className="absolute top-5 right-4 w-[250px] rounded-2xl border bg-background p-4 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                <div className="absolute -top-3 -right-3 rounded-lg bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground shadow">
                  خصم 20%
                </div>
  
                <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-muted">
                  <ShoppingCart className="h-9 w-9 text-muted-foreground" />
                </div>
  
                <div className="mb-3 h-4 w-2/3 rounded-full bg-muted" />
  
                <div className="mb-3 flex items-center justify-between gap-3 text-xs">
                  <div className="h-3 w-20 rounded-full bg-muted" />
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground line-through">120 ر.س</span>
                    <span className="font-semibold text-destructive">96 ر.س</span>
                  </div>
                </div>
  
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  إضافة للسلة
                </button>
              </div>
  
              <div className="absolute bottom-3 left-3 w-[270px] rounded-2xl border bg-background p-4 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    الأكثر مبيعاً
                  </span>
  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="rounded-full border px-2 py-0.5">A</span>
                    <span className="rounded-full border px-2 py-0.5">+5</span>
                  </div>
                </div>
  
                <h3 className="mb-2 text-xl font-extrabold">اشتري 10</h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  واحصل على 1 <span className="font-bold text-emerald-600">مجاناً</span>
                </p>
  
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 rounded-lg bg-muted/70 px-2 py-1.5 text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    +18%
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-muted/70 px-2 py-1.5 text-muted-foreground">
                    <Boxes className="h-3.5 w-3.5" />
                    24 طلب
                  </div>
                </div>
              </div>
  
              <BadgePercent className="absolute top-0 left-8 h-10 w-10 text-primary/20" />
              <Gift className="absolute right-0 bottom-10 h-8 w-8 text-amber-400/40" />
            </div>
          </div>
  
          <div className="relative order-1 space-y-5 text-center xl:order-2 xl:text-right">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <BadgePercent className="h-3.5 w-3.5" />
              ابدأ رحلة النمو
            </span>
  
            <h1 className="text-2xl font-extrabold leading-tight tracking-tight md:text-4xl">
              لا توجد عروض نشطة حتى الآن
            </h1>
  
            <p className="mx-auto max-w-2xl text-sm leading-6 text-muted-foreground xl:mx-0">
              تساعد الخصومات في جذب المزيد من العملاء وزيادة معدل التحويل. أنشئ
              عروضاً جذابة لتحفيز المبيعات ومكافأة عملائك المخلصين.
            </p>
  
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row xl:justify-start">
              <Link href="offers/create">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground shadow-md shadow-primary/30 transition-all hover:bg-primary/90 hover:cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" />
                أنشئ عرضك الأول
              </button>
              </Link>
            </div>
  
          
          </div>
        </section>
      </div>
    )
  }
  