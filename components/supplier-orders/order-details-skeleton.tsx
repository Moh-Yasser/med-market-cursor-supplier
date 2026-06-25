"use client"

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-muted ${className}`}
    />
  )
}



function SkeletonDetailsCard() {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="h-8 w-8 rounded-full" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl border bg-background/60 p-3">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="mt-3 h-5 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonTable() {
  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <SkeletonBlock className="h-5 w-28" />
          <SkeletonBlock className="mt-2 h-3 w-40" />
        </div>
        <SkeletonBlock className="h-9 w-24 rounded-full" />
      </div>

      <div className="space-y-3 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center gap-4 rounded-xl border bg-background/50 p-3"
          >
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-4 w-1/2" />
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function OrderDetailsSkeleton() {
  return (
    <div
      dir="rtl"
      aria-busy="true"
      aria-live="polite"
      className="space-y-5"
    >
      <span className="sr-only">جاري تحميل تفاصيل الطلب</span>

      <SkeletonBlock className="h-9 w-36 rounded-full" />

      <section className="relative overflow-hidden rounded-[2rem] border bg-card p-5 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.12),_transparent_35%)]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <SkeletonBlock className="h-7 w-28 rounded-full" />
              <SkeletonBlock className="h-7 w-24 rounded-full" />
            </div>

            <div>
              <SkeletonBlock className="h-9 w-56" />
              <SkeletonBlock className="mt-3 h-4 w-72 max-w-full" />
            </div>

            <div className="flex flex-wrap gap-2">
              <SkeletonBlock className="h-9 w-36 rounded-full" />
              <SkeletonBlock className="h-9 w-44 rounded-full" />
              <SkeletonBlock className="h-9 w-32 rounded-full" />
            </div>
          </div>

          <SkeletonBlock className="h-11 w-40 rounded-xl" />
        </div>
      </section>

     

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <SkeletonDetailsCard />
        <SkeletonDetailsCard />
      </div>

      <SkeletonTable />
    </div>
  )
}