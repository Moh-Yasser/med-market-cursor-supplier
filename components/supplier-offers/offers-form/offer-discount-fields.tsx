"use client"

import type { UseFormReturn } from "react-hook-form"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { OfferFormValues } from "./offer-schema"
import type { OfferType } from "@/types/offer"

interface OfferDiscountFieldsProps {
  form: UseFormReturn<OfferFormValues>
  offerType: OfferType | undefined
}

function QuantityAndDiscountFields({
  form,
  discountLabel,
  discountPlaceholder,
}: {
  form: UseFormReturn<OfferFormValues>
  discountLabel: string
  discountPlaceholder: string
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="quantity_required"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الكمية المطلوبة</FormLabel>
            <FormControl>
              <Input type="number" placeholder="1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="discount_value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{discountLabel}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={discountPlaceholder}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function BundleField({
  form,
  label,
  placeholder,
}: {
  form: UseFormReturn<OfferFormValues>
  label: string
  placeholder: string
}) {
  return (
    <FormField
      control={form.control}
      name="discount_value"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="number" placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function BuyXGetYFields({ form }: { form: UseFormReturn<OfferFormValues> }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="quantity_required"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الكمية المطلوبة</FormLabel>
            <FormControl>
              <Input type="number" placeholder="1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="quantity_free"
        render={({ field }) => (
          <FormItem>
            <FormLabel>الكمية المجانية</FormLabel>
            <FormControl>
              <Input type="number" placeholder="1" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

export function OfferDiscountFields({
  form,
  offerType,
}: OfferDiscountFieldsProps) {
  if (!offerType) return null

  switch (offerType) {
    case "fixed_discount":
      return (
        <QuantityAndDiscountFields
          form={form}
          discountLabel="قيمة الخصم"
          discountPlaceholder="10"
        />
      )

    case "percentage_discount":
      return (
        <QuantityAndDiscountFields
          form={form}
          discountLabel="نسبة الخصم (%)"
          discountPlaceholder="10"
        />
      )

    case "bundle_fixed":
      return (
        <BundleField
          form={form}
          label="قيمة ثابتة"
          placeholder="10 ل.س "
        />
      )

    case "bundle_percentage":
      return (
        <BundleField
          form={form}
          label="نسبة الخصم (%)"
          placeholder="10%"
        />
      )

    case "buy_x_get_y":
      return <BuyXGetYFields form={form} />
    default:
      return null
  }
}
