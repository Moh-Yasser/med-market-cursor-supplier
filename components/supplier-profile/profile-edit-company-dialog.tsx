"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateCompany } from "@/lib/profile/profile.client"
import type { Supplier } from "@/types/company"

const schema = z.object({
  name: z.string().min(2, "اسم الشركة مطلوب").optional().or(z.literal("")),
  email: z.string().email("بريد إلكتروني غير صالح").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address_line: z.string().optional().or(z.literal("")),
  tax_id: z.string().optional().or(z.literal("")),
  registration_number: z.string().optional().or(z.literal("")),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  maps_url: z.string().optional().or(z.literal("")),
})

type FormValues = z.infer<typeof schema>

export function EditCompanyDialog({
  open,
  onOpenChange,
  company,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  company?: Supplier
  onSaved: () => void | Promise<void>
}) {
  const [locating, setLocating] = useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  })

  function parseCoordinatesFromGoogleMapsUrl(value: string): { lat: number; lng: number } | null {
    const text = value.trim()
    if (!text) return null

    // Example: .../@24.7136,46.6753,15z
    const atPattern = /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(text)
    if (atPattern) {
      const lat = Number(atPattern[1])
      const lng = Number(atPattern[2])
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
    }

    // Example: ...?q=24.7136,46.6753 or ...?ll=24.7136,46.6753
    const queryPattern = /[?&](?:q|ll)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/.exec(text)
    if (queryPattern) {
      const lat = Number(queryPattern[1])
      const lng = Number(queryPattern[2])
      if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng }
    }

    return null
  }

  const currentLat = form.watch("latitude")
  const currentLng = form.watch("longitude")

  useEffect(() => {
    if (!open) return
    form.reset({
      name: company?.name || "",
      email: company?.email || "",
      phone: company?.phone || "",
      address_line: company?.addressLine || "",
      tax_id: company?.taxId || "",
      registration_number: company?.registrationNumber || "",
      latitude: company?.latitude ?? undefined,
      longitude: company?.longitude ?? undefined,
      maps_url: "",
    })
  }, [open, company, form])

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const payload = {
        name: values.name || undefined,
        email: values.email || undefined,
        phone: values.phone || undefined,
        address_line: values.address_line || undefined,
        tax_id: values.tax_id || undefined,
        registration_number: values.registration_number || undefined,
        latitude: typeof values.latitude === "number" && Number.isFinite(values.latitude) ? values.latitude : undefined,
        longitude:
          typeof values.longitude === "number" && Number.isFinite(values.longitude) ? values.longitude : undefined,
      }
      return updateCompany(payload)
    },
    onSuccess: async () => {
      await onSaved()
      onOpenChange(false)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع"),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>تعديل معلومات الشركة</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company_name">اسم الشركة</Label>
              <Input id="company_name" {...form.register("name")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_email">البريد الإلكتروني</Label>
              <Input id="company_email" type="email" dir="ltr" {...form.register("email")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_phone">الهاتف</Label>
              <Input id="company_phone" dir="ltr" {...form.register("phone")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_address_line">العنوان التفصيلي</Label>
              <Input id="company_address_line" {...form.register("address_line")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_reg">رقم التسجيل</Label>
              <Input id="company_reg" dir="ltr" {...form.register("registration_number")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_tax">الرقم الضريبي</Label>
              <Input id="company_tax" dir="ltr" {...form.register("tax_id")} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="maps_url">رابط Google Maps (اختياري)</Label>
              <Input
                id="maps_url"
                dir="ltr"
                placeholder="https://maps.google.com/..."
                {...form.register("maps_url")}
              />
              <div className="text-xs text-muted-foreground">
                ألصق رابط موقع من Google Maps وسيتم استخراج الإحداثيات تلقائياً.
              </div>
            </div>

            <div className="sm:col-span-2 rounded-xl bg-muted/40 p-3 text-sm">
              <div className="font-medium">الإحداثيات الحالية</div>
              <div className="mt-1 text-muted-foreground" dir="ltr">
                {typeof currentLat === "number" && typeof currentLng === "number"
                  ? `${currentLat}, ${currentLng}`
                  : "Not set"}
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                disabled={locating}
                onClick={() => {
                  if (!navigator.geolocation) {
                    toast.error("المتصفح لا يدعم تحديد الموقع")
                    return
                  }
                  setLocating(true)
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      form.setValue("latitude", position.coords.latitude)
                      form.setValue("longitude", position.coords.longitude)
                      setLocating(false)
                      toast.success("تم تحديد موقعك الحالي")
                    },
                    () => {
                      setLocating(false)
                      toast.error("تعذر الحصول على موقعك الحالي")
                    },
                    { enableHighAccuracy: true, timeout: 10000 },
                  )
                }}
              >
                {locating ? "جاري تحديد الموقع..." : "استخدام موقعي الحالي"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const value = form.getValues("maps_url")
                  const parsed = parseCoordinatesFromGoogleMapsUrl(value || "")
                  if (!parsed) {
                    toast.error("الرابط لا يحتوي على إحداثيات واضحة")
                    return
                  }
                  form.setValue("latitude", parsed.lat)
                  form.setValue("longitude", parsed.lng)
                  toast.success("تم استخراج الإحداثيات من الرابط")
                }}
              >
                استخراج الإحداثيات من رابط Google Maps
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

