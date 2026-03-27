"use client"

import type { UseFormReturn } from "react-hook-form"
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { OfferFormValues } from "./offer-schema"

interface OfferDateFieldsProps {
  form: UseFormReturn<OfferFormValues>
}

export function OfferDateFields({ form }: OfferDateFieldsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>تاريخ البدء</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-start font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 opacity-60" />
                    {field.value
                      ? format(field.value, "PPP", { locale: ar })
                      : "اختر تاريخ البدء"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  locale={ar}
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0) // reset time to start of today
                    return date < today
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="end_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>
              تاريخ الانتهاء{" "}
              <span className="text-muted-foreground font-normal">
                (اختياري)
              </span>
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-start font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 opacity-60" />
                    {field.value
                      ? format(field.value, "PPP", { locale: ar })
                      : "اختر تاريخ الانتهاء"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  locale={ar}
                  disabled={(date) => {
                    const today = new Date()
                    today.setHours(0, 0, 0, 0) // reset time to start of today
                    return date < today
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
