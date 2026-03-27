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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { OFFER_TYPE_OPTIONS } from "./offer-constants"
import type { OfferFormValues } from "./offer-schema"

interface OfferDetailsFieldsProps {
  form: UseFormReturn<OfferFormValues>
}

export function OfferDetailsFields({ form }: OfferDetailsFieldsProps) {
  return (
    <div className="grid gap-5">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>اسم العرض</FormLabel>
            <FormControl>
              <Input placeholder="مثال: تخفيضات الصيف" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              الوصف{" "}
              <span className="text-muted-foreground font-normal">
                (اختياري)
              </span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="أدخل وصفاً للعرض..."
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="offer_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>نوع العرض</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {OFFER_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
