"use client"

import { MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Supplier } from "@/types/company"

function buildMapsUrl(lat?: number | null, lng?: number | null) {
  if (typeof lat !== "number" || typeof lng !== "number") return null
  return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}`
}

function buildMapsEmbedUrl(lat?: number | null, lng?: number | null) {
  if (typeof lat !== "number" || typeof lng !== "number") return null
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
}

export function ProfileMapCard({
  company,
  isLoading,
}: {
  company?: Supplier
  isLoading: boolean
}) {
  const url = buildMapsUrl(company?.latitude ?? null, company?.longitude ?? null)
  const embedUrl = buildMapsEmbedUrl(company?.latitude ?? null, company?.longitude ?? null)

  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">عرض على الخريطة</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-muted/40 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-card">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">الموقع</div>
              <div className="mt-2 text-sm font-medium">
                {isLoading ? "..." : company?.addressLine || company?.address || "لا يوجد عنوان مسجّل"}
              </div>
            </div>
          </div>
        </div>

        <div className="h-52 overflow-hidden rounded-2xl bg-linear-to-br from-muted/60 to-muted">
          {embedUrl ? (
            <iframe
              title="map-preview"
              src={embedUrl}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              أضف الإحداثيات لعرض الخريطة
            </div>
          )}
        </div>

        {url ? (
          <Button asChild variant="ghost" className="w-fit rounded-2xl px-3">
            <a href={url} target="_blank" rel="noreferrer">
              فتح في خرائط Google
              <ExternalLink className="ms-2 h-4 w-4" />
            </a>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}

