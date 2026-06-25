"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { z } from "zod"
import Link from "next/link"
import {
    ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"

import { createProductSchema } from "./product-schema"
import { useUser } from "@/hooks/use-user"
import { Supplier, SupplierApiResponse, type SupplierClassifications } from "@/types/company"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct } from "@/lib/products/products.client"
import { PRODUCTS_KEYS } from "@/lib/products/products-keys"
import ProductForm from "./product-form"
import { MeApiResponse } from "@/types/auth"


function getClassificationBadge(classification: SupplierClassifications) {

    const config = {
        wholesale: {
            label: "مورد جملة",
            className: "bg-blue-100 text-blue-700 border-blue-200",
        },
        retail: {
            label: "مورد مفرق",
            className: "bg-emerald-100 text-emerald-700 border-emerald-200",
        },
        hybrid: {
            label: "مورد جملة و مفرق",
            className: "bg-amber-100 text-amber-700 border-amber-200",
        },
    }

    return config[classification]
}

type FormValues = z.infer<typeof createProductSchema>

export default function AddProductContent() {
    const router = useRouter()
    const { data: userData, isLoading: userLoading } = useUser()
    const queryClient = useQueryClient()


    const supplierClassification = userData?.data.company?.supplierClassification || "hybrid"
    const classificationBadge = getClassificationBadge(supplierClassification)


    const form = useForm<FormValues>({
        resolver: zodResolver(createProductSchema),
        defaultValues: {
            name: "",
            barcode: "",
            sku: "",
            wholesale_min_qty: null,
            wholesale_price: null,
            pharmacist_price: 0,
            customer_price: null,
            stock_quantity: 0,
            min_stock_level: 0,
            description: "",
            category_id: "",
            manufacturer_id: "",
            unit: "piece",
            is_active: true,
        },
    })

      const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PRODUCTS_KEYS.all })
            form.reset()
        },
      })
    
    const handleSubmit = async (values: FormValues) => {

        const submitData = {
            ...values,
            category_id: Number(values.category_id),
            manufacturer_id: Number(values.manufacturer_id),

            ...(supplierClassification === "retail" && {
                wholesale_price: null,
                wholesale_min_qty: null,
            }),
            ...(supplierClassification === "wholesale" && {
                customer_price: null,
            }),
        }

        mutation.mutate(submitData)

        router.push("/products")
    }

    if (userLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-8 w-8" />
                    <p className="text-muted-foreground">"جارٍ التحميل...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30">

            <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" asChild>
                                <Link href="/products">
                                    <ArrowRight className="h-5 w-5" />
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">إضافة منتج جديد</h1>
                                <p className="text-sm text-muted-foreground">
                                    املأ التفاصيل لإضافة منتج جديد إلى المخزون
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className={classificationBadge.className}>
                                {classificationBadge.label}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

     <ProductForm form={form} onSubmit={handleSubmit} supplierClassification={supplierClassification}/>
            
        </div>
    )
}
