import type { OfferType } from "@/types/offer"

export const OFFER_TYPE_LABELS: Record<OfferType, string> = {
  percentage_discount: "خصم بنسبة مئوية",
  fixed_discount: "خصم بقيمة ثابتة",
  bundle_fixed: "باقة بخصم ثابتة",
  bundle_percentage: "باقة بخصم نسبي",
  buy_x_get_y: "هدية",
}

export const OFFER_TYPE_OPTIONS = Object.entries(OFFER_TYPE_LABELS).map(
  ([value, label]) => ({ value: value as OfferType, label })
)
