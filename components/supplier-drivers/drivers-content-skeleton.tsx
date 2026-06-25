"use client";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-muted ${className}`}
    />
  );
}

function StatCardSkeleton() {
  return (
    <div className="flex flex-col justify-center rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      <SkeletonBlock className="mb-3 h-3 w-32" />

      <div className="flex items-center gap-4">
        <SkeletonBlock className="size-12 rounded-full" />

        <div className="space-y-2">
          <SkeletonBlock className="h-9 w-16" />
          <SkeletonBlock className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

function DriverCardSkeleton() {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="size-12 rounded-full" />

          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-3 w-44" />
          </div>
        </div>

        <SkeletonBlock className="h-7 w-20 rounded-full" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg   bg-background/60 p-3">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="mt-3 h-5 w-10" />
        </div>

        <div className="rounded-lg bg-background/60 p-3">
          <SkeletonBlock className="h-3 w-20" />
          <SkeletonBlock className="mt-3 h-5 w-10" />
        </div>
      </div>
    </div>
  );
}

export function DriversContentSkeleton() {
  return (
    <main
      dir="rtl"
      aria-busy="true"
      aria-live="polite"
      className="flex-1 overflow-y-auto bg-background p-4 sm:p-6"
    >
      <span className="sr-only">جاري تحميل السائقين</span>

      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <SkeletonBlock className="h-6 w-48" />
          <SkeletonBlock className="h-3 w-72 max-w-full" />
        </div>

        <SkeletonBlock className="h-10 w-32 rounded-lg" />
      </div>

      <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <div className="mb-4 mt-8 flex items-center justify-between">
        <SkeletonBlock className="h-7 w-32" />

        <div className="flex gap-2">
          <SkeletonBlock className="h-8 w-28 rounded-md" />
          <SkeletonBlock className="size-8 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-8 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <DriverCardSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}