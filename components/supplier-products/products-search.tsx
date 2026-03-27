"use client";

import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductsFilters } from "@/types/filters";
import { createQueryString } from "@/lib/api/queryString";
import { CATEGORIES_KEYS } from "@/lib/categories/categories-keys";
import { getAllCategories } from "@/lib/categories/categories.client";
import { MANUFACTURERS_KEYS } from "@/lib/manufacturers/manufacturers-keys";
import { getAllManufacturers } from "@/lib/manufacturers/manufacturers.client";



function getFiltersFromParams(params: URLSearchParams): ProductsFilters {
  return {
    search: params.get("search") || "",
    category_id: params.get("category_id") || "",
    manufacturer_id: params.get("manufacturer_id") || "",
    is_active:  params.get("is_active") || "",
    page: parseInt(params.get("page") || "1", 10) ,
    per_page: parseInt(params.get("per_page") || "15", 10) ,
  };
}



export function ProductSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [filters, setFilters] = useState<ProductsFilters>(() => getFiltersFromParams(searchParams));

  const { data: categoriesData } = useQuery({
    queryKey: CATEGORIES_KEYS.all,
    queryFn: getAllCategories,
  });
  const { data: manufacturersData } = useQuery({
    queryKey: MANUFACTURERS_KEYS.all,
    queryFn: getAllManufacturers,
  });
  

  const queryString = createQueryString<ProductsFilters>(filters);
  const debouncedQuery = useDebounce(queryString, 800);
  const [isOpen,setIsOpen]=useState<boolean>(false);  
  const lastSyncedRef = useRef(debouncedQuery);
      
  useEffect(() => {
    if (debouncedQuery !== lastSyncedRef.current) {
      lastSyncedRef.current = debouncedQuery;
      replace(`${pathname}${debouncedQuery ? `?${debouncedQuery}` : ""}`, { scroll: false });
    }
  }, [debouncedQuery, pathname, replace]);

  const hasActiveFilters =
  filters.search !== "" ||
  (filters.category_id !== "all" && filters.category_id !== "") ||
  (filters.manufacturer_id !== "all" && filters.manufacturer_id !== "") ||
  (filters.is_active !== "--" && filters.is_active !== "") ;
 
  const activeFiltersCount = [
    filters.search,
    (filters.category_id !== "all" && filters.category_id !== "") ? filters.category_id : null,
    (filters.manufacturer_id !== "all" && filters.manufacturer_id !== "") ? filters.manufacturer_id : null, 
    (filters.is_active !== "--" && filters.is_active !== "")?filters.is_active:null,
  ].filter(Boolean).length;

  const onFilterChange = (key: keyof ProductsFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

 
    const onClearFilters = () => {
      setFilters({
        category_id: "",
        manufacturer_id: "",
        is_active:"",
        search: "",
      });
    };
  

  return (
    <div className="space-y-4">
     
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
       
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="ابحث عن المنتجات..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="pr-9"
            aria-label="البحث عن المنتجات"
          />
        </div>

        
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen((prev)=>!prev)}
          className="gap-2"
          aria-expanded={hasActiveFilters}
          aria-controls="filters-panel"
        >
          <Filter className="h-4 w-4" aria-hidden="true" />
          <span>تصفية</span>
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="mr-1 h-5 min-w-5 rounded-full p-0 text-xs"
              aria-label={`${activeFiltersCount} فلاتر نشطة`}
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

       
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
            aria-label="مسح جميع الفلاتر"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>مسح</span>
          </Button>
        )}
      </div>

      
      {isOpen && (
      <div
        id="filters-panel"
        className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-4"
      >
       
        <Select
          value={filters.category_id}
          onValueChange={(value) => onFilterChange("category_id", value)}
        >
          <SelectTrigger className="w-full sm:w-[190px]" aria-label="تصفية حسب الفئة">
            <SelectValue placeholder="جميع الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categoriesData?.data?.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.manufacturer_id  }
          onValueChange={(value) => onFilterChange("manufacturer_id", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="تصفية حسب الشركة المصنعة">
            <SelectValue placeholder="جميع الشركات المصنعة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الشركات المصنعة</SelectItem>
            {manufacturersData?.data?.map((manufacturer) => (
              <SelectItem key={manufacturer.id} value={String(manufacturer.id)}>
                {manufacturer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        

        <Select
          value={filters.is_active}
          onValueChange={(value) => onFilterChange("is_active", value)}
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="الحالة">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="--">النشط و الغير نشط</SelectItem>
              <SelectItem key="true" value="true">
               نشط
              </SelectItem>
              <SelectItem key="false" value="false">
              غير نشط
              </SelectItem>
          </SelectContent>
        </Select>
  
      </div>
      )}
    </div>
  );
}
