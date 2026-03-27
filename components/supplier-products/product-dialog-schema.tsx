import { z } from "zod"

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "اسم المنتج يجب أن يكون 3 أحرف على الأقل")
    .max(255, "اسم المنتج طويل جدًا"),

  barcode: z
    .string()
    .trim()
    .min(8, "الباركود يجب أن يحتوي على 8 أرقام على الأقل")
    .max(14, "الباركود لا يجب أن يتجاوز 14 رقمًا")
    .regex(/^[0-9]+$/, "الباركود يجب أن يحتوي على أرقام فقط"),

  sku: z
    .string()
    .min(3, "رمز المنتج يجب أن يكون 3 أحرف على الأقل")
    .max(100, "رمز المنتج طويل جدًا"),

  pharmacist_price: z.coerce
    .number({
      invalid_type_error: "سعر الصيدلي يجب أن يكون رقمًا صالحًا",
    })
    .positive("سعر الصيدلي يجب أن يكون أكبر من صفر"),

  customer_price: z.coerce
    .number({
      invalid_type_error: "سعر العميل يجب أن يكون رقمًا صالحًا",
    })
    .positive("سعر العميل يجب أن يكون أكبر من صفر"),

  stock_quantity: z.coerce
    .number({
      invalid_type_error: "كمية المخزون يجب أن تكون رقمًا صحيحًا",
    })
    .int("كمية المخزون يجب أن تكون رقمًا صحيحًا")
    .min(0, "كمية المخزون لا يمكن أن تكون سالبة"),

  min_stock_level: z.coerce
    .number({
      invalid_type_error: "الحد الأدنى للمخزون يجب أن يكون رقمًا صحيحًا",
    })
    .int("الحد الأدنى للمخزون يجب أن يكون رقمًا صحيحًا")
    .min(0, "الحد الأدنى لا يمكن أن يكون سالبًا"),

  description: z
    .string()
    .max(1000, "الوصف طويل جدًا")
    .optional()
    .or(z.literal("")),

  category_id: z.string().min(1, "يجب اختيار الفئة"),

  manufacturer_id: z.string().min(1, "يجب اختيار الشركة المصنعة"),

  unit: z.string().default("piece"),

  is_active: z.boolean().default(true),
})