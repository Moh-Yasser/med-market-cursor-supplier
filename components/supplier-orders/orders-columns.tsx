"use client"

import { Product } from "@/types/products";
import { Column } from "@/components/table/data-table";
import { Badge } from "../ui/badge";
import { PriceCode } from "../supplier-products/product-price";
import { Order } from "@/types/orders_cart";
import { OrderActions } from "./Order-actions";

const statusStyles: Record<string, string> = {
    delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    accepted: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    prepared: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
}
const statusLabels: Record<string, string> = {
    pending: "قيد الانتظار",
    accepted: "تمت الموافقة",
    shipped: "تم الشحن",
    delivered: "تم التسليم",
    cancelled: "ملغي",
}


export function createOrderColumns(setInvoiceOrder: (id: number) => void): Column<Order>[] {
    return [
        {
            key: "orderId",
            label: "رقم الطلب",
            className: "text-right",
            render: (item) => <span className="font-medium">{item.orderNumber}</span>,
        },
        {
            key: "buyer",
            label: "المشتري",
            render: (item) => (
                <span className="text-muted-foreground">
                    {item.buyerCompany.name}
                </span>
            ),
        },
        {
            key: "status",
            label: "الحالة",
            sortable: true,
            render: (item) => (<Badge className={statusStyles[item.status] || statusStyles.pending}>
                {statusLabels[item.status]}
            </Badge>)
        },
        {
            key: "productsQuantity",
            label: "العناصر",
            render: (item) => (

                <span className="text-muted-foreground">
                    {item.items.reduce((total, product) => total + product.quantity, 0)}
                </span>
            ),
        },
        {
            key: "date",
            label: "التاريخ",
            sortable: true,
            render: (item) => (
                <span className="tabular-nums flex items-center justify-center gap-1">
                    {new Date(item.createdAt).toLocaleDateString("ar")}
                </span>
            ),
        },
        {
            key: "totalAmount",
            label: "المبلغ",
            sortable: true,
            render: (item) => <span className="tabular-nums flex items-center justify-center gap-1">
                {Number(item.totalAmount).toFixed(0)} <PriceCode />
            </span>,
        },

        {
            key: "actions",
            label: "الاجراءات",
            render: (item) => (
                < OrderActions order={item} showInvoiceOrder={setInvoiceOrder} />
            ),
        },
    ];
}
