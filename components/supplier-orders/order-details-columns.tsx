"use client"

import { Column } from "@/components/table/data-table";
import { PriceCode } from "../supplier-products/product-price";
import { CartItem } from "@/types/orders_cart";


export function createOrderProductsColumns(): Column<CartItem>[] {
  return [
    {
      key: "name",
      label: "اسم المنتج",
      className: "text-right",
      render: (item) => <span className="font-medium">{item.product.name}</span>,
    },
    {
      key: "category",
      label: "الصنف",
      className: "text-right",
      render: (item) => (
        <span className="text-muted-foreground">{item.product.category.name}</span>
      ),
    },
    {
      key: "quantity",
      label: "الكمية",   
      render: (item) => (
        <span className="text-muted-foreground">{item.quantity}</span>
      ),
    },
    {
      key: "appliedOffer",
      label: "العرض المطبق",
      render: (item) => (
        <span className="text-muted-foreground">-</span>
      ),
    },
    {
      key: "unitPrice",
      label: "سعر الواحدة",
      sortable: true,
      render: (item) => (
        <span className="text-muted-foreground"> {item.unitPrice} <PriceCode /> </span>
      ),
    },
    {
      key: "totalPrice",
      label: "السعر الإجمالي",
      sortable: true,
      render: (item) => (
        <span className="text-muted-foreground"> {item.totalPrice} <PriceCode /> </span>
      ),
    },

  ];
}
