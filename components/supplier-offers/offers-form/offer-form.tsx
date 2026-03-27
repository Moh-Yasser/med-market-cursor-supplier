"use client"

import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Save,
  Tag,
  BadgePercent,
  CalendarRange,
  Package,
} from "lucide-react"
import { useMutation } from "@tanstack/react-query"

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { OfferDetailsFields } from "@/components/supplier-offers/offers-form/offer-details-fields"
import { OfferDiscountFields } from "@/components/supplier-offers/offers-form/offer-discount-fields"
import { OfferDateFields } from "@/components/supplier-offers/offers-form/offer-date-fields"
import { ProductSelectionTable } from "@/components/supplier-offers/offers-form/product-selected-table"

import { offerSchema, type OfferFormValues } from "./offer-schema"
import type {
  createBundleOfferType,
  createOfferType,
  OfferType,
} from "@/types/offer"

import { createOffer, updateOffer } from "@/lib/offers/offers.client"
import { useRouter } from "next/navigation"

type OfferFormProps = {
  mode: "create" | "edit"
  offerId?: number
  initialData?: OfferFormValues
}

export function OfferForm({
  mode,
  offerId,
  initialData,
}: OfferFormProps) {
  const router = useRouter()
  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues:
      initialData ?? {
        name: "",
        description: "",
        product_ids: [],
        products: [],
        discount_value: "",
        quantity_required: "",
        quantity_free: "",
        start_date: new Date(),
        end_date: undefined,
      },
  })

  const mutation = useMutation({
    mutationFn: (payload: createBundleOfferType | createOfferType) => {
      return mode === "create"
        ? createOffer(payload)
        : updateOffer({id : offerId!, payload})
    },
    onSuccess: () => {
      router.push("/offers")
    },
    onError: (error) => {
      console.error("Error:", error)
    },
  })

  const offerType = form.watch("offer_type") as OfferType | undefined
  const selectedProducts = form.watch("product_ids")
 

  const handleProductIdsChange = useCallback(
    (productIds: number[]) => {
      form.setValue("product_ids", productIds, { shouldValidate: true })
    },
    [form]
  )

  const handleBundleProductsChange = useCallback(
    (products: { product_id: number; quantity: number }[]) => {
      form.setValue("products", products, { shouldValidate: true })
    },
    [form]
  )

  const onSubmit = (values: OfferFormValues) => {
    const isBundle =
      values.offer_type === "bundle_fixed" ||
      values.offer_type === "bundle_percentage"

    const basePayload = {
      name: values.name,
      description: values.description || undefined,
      offer_type: values.offer_type as OfferType,
      discount_value: values.discount_value
        ? parseFloat(values.discount_value)
        : undefined,
      quantity_required: values.quantity_required
        ? parseInt(values.quantity_required)
        : undefined,
      quantity_free: values.quantity_free
        ? parseInt(values.quantity_free)
        : undefined,
      start_date: values.start_date.toISOString(),
      end_date: values.end_date?.toISOString(),
      is_active: true,
    }

    const payload: createBundleOfferType | createOfferType = isBundle
      ? {
          ...basePayload,
          product_ids: values.product_ids,
          products: values.products,
        }
      : {
          ...basePayload,
          product_ids: values.product_ids,
        }

    mutation.mutate(payload)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6"
      >
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Tag className="h-4 w-4 text-primary" />
              </div>
              <div className="grid gap-0.5">
                <CardTitle className="text-base">
                  تفاصيل العرض
                </CardTitle>
                <CardDescription>
                  أدخل الاسم والوصف ونوع العرض الترويجي.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5">
            <OfferDetailsFields form={form} />
          </CardContent>
        </Card>

        {offerType && (
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal/15">
                  <BadgePercent className="h-4 w-4 text-teal-dark" />
                </div>
                <div className="grid gap-0.5">
                  <CardTitle className="text-base">
                    قيم الخصم والكميات
                  </CardTitle>
                  <CardDescription>
                    حدد القيم المطلوبة بناءً على نوع العرض المختار.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <OfferDiscountFields
                form={form}
                offerType={offerType}
              />
            </CardContent>
          </Card>
        )}

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <CalendarRange className="h-4 w-4 text-primary" />
              </div>
              <div className="grid gap-0.5">
                <CardTitle className="text-base">
                  مدة العرض
                </CardTitle>
                <CardDescription>
                  حدد تاريخ بدء وانتهاء العرض.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <OfferDateFields form={form} />
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-1">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal/15">
                <Package className="h-4 w-4 text-teal-dark" />
              </div>
              <CardTitle className="text-base">
                المنتجات
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ProductSelectionTable
              selectedIds={selectedProducts}
              onSelectionChange={handleProductIdsChange}
              onProductsChange={handleBundleProductsChange}
              offerType={offerType}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end pt-2 pb-10">
          <Button
            type="submit"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer"
            disabled={mutation.isPending}
          >
            <Save className="h-4 w-4" />
            {mutation.isPending
              ? mode === "create"
                ? "جاري الإنشاء..."
                : "جاري التحديث..."
              : mode === "create"
              ? "إنشاء العرض"
              : "تحديث العرض"}
          </Button>
        </div>
      </form>
    </Form>
  )
}