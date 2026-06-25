"use client";

import Link from "next/link";
import { ArrowUpLeft, PackageSearch, Search, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

import { PRODUCTS_KEYS } from "@/lib/products/products-keys";
import { fetchMyProducts } from "@/lib/products/products.client";
import { Product, ProductsApiResponse } from "@/types/products";
import { ProductsFilters } from "@/types/filters";
import { useDebounce } from "@/hooks/use-debounce";

type ProductSearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (query: string) => void;
};

export function ProductSearchDialog({
  open,
  onOpenChange,
  query,
  onQueryChange,
}: ProductSearchDialogProps) {
  const debouncedQuery = useDebounce(query.trim(), 800);

  const filters: ProductsFilters = {
    search: debouncedQuery,
    paginate: false,
  };

  const {
    data: fetchedData,
    isFetching,
    isError,
  } = useQuery<ProductsApiResponse>({
    queryKey: PRODUCTS_KEYS.list(filters),
    queryFn: () => fetchMyProducts(filters),
    enabled: open && debouncedQuery.length >= 2,
  });

  const products = (fetchedData?.data ?? []) as Product[];

  function renderContent() {
    const search = query.trim();

    if (!search) {
      return <ProductSearchIdleState />;
    }

    if (isFetching) {
      return <ProductSearchSkeleton />;
    }

    if (isError) {
      return <ProductSearchErrorState />;
    }

    if (products.length === 0) {
      return <ProductSearchEmptyState query={debouncedQuery} />;
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">النتائج</p>
          <p className="text-xs text-muted-foreground">
            {products.length} منتج
          </p>
        </div>

        <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              onClick={() => onOpenChange(false)}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:bg-accent hover:shadow-lg"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <PackageSearch className="h-5 w-5" />
                </div>

                <div className="min-w-0 text-right">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {product.name}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {product.sku && <span>الكود: {product.sku}</span>}

                    {product.category?.name && (
                      <span>• {product.category.name}</span>
                    )}

                    {product.pharmacistPrice !== undefined &&
                      product.pharmacistPrice !== null && (
                        <span>• {product.pharmacistPrice}</span>
                      )}
                  </div>
                </div>
              </div>

              <ArrowUpLeft className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="overflow-hidden border-border bg-popover p-0 text-popover-foreground shadow-2xl sm:max-w-2xl"
      >
        <div className="border-b border-border bg-linear-to-l from-accent via-card to-background px-6 pb-5 pt-6">
          <DialogHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm">
                <PackageSearch className="h-5 w-5" />
              </div>

              <div className="text-right">
                <DialogTitle className="text-xl font-semibold text-foreground">
                  البحث عن منتج
                </DialogTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  ابحث بالاسم، الكود، أو التصنيف للوصول السريع للمنتجات.
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="مثال: بانادول، مضاد حيوي، SKU-102..."
              className="h-12 rounded-full border-input bg-card pr-11 text-right text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:ring-ring"
            />
          </div>
        </div>

        <div className="min-h-80 bg-background p-6">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
}

function ProductSearchIdleState() {
  return (
    <div className="flex h-70 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 text-center shadow-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        الرجاء إدخال اسم المنتج
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        اكتب حرفين على الأقل للبحث داخل المنتجات.
      </p>
    </div>
  );
}

function ProductSearchEmptyState({ query }: { query: string }) {
  return (
    <div className="flex h-70 flex-col items-center justify-center rounded-3xl border border-border bg-card px-6 text-center shadow-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <PackageSearch className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-semibold text-foreground">
        لا توجد منتجات مطابقة
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        لم نجد أي منتج يطابق البحث عن{" "}
        <span className="font-semibold text-primary">“{query}”</span>. جرّب
        اسمًا آخر أو كود المنتج.
      </p>
    </div>
  );
}

function ProductSearchErrorState() {
  return (
    <div className="flex h-70 flex-col items-center justify-center rounded-3xl border border-destructive/20 bg-card px-6 text-center shadow-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <PackageSearch className="h-7 w-7" />
      </div>

      <h3 className="text-lg font-semibold text-destructive">
        حدث خطأ أثناء تحميل النتائج
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        تأكد من اتصال الخادم أو من دالة جلب المنتجات ثم حاول مرة أخرى.
      </p>
    </div>
  );
}

function ProductSearchSkeleton() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>

      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
        >
          <Skeleton className="h-11 w-11 rounded-xl" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3 rounded-full" />
            <Skeleton className="h-3 w-1/2 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
