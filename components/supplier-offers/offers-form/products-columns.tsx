"use client"
import { Checkbox } from "@/components/ui/checkbox"
import type { Column } from "@/components/table/data-table"
import type { Product } from "@/types/products"
import ProductPrice, { PriceCode } from "@/components/product-price"
import { OfferType } from "@/types/offer"
import { BundleQuantity } from "./bundle-quantity"


export function getProductColumns(
  offerType:OfferType| undefined,
  onUpdateQuantity: (productId: number, newQuantity: number) => void,
  onDecreaseProductQuantity: (productId: number) => void,
  onIncreaseProductQuantity: (productId: number) => void,
  selectedIds: Set<number>,
  products:{product_id:number,quantity:number}[],
  onToggle: (id: number) => void
): Column<Product>[] {
  const columns: Column<Product>[]= [
    {
      key: "select",
      label: "",
      className: "w-12",
      render: (item) => (
        <Checkbox
          checked={selectedIds.has(item.id)}
          onCheckedChange={() => onToggle(item.id)}
          aria-label={`اختيار ${item.name}`}
        />
      ),
    },
   {
      key: "name",
      label: "اسم المنتج",
      className: "text-right",
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: "customerPrice",
      label: "سعر العميل",
      sortable: true,
      render: (item) => (
        <span className="tabular-nums flex items-center justify-center gap-1">
          {item.customerPrice.toFixed(0)} <PriceCode />
        </span>
      ),
    },
    {
      key: "pharmacistPrice",
      label: "سعر الصيدلي",
      sortable: true,
      render: (item) => <ProductPrice product={item} />,
    },
  ];

  if ( offerType === "bundle_fixed"|| offerType === "bundle_percentage" ) {
    columns.push({
      key: "bundleQuantity",
      label: "الكمية",
      className: "text-center",
      render: (item) => {
        const quantityItem = products.find(p => p.product_id === item.id)
        const quantity = quantityItem?.quantity ?? 0
      return <BundleQuantity  productId={item.id} quantity={quantity}  updateQuantity={onUpdateQuantity} isSelected={selectedIds.has(item.id)} handleDecreaseQuantity={onDecreaseProductQuantity} handleIncreaseQuantity={onIncreaseProductQuantity} />}
    });
  }
  return columns;
}
