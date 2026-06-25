"use client"

import { UseFormReturn } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"
import {
    Package,
    Barcode,
    DollarSign,
    Boxes,
    Tag,
    Factory,
    FileText,
    Sparkles,
    TrendingUp,
    AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createProductSchema } from "./product-schema"
import { type SupplierClassifications } from "@/types/company"
import { CATEGORIES_KEYS } from "@/lib/categories/categories-keys"
import { MANUFACTURERS_KEYS } from "@/lib/manufacturers/manufacturers-keys"
import { getAllManufacturers } from "@/lib/manufacturers/manufacturers.client"
import { getAllCategories } from "@/lib/categories/categories.client"
import { useQuery } from "@tanstack/react-query"



const units = [
    { value: "piece", label: "قطعة" },
    { value: "box", label: "طرد" },

]


type FormValues = z.infer<typeof createProductSchema>

interface AddProductContentProps {
    form: UseFormReturn<FormValues>,
    onSubmit: (value: FormValues) => void,
    supplierClassification:SupplierClassifications,
}

export default function ProductForm({ form, onSubmit,supplierClassification }: AddProductContentProps) {

    const router = useRouter()
   
    const showWholesaleFields = supplierClassification === "wholesale" || supplierClassification === "hybrid"
    const showRetailFields = supplierClassification === "retail" || supplierClassification === "hybrid"



    const { formState: { isSubmitting, errors } } = form

    const { data: categories } = useQuery({
        queryKey: CATEGORIES_KEYS.all,
        queryFn: getAllCategories,
    })

    const { data: manufacturers } = useQuery({
        queryKey: MANUFACTURERS_KEYS.all,
        queryFn: getAllManufacturers,
    })


    return (
        <div className="container mx-auto px-4 py-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-8 lg:grid-cols-3">

                        <div className="space-y-6 lg:col-span-2">

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                            <Package className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle>المعلومات الأساسية</CardTitle>
                                            <CardDescription>
                                                أدخل التفاصيل الأساسية للمنتج
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>اسم المنتج</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="مثال: باراسيتامول 500 ملغ أقراص"
                                                        className="h-11"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    اسم واضح ووصفي للمنتج
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="barcode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Barcode className="h-4 w-4" />
                                                        الباركود
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="مثال: 6281234567890"
                                                            inputMode="numeric"
                                                            className="h-11 font-mono"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sku"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4" />
                                                        رمز التخزين
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="مثال: PAR-500-001"
                                                            className="h-11 font-mono"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    الوصف
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="أدخل وصفاً تفصيلياً للمنتج..."
                                                        className="min-h-24 resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                                            <Tag className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <CardTitle>التصنيف</CardTitle>
                                            <CardDescription>
                                                حدد الفئة والشركة المصنعة
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="category_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Tag className="h-4 w-4" />
                                                        الفئة
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 w-full" dir="rtl">
                                                                <SelectValue placeholder="اختر الفئة" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent dir='rtl'>
                                                            {categories?.data?.map((category) => (
                                                                <SelectItem
                                                                    key={category.id}
                                                                    value={String(category.id)}
                                                                >
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="manufacturer_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2">
                                                        <Factory className="h-4 w-4" />
                                                        الشركة المصنعة
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 w-full" dir="rtl">
                                                                <SelectValue placeholder="اختر الشركة المصنعة" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent dir="rtl">
                                                            {manufacturers?.data?.map((manufacturer) => (
                                                                <SelectItem
                                                                    key={manufacturer.id}
                                                                    value={String(manufacturer.id)}
                                                                >
                                                                    {manufacturer.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                            <DollarSign className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <CardTitle>التسعير</CardTitle>
                                            <CardDescription>
                                                حدد أسعار منتجك
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <Alert className="border-blue-200 bg-blue-50">
                                        <AlertCircle className="h-4 w-4 text-blue-600" />
                                        <AlertDescription className="text-blue-800">
                                            {supplierClassification === "wholesale" && "البيع بالجملة"}
                                            {supplierClassification === "retail" && "البيع بالمفرق"}
                                            {supplierClassification === "hybrid" && "البيع بالجملة و بالمفرق"}
                                        </AlertDescription>
                                    </Alert>



                                    {showWholesaleFields && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-4 w-4 text-blue-600" />
                                                <h4 className="font-medium text-blue-900">تسعير الجملة</h4>
                                            </div>
                                            <div className="grid gap-6 sm:grid-cols-2">
                                                <FormField
                                                    control={form.control}
                                                    name="wholesale_price"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>سعر الجملة</FormLabel>
                                                            <FormControl>
                                                                <div className="relative">
                                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                                        $
                                                                    </span>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        placeholder="0.00"
                                                                        className="h-11 pr-7"
                                                                        {...field}
                                                                        value={field.value ?? ""}
                                                                    />
                                                                </div>
                                                            </FormControl>
                                                            <FormDescription>
                                                                سعر المنتج بالجملة
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />


                                                <FormField
                                                    control={form.control}
                                                    name="wholesale_min_qty"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>الحد الأدنى للطلب</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="مثال: 100"
                                                                    className="h-11"
                                                                    {...field}
                                                                    value={field.value ?? ""}
                                                                />
                                                            </FormControl>
                                                            <FormDescription>
                                                                الحد الأدنى من الوحدات لسعر الجملة
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}


                                    {showWholesaleFields && <Separator />}

                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-blue-600" />
                                        <h4 className="font-medium text-blue-900">تسعير المفرق</h4>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="pharmacist_price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-2">
                                                    <Sparkles className="h-4 w-4" />
                                                    سعر المفرق
                                                    <Badge variant="secondary" className="mr-2">مطلوب</Badge>
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                            $
                                                        </span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            className="h-11 pr-7"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormDescription>
                                                    السعر الأساسي للصيادلة
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />



                                    {showRetailFields && (
                                        <div className="space-y-6">
                                            <FormField
                                                control={form.control}
                                                name="customer_price"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>سعر المستهلك</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                                    $
                                                                </span>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    placeholder="0.00"
                                                                    className="h-11 pr-7"
                                                                    {...field}
                                                                    value={field.value ?? ""}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormDescription>
                                                            السعر النهائي للعملاء
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                                            <Boxes className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <CardTitle>ادارة المخزون</CardTitle>
                                            <CardDescription>
                                                تتبع مستويات المخزون
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-6 sm:grid-cols-3">
                                        <FormField
                                            control={form.control}
                                            name="stock_quantity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>المخزون الحالي</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            className="h-11"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="min_stock_level"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel> تنبيه عند انخفاض المخزون </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="0"
                                                            className="h-11"
                                                            {...field}
                                                        />
                                                    </FormControl>

                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="unit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        نوع الوحدة
                                                    </FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}

                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 w-full" dir="rtl">
                                                                <SelectValue placeholder="اختر الوحدة" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent dir="rtl">
                                                            {units.map((unit) => (
                                                                <SelectItem key={unit.value} value={unit.value}>
                                                                    {unit.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="sticky top-28 self-start space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">حالة العرض</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        الحالة النشطة
                                                    </FormLabel>
                                                    <FormDescription>
                                                        {field.value
                                                            ? "المنتج مرئي للعملاء"
                                                            : "المنتج مخفي عن العملاء"}
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Spinner className="ml-2 h-4 w-4" />
                                                    جارٍ إنشاء المنتج...
                                                </>
                                            ) : (
                                                <>
                                                    <Package className="ml-2 h-4 w-4" />
                                                    إنشاء المنتج
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="lg"
                                            className="w-full"
                                            onClick={() => router.push("/products")}
                                        >
                                            إلغاء
                                        </Button>
                                    </div>

                                    {Object.keys(errors).length > 0 && (
                                        <Alert variant="destructive" className="mt-4">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                يرجى إصلاح الأخطاء أعلاه قبل الإرسال.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </div>

    )
}
