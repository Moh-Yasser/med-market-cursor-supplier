import { z } from "zod"

export const offerSchema = z
  .object({
    name: z.string().min(3, "اسم العرض يجب أن يكون 3 أحرف على الأقل"),

    description: z.string().optional(),

    offer_type: z.enum(
      [
        "fixed_discount",
        "percentage_discount",
        "bundle_fixed",
        "bundle_percentage",
        "buy_x_get_y",
      ],
      { required_error: "يرجى اختيار نوع العرض" }
    ),

    discount_value: z.string().optional(),
    quantity_required: z.string().optional(),
    quantity_free: z.string().optional(),

    start_date: z.date({ required_error: "تاريخ البدء مطلوب" }),
    end_date: z.date().optional(),

    // Always an array of product IDs (numbers), regardless of offer type
    product_ids: z.array(z.number()).default([]),

    // Only used for bundle offers: each selected product with its quantity
    products: z
      .array(
        z.object({
          product_id: z.number(),
          quantity: z.number().min(1, "الكمية يجب أن تكون أكبر من 0"),
        })
      )
      .default([]),
  })
  .superRefine((data, ctx) => {
    const needsDiscount =
      data.offer_type === "fixed_discount" ||
      data.offer_type === "percentage_discount"

    const needsBundleDiscount =
      data.offer_type === "bundle_fixed" ||
      data.offer_type === "bundle_percentage"

    const isBuyXGetY = data.offer_type === "buy_x_get_y"



    if (needsDiscount || needsBundleDiscount) {
      if (!data.discount_value || Number(data.discount_value) <= 0) {
        ctx.addIssue({
          path: ["discount_value"],
          code: z.ZodIssueCode.custom,
          message: "يرجى إدخال قيمة خصم صحيحة أكبر من 0",
        })
      }
    }



    if (isBuyXGetY) {
      if (!data.quantity_required || Number(data.quantity_required) <= 0) {
        ctx.addIssue({
          path: ["quantity_required"],
          code: z.ZodIssueCode.custom,
          message: "يرجى إدخال الكمية المطلوبة بشكل صحيح",
        })
      }

      if (!data.quantity_free || Number(data.quantity_free) <= 0) {
        ctx.addIssue({
          path: ["quantity_free"],
          code: z.ZodIssueCode.custom,
          message: "يرجى إدخال الكمية المجانية بشكل صحيح",
        })
      }
    }

    if (needsBundleDiscount) {
      if (!Array.isArray(data.product_ids) || data.product_ids.length === 0) {
        ctx.addIssue({
          path: ["product_ids"],
          code: z.ZodIssueCode.custom,
          message: "يرجى اختيار منتج واحد على الأقل",
        })
        return
      }

      if (!Array.isArray(data.products) || data.products.length === 0) {
        ctx.addIssue({
          path: ["products"],
          code: z.ZodIssueCode.custom,
          message: "يرجى إدخال الكميات لمنتجات الحزمة",
        })
        return
      }

      // Validate shape + ensure every selected product has quantity
      const quantitiesById = new Map<number, number>()
      data.products.forEach((item, index) => {
        if (!item || typeof item !== "object") {
          ctx.addIssue({
            path: ["products", index],
            code: z.ZodIssueCode.custom,
            message: "تنسيق المنتج غير صحيح",
          })
          return
        }

        quantitiesById.set(item.product_id, item.quantity)
      })

      data.product_ids.forEach((id, index) => {
        if (typeof id !== "number") {
          ctx.addIssue({
            path: ["product_ids", index],
            code: z.ZodIssueCode.custom,
            message: "معرف المنتج غير صالح",
          })
          return
        }

        const qty = quantitiesById.get(id)
        if (!qty || qty <= 0) {
          ctx.addIssue({
            path: ["products"],
            code: z.ZodIssueCode.custom,
            message: "يرجى إدخال كمية صحيحة لكل منتج تم اختياره",
          })
        }
      })
    }


    else {
      if (!Array.isArray(data.product_ids) || data.product_ids.length === 0) {
        ctx.addIssue({
          path: ["product_ids"],
          code: z.ZodIssueCode.custom,
          message: "يرجى اختيار منتج واحد على الأقل",
        })
        return
      }

      data.product_ids.forEach((id: any, index: number) => {
        if (typeof id !== "number") {
          ctx.addIssue({
            path: ["product_ids", index],
            code: z.ZodIssueCode.custom,
            message: "معرف المنتج غير صالح",
          })
        }
      })

      // Non-bundle offers must not send products with quantities
      if (Array.isArray(data.products) && data.products.length > 0) {
        ctx.addIssue({
          path: ["products"],
          code: z.ZodIssueCode.custom,
          message: "قائمة الكميات مخصصة لعروض الباندل فقط",
        })
      }
    }


    if (data.end_date && data.end_date <= data.start_date) {
      ctx.addIssue({
        path: ["end_date"],
        code: z.ZodIssueCode.custom,
        message: "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء",
      })
    }
  })

export type OfferFormValues = z.infer<typeof offerSchema>