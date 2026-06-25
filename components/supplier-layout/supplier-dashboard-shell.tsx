"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
  Users,
  Building2,
  X,
  Bell,
  Search,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { logoutAction } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { Supplier } from "@/types/company";
import { getCart } from "@/lib/cart/cart.client";
import { CART_KEYS } from "@/lib/cart/cart-keys";
import { Cart, CartApiResponse } from "@/types/orders_cart";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ProductSearchDialog } from "./product-search-dialog";

const navItems = [
  { title: "لوحة التحكم", icon: LayoutDashboard, href: "/dashboard" },
  { title: "المنتجات", icon: Package, href: "/products" },
  { title: "الطلبات", icon: ShoppingCart, href: "/orders" },
  { title: "العروض", icon: Tag, href: "/offers" },
  { title: "السائقين", icon: Users, href: "/drivers" },
  { title: "الموردين", icon: Building2, href: "/suppliers" },
  { title: "الإعدادات", icon: Settings, href: "/settings/profile" },
];

export function SupplierDashboardShell() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data } = useUser();

  const supplier: Supplier = data?.data.company ?? ({} as Supplier);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href || pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-6 pb-8 pt-6 text-center">
        <div className="mb-4 flex items-center justify-between xl:justify-center">
          <Link
            href="/dashboard"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground shadow-lg"
            onClick={() => setOpen(false)}
            aria-label={supplier?.name}
          >
            <Truck className="h-8 w-8" />
          </Link>

          <button
            type="button"
            className="rounded-full p-2 text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground xl:hidden"
            onClick={() => setOpen(false)}
            aria-label="إغلاق القائمة"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="text-lg font-bold text-sidebar-primary">
          {supplier?.name}
        </h2>
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all duration-200",
                active
                  ? "border-r-4 border-sidebar-primary bg-sidebar-primary/10 text-sidebar-primary shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-primary",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-sidebar-border px-4 py-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed right-0 top-0 z-50 hidden h-screen w-64 border-l border-sidebar-border bg-sidebar shadow-lg xl:block">
        {sidebar}
      </aside>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreground/45 xl:hidden"
          onClick={() => setOpen(false)}
          aria-label="إغلاق القائمة"
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-screen w-64 border-l border-sidebar-border bg-sidebar shadow-lg transition-transform duration-300 xl:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        {sidebar}
      </aside>

      <SupplierDashboardHeader setOpen={setOpen} />
    </>
  );
}

type HeaderProps = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function SupplierDashboardHeader({ setOpen }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: fetchedData } = useQuery<CartApiResponse>({
    queryKey: CART_KEYS.all,
    queryFn: getCart,
  });

  const cartData = fetchedData?.data ?? ({} as Cart);
  const groupCount = cartData.itemsBySupplier?.length ?? 0;

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSearchOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-border bg-card/95 backdrop-blur xl:mr-64 xl:w-[calc(100%-16rem)]">
        <div className="mx-auto flex h-16 max-w-8xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:justify-end">
          <Button
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 xl:hidden"
            size="icon"
            onClick={() => setOpen(true)}
            aria-label="فتح القائمة"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="ابحث عن منتج..."
                  className="h-10 w-[280px] rounded-full border-input bg-accent pr-10 text-right text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:ring-ring lg:w-[340px]"
                />
              </div>
            </form>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground hover:bg-accent hover:text-primary md:hidden"
              onClick={() => setSearchOpen(true)}
              aria-label="فتح البحث عن منتج"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full text-muted-foreground hover:bg-accent hover:text-primary"
                aria-label="السلة"
              >
                <ShoppingCart className="h-5 w-5" />

                {groupCount > 0 && (
                  <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
                    {groupCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/profile">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:bg-accent hover:text-primary"
                aria-label="الإشعارات"
              >
                <Bell className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <ProductSearchDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />
    </>
  );
}