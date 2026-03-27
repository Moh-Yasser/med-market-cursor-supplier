"use client"

import { useMemo, useState,useEffect } from "react"
import type { OfferType } from "@/types/offer"
import type { Product } from "@/types/products"
import { DataTable } from "@/components/table/data-table"
import { getProductColumns } from "@/components/supplier-offers/offers-form/products-columns"
import { Package, ShoppingBag } from "lucide-react"
import { productsKeys } from "@/lib/products/products-keys"
import { fetchSupplierProducts } from "@/lib/products/products.client"
import { ProductSearch } from "@/components/supplier-products/products-search"
import { useSearchParams } from "next/navigation"
import { ProductsFilters } from "@/types/filters"

export function useProductsFiltersFromURL(): ProductsFilters {
  const searchParams = useSearchParams();

  return useMemo<ProductsFilters>(() => {
    return {
      search: searchParams.get("search") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      manufacturer_id: searchParams.get("manufacturer_id") || undefined,
      is_active:searchParams.get("is_active") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      per_page: parseInt(searchParams.get("per_page") || "15", 10),
    };
  }, [searchParams]);
}

interface ProductSelectionTableProps {
  offerType: OfferType | undefined
  selectedIds: number[]
  onSelectionChange: (productIds: number[]) => void
  onProductsChange: (products: { product_id: number; quantity: number }[]) => void
}

export function ProductSelectionTable({
  offerType,
  selectedIds,
  onSelectionChange,
  onProductsChange,
}: ProductSelectionTableProps) {
  const filters = useProductsFiltersFromURL();
  const queryKey = useMemo(() => productsKeys.list(filters), [filters]);

  const queryFn = useMemo(() => () => fetchSupplierProducts(filters), [filters]);
 const [products, setProducts] = useState<
  { product_id: number; quantity: number }[]
>([])
  const [selectedSet, setSelectedSet] = useState<Set<number>>(
    () => new Set(selectedIds)
  )

  const handleToggle = (id: number) => {
    setSelectedSet((prev) => {
      const next = new Set(prev)
      const isSelected = next.has(id)
  
      if (isSelected) {
        next.delete(id)
        setProducts((prevProducts) =>
          prevProducts.filter((p) => p.product_id !== id)
        )
      } else {
        next.add(id)
        setProducts((prevProducts) => [
          ...prevProducts,
          { product_id: id, quantity: 10 },
        ])
      }
  
      return next
    })
  }
  
  const onUpdateQuantity = (id : number, quantity : number) => {
    if(quantity<1){
      setSelectedSet((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setProducts((prevProducts ) => prevProducts.filter((p) => p.product_id !== id))
      return
    }
    setProducts((prevProducts ) => {
        return prevProducts.map((product) =>
          product.product_id === id ? { ...product, quantity } : product  )  
    });
  };

  const onIncreaseProductQuantity = (id : number) => {
    setProducts((prevProducts ) => {
        return prevProducts.map((product) =>
          product.product_id === id ? { ...product,quantity : product.quantity + 1 } : product  )  
    });
  };

  const onDecreaseProductQuantity = (id: number) => {
    setProducts((prevProducts) => {
      const product = prevProducts.find((p) => p.product_id === id)
      if (!product) return prevProducts 
      const newQuantity = product.quantity - 1
      if (newQuantity <= 0) {
        setSelectedSet((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
  
        return prevProducts.filter((p) => p.product_id !== id)
      }
      return prevProducts.map((p) =>
        p.product_id === id ? { ...p, quantity: newQuantity } : p
      )
    })
  }

  useEffect(() => {
    const ids = Array.from(selectedSet)
    onSelectionChange(ids)

    if (offerType === "bundle_fixed" || offerType === "bundle_percentage") {
      onProductsChange(products)
    } else {
      onProductsChange([])
    }
  }, [selectedSet, products, offerType, onSelectionChange, onProductsChange])

  const columns = useMemo(
    () => getProductColumns(offerType, onUpdateQuantity ,onDecreaseProductQuantity, onIncreaseProductQuantity, selectedSet,products, handleToggle),
    [selectedSet,products, handleToggle, offerType]
  )

  const isBundle =
    offerType === "bundle_fixed" || offerType === "bundle_percentage"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        {isBundle ? (
          <Package className="size-5 text-primary" />
        ) : (
          <ShoppingBag className="size-5 text-primary" />
        )}
        <div>
          <p className="text-sm font-medium text-foreground">
            {isBundle ? "اختر منتجات الحزمة" : "اختر المنتجات المشمولة بالعرض"}
          </p>
          {selectedSet.size > 0 && (
            <p className="text-xs text-muted-foreground">
              تم اختيار {selectedSet.size} منتج
            </p>
          )}
        </div>
      </div>
      <ProductSearch />
      <DataTable<Product>
        columns={columns}
        queryKey={queryKey}
        queryFn={queryFn}
        emptyMessage="لم يتم العثور على منتجات"
      />
    </div>
  )
}
