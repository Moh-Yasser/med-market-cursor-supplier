"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

import { createProductSchema } from "./product-dialog-schema"
import { productsKeys } from "@/lib/products/products-keys"
import { updateProduct } from "@/lib/products/products.client"
import { getAllCategories } from "@/lib/categories/categories.client"
import { getAllManufacturers } from "@/lib/manufacturers/manufacturers.client"
import { CATEGORIES_KEYS } from "@/lib/categories/categories-keys"
import { MANUFACTURERS_KEYS } from "@/lib/manufacturers/manufacturers-keys"
import type { Product } from "@/types/products"

type Props = {
  product: Product | null
  onClose: () => void
}

type FormValues = z.infer<typeof createProductSchema>

export function ProductEditDialog({ product, onClose }: Props) {
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      barcode: "",
      sku: "",
      pharmacist_price: 0,
      customer_price: 0,
      stock_quantity: 0,
      min_stock_level: 0,
      description: "",
      category_id: "",
      manufacturer_id: "",
      unit: "piece",
      is_active: true,
    },
  })

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name ?? "",
        barcode: product.barcode ?? "",
        sku: product.sku ?? "",
        pharmacist_price: product.pharmacistPrice,
        customer_price: product.customerPrice,
        stock_quantity: product.stockQuantity,
        min_stock_level: product.minStockLevel,
        description: product.description ?? "",
        category_id: product.category ? String(product.category.id) : "",
        manufacturer_id: product.manufacturer ? String(product.manufacturer.id) : "",
        unit: product.unit ?? "piece",
        is_active: product.isActive,
      })
    }
  }, [product, form])

  const { data: categoriesData } = useQuery({
    queryKey: CATEGORIES_KEYS.all,
    queryFn: getAllCategories,
  })

  const { data: manufacturersData } = useQuery({
    queryKey: MANUFACTURERS_KEYS.all,
    queryFn: getAllManufacturers,
  })

  const mutation = useMutation({
    mutationFn: (body: Record<string, unknown>) =>
      updateProduct(product!.id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.all })
      onClose()
    },
  })

  const onSubmit = (values: FormValues) => {
    if (!product) return

    mutation.mutate({
      ...values,
      category_id: Number(values.category_id),
      manufacturer_id: Number(values.manufacturer_id),
    })
  }

  return (
    <Dialog
      open={!!product}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>تعديل المنتج</DialogTitle>
          <DialogDescription>تحديث تفاصيل المنتج.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المنتج</FormLabel>
                  <FormControl>
                    <Input placeholder="اسم المنتج" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="barcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الباركود</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="مثال: 6281234567890"
                        inputMode="numeric"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز المنتج</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: PAR-500-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pharmacist_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سعر الصيدلي</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سعر العميل</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفئة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختيار الفئة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoriesData?.data?.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={String(category.id)}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manufacturer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الشركة المصنعة</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختيار الشركة المصنعة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {manufacturersData?.data?.map((manufacturer) => (
                          <SelectItem
                            key={manufacturer.id}
                            value={String(manufacturer.id)}
                          >
                            {manufacturer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كمية المخزون</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_stock_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الحد الأدنى للمخزون</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg px-3 py-2">
                  <FormLabel className="space-y-0">
                    <p className="text-muted-foreground ">
                      {field.value ? "نشط" : "غير نشط"}
                    </p>
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Input placeholder="وصف المنتج..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {mutation.isError && (
              <p className="text-sm text-destructive">
                فشل في تحديث المنتج. يرجى المحاولة مرة أخرى.
              </p>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={mutation.isPending}
              >
                إلغاء
              </Button>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "جاري التحديث..." : "تحديث المنتج"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
