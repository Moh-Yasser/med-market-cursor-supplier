import { Column } from "@/components/table/data-table";
  import { CartItem } from "@/types/orders_cart";
import { TrashButton } from "./trash-button";
import OfferButton from "../otherSuppliers/supplier-products/products-offer/offer-button";
import { CartActions } from "./cart-actions";
import { PriceCode } from "../product-price";

const CartColumns: Column<CartItem>[] = [
  {
    key: "name",
    label: "اسم المنتج",
    className: "text-right",
    render: (item) => <span className="font-medium">{item.product.name}</span>,
  },
  {
    key: "customerPrice",
    label: "سعر الزبون",
    render: (item) => (
      <span className="tabular-nums flex items-center justify-center gap-1">
        {item.product.customerPrice} <PriceCode />
      </span>
    ),
  },
  {
    key: "unitPrice",
    label: "سعر الوحدة",

    render: (item) => <span >
      {item.product.pharmacistPrice} <PriceCode />
    </span>,
  },
  {
    key: "offer",
    label: " العرض",
    render: (item) =>
      <OfferButton product={item} />
  },
  {
    key: "totalPrice",
    label: "السعر الكلي",
    render: (item) => (
      <span className="text-lg ">
        {item.totalPrice.toFixed(0)} <PriceCode />
      </span>
    ),
  },
  {
    key: "quantity",
    label: "الكمية",
    render: (item) => <CartActions product={item} />,
  },
  {
    key: "actions",
    label:"",
    render: (item) => <TrashButton product={item}/>
  },
]
const status = {
  applied: "bg-green-500/10 text-green-500",
  notActive: "bg-red-50 text-red-700",
  notApplied: "bg-primary/10 text-primary",
}

export default CartColumns;