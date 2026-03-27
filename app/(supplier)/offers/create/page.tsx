import { OfferForm } from "@/components/supplier-offers/offers-form/offer-form"
import { ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CreateOfferPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="h-1 w-full bg-primary" />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <Sparkles className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="grid gap-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            إنشاء عرض جديد
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            أنشئ خصمًا أو عرضًا ترويجيًا مخصصًا لمنتجات محددة.
          </p>
        </div>
      </div>
      <Button variant="outline" asChild className="gap-2 self-start">
        <Link href="/offers">
          العودة
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </div>
    <OfferForm
      mode="create"
    />
        </div>
      </div>
    </main>
  )
}