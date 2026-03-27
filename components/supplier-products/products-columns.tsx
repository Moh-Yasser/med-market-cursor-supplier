"use client"

import { Product } from "@/types/products";
import { Column } from "@/components/table/data-table";
import ProductPrice, { PriceCode } from "./product-price";
import { Badge } from "../ui/badge";
import { ProductsActions } from "./products-actions";

export function createProductsColumns(onEdit: (product: Product) => void): Column<Product>[] {
  return [
    {
      key: "name",
      label: "اسم المنتج",
      className: "text-right",
      render: (item) => <span className="font-medium">{item.name}</span>,
    },
    {
      key: "category",
      label: "الصنف",
      className: "text-right",
      render: (item) => (
        <span className="text-muted-foreground">{item.category.name}</span>
      ),
    },
    {
      key: "manufacturer",
      label: "الشركة المصنعة",
      render: (item) => (
        <span className="text-muted-foreground">
          {item.manufacturer.name}
        </span>
      ),
    },
    {
      key: "customerPrice",
      label: "سعر الزبون",
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
    {
      key: "status",
      label: "الحالة",
      sortable: true,
      render: (item) => (<Badge variant={item.isActive ? "default" : "secondary"}>
        {item.isActive ? "نشط" : "غير نشط"}
      </Badge>)
    },
    {
      key: "actions",
      label: "الإجراءات",
      render: (item) => (
        <ProductsActions product={item} onEdit={() => onEdit(item)} />
      ),
    },
  ];
}
