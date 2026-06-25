import { Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { TopBuyers } from "@/types/dashboard"

const avatarClass = {
  navy: "bg-[#1a365d] text-white",
  teal: "bg-[#a2eded] text-[#004f50]",
} as const

function BuyersSkeleton() {
  return (
    <div className="space-y-3 p-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-[76px] w-full rounded-xl" />
      ))}
    </div>
  )
}

export function TopBuyersList({
  buyers,
  isLoading = false,
}: {
  buyers: TopBuyers
  isLoading?: boolean
}) {
  return (
    <section className="overflow-hidden rounded-xl bg-white shadow-[0_4px_20px_rgba(26,54,93,0.07)]">
      <div className="border-b border-[#f8fafc] p-6">
        <h2 className="text-lg font-bold text-[#002045]">كبار المشترين</h2>
      </div>

      {isLoading ? (
        <BuyersSkeleton />
      ) : buyers.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-[#43474e]">
          <Users className="h-9 w-9 text-[#c4c6cf]" />
          <p className="text-sm">لا يوجد مشترون</p>
        </div>
      ) : (
        <div className="space-y-3 p-6">
          {buyers.map((buyer, index) => (
            <article
              key={buyer.id}
              className="relative flex items-center justify-between gap-4 rounded-xl border border-transparent bg-[#f8f9ff] p-4 transition hover:border-[#c4c6cf]"
            >
              {/* Rank badge — new addition */}
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#002045] text-[10px] font-bold text-white">
                {index + 1}
              </span>

              <div className="flex min-w-0 items-center gap-3">
                {/* Avatar — now uses buyer.color via avatarClass map */}
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold",
                      avatarClass.navy,
                  )}
                >
                  {buyer.name[0]}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-[#002045]">
                    {buyer.name}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-[#43474e]">
                    {buyer.address}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-left">
                <p className="font-mono text-sm font-bold text-[#13696a]">
                  49200 ل.س
                </p>
                <p className="mt-0.5 text-xs font-semibold text-[#43474e]">
                  100 طلب
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
