"use client";

import { Package, Tag, FileText, Pencil, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { fetchProductDetail } from "@/lib/products/products.client";
import { PRODUCTS_KEYS } from "@/lib/products/products-keys";
import { Product, ProductDetailResponse } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { useUser } from "@/hooks/use-user";

export default function ProductDetailsPage({
  productId,
}: {
  productId: string;
}) {
  const { data: userData, isLoading: userLoading } = useUser();

  const {
    data,
    isLoading: productLoading,
  } = useQuery<ProductDetailResponse>({
    queryKey: PRODUCTS_KEYS.detail(productId),
    queryFn: () => fetchProductDetail(productId),
  });
  const supplierClassification =
    userData?.data.company?.supplierClassification || "hybrid";
  const product = data?.data ?? ({} as Product);

  if (userLoading || productLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8" />
          <p className="text-muted-foreground">"جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">تفاصيل المنتج</h1>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Pencil className="ml-2 h-4 w-4" />
              تعديل
            </Button>

            <Button size="sm">
              <ArrowLeft className="ml-2 h-4 w-4" />
              إنهاء الطلب
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-xl font-bold">{product.name}</h2>

                  <Badge variant="secondary">نشط</Badge>
                </div>

                <p className="mb-6 text-sm text-muted-foreground">
                  {product.description}
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <div className="mb-1  font-medium">الشركة المصنعة</div>

                    <div className="text-xs text-muted-foreground">
                      {product.manufacturer.name}
                    </div>
                  </div>

                  <div>
                    <div className="mb-1  font-medium">الفئة الدوائية</div>

                    <div className="text-xs text-muted-foreground">
                      {product.category.name}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-md bg-blue-100 p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold">آخر عرض متاح</h3>

                      <Badge>خصم 15%</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      شراء 1000 وحدة أو أكثر بسعر مخفض. العرض صالح حتى نهاية
                      الشهر.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-50">
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-1 text-sm text-muted-foreground">
                    الكمية المتوفرة
                  </div>

                  <div className="text-3xl font-bold text-blue-600">
                    {product.stockQuantity}
                  </div>
                </div>
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600 flex justify-between">
                  التنبيه ببدأ نفاذ المخزون عند
                  <span>{product.minStockLevel}</span>
                </div>
                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">رقم المنتج</span>
                    <span>{product.barcode}</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU</span>
                    <span>{product.sku}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold">قائمة الأسعار</h3>
                </div>

                <div className="space-y-3 text-sm">
                  {(supplierClassification === "wholesale" ||
                    supplierClassification === "hybrid") && (
                    <div className="flex justify-between">
                      <span>سعر الجملة</span>
                      <span>{product.wholesale_price}</span>
                    </div>
                  )}

                  {supplierClassification === "retail" ||
                    (supplierClassification === "hybrid" && (
                      <div className="flex justify-between">
                        <span>سعر المفرق</span>
                        <span>{product.pharmacistPrice}</span>
                      </div>
                    ))}

                  <div className="flex justify-between">
                    <span>سعر المستهلك</span>
                    <span>{product.customerPrice}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-md bg-slate-100 p-2 text-center text-xs text-muted-foreground">
                  آخر تحديث للأسعار
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
