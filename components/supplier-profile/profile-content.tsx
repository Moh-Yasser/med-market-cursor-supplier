"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Pencil, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { fetchProfile } from "@/lib/profile/profile.client"
import { profileKeys } from "@/lib/profile/profile-keys"
import { EditCompanyDialog } from "./profile-edit-company-dialog"
import { EditUserDialog } from "./profile-edit-user-dialog"
import { ChangePasswordDialog } from "./profile-password-dialog"
import { ProfileMapCard } from "./profile-map-card"

export function ProfileContent() {
  const qc = useQueryClient()
  const [openEditUser, setOpenEditUser] = useState(false)
  const [openEditCompany, setOpenEditCompany] = useState(false)
  const [openPassword, setOpenPassword] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: profileKeys.me(),
    queryFn: fetchProfile,
  })

  const refetchMutation = useMutation({
    mutationFn: async () => {
      await qc.invalidateQueries({ queryKey: profileKeys.me() })
    },
  })

  const user = data?.data?.user
  const company = data?.data?.company || user?.company

  const title = "ملف المورد"
  const subtitle = "إدارة تفاصيلك المهنية الشخصية ومعلومات الشركة المعتمدة للسوق الطبي."

  const statusText = useMemo(() => {
    if (!user) return ""
    return "حساب موثق"
  }, [user])

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-muted-foreground">الإعدادات / ملف المورد</div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7 space-y-6">
          <Card className={cn("rounded-3xl border-0 shadow-sm")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">معلومات الشركة</CardTitle>
              <CardAction>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl"
                  onClick={() => setOpenEditCompany(true)}
                  disabled={isLoading || !company}
                  aria-label="تعديل معلومات الشركة"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">مورد طبي معتمد</div>
                <div className="mt-1 font-semibold leading-tight">
                  {company?.name || (isLoading ? "..." : "—")}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-muted/40 p-4">
                  <div className="text-xs text-muted-foreground">البريد الإلكتروني</div>
                  <div className="mt-2 text-sm font-medium wrap-break-word">{company?.email || "—"}</div>
                </div>
                <div className="rounded-2xl bg-muted/40 p-4">
                  <div className="text-xs text-muted-foreground">رقم الهاتف</div>
                  <div className="mt-2 text-sm font-medium">{company?.phone || "—"}</div>
                </div>
                <div className="rounded-2xl bg-muted/40 p-4 sm:col-span-2">
                  <div className="text-xs text-muted-foreground">العنوان</div>
                  <div className="mt-2 text-sm font-medium">{company?.addressLine || company?.address || "—"}</div>
                </div>
                <div className="rounded-2xl bg-muted/40 p-4">
                  <div className="text-xs text-muted-foreground">رقم التسجيل</div>
                  <div className="mt-2 text-sm font-medium">{company?.registrationNumber || "—"}</div>
                </div>
                <div className="rounded-2xl bg-muted/40 p-4">
                  <div className="text-xs text-muted-foreground">الرقم الضريبي</div>
                  <div className="mt-2 text-sm font-medium">{company?.taxId || "—"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ProfileMapCard company={company} isLoading={isLoading} />
        </div>

        <div className="xl:col-span-5 space-y-6">
          <Card className={cn("rounded-3xl border-0 shadow-sm")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">معلومات المستخدم</CardTitle>
              <CardAction className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-2xl"
                  onClick={() => setOpenEditUser(true)}
                  disabled={isLoading || !user}
                  aria-label="تعديل معلومات المستخدم"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground ">
                    <span className="text-sm font-semibold ">{user?.name?.slice(0, 1) || "?"}</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">الاسم الكامل</div>
                    <div className="mt-1 text-sm ">{user?.name || (isLoading ? "..." : "—")}</div>
                  </div>
                </div>

                <Badge variant="default" className="rounded-full px-3 py-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {statusText}
                </Badge>
              </div>

              <div className="rounded-2xl bg-muted/40 p-4">
                <div className="text-xs text-muted-foreground">البريد الإلكتروني</div>
                <div className="mt-2 text-sm font-medium wrap-break-word">{user?.email || "—"}</div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="default"
                  className="rounded-2xl"
                  onClick={() => setOpenPassword(true)}
                  disabled={isLoading || !user}
                >
                  تغيير كلمة المرور
                </Button>

                <div className="rounded-2xl bg-muted/40 p-4">
                  <div className="text-xs text-muted-foreground">حالة الحساب</div>
                  <div className="mt-2 text-sm font-medium">مفعّل</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-3xl bg-muted/40 p-4 text-sm text-muted-foreground">
            اكتمال الملف الشخصي
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[85%] rounded-full bg-primary" />
            </div>
            <div className="mt-2 text-xs">مكتمل بنسبة 85%، أضف تفاصيل أكثر لتجربة أفضل.</div>
          </div>
        </div>
      </div>

      <EditUserDialog
        open={openEditUser}
        onOpenChange={setOpenEditUser}
        user={user}
        onSaved={async () => {
          toast.success("تم تحديث بيانات المستخدم")
          await refetchMutation.mutateAsync()
        }}
      />
      <EditCompanyDialog
        open={openEditCompany}
        onOpenChange={setOpenEditCompany}
        company={company}
        onSaved={async () => {
          toast.success("تم تحديث بيانات الشركة")
          await refetchMutation.mutateAsync()
        }}
      />
      <ChangePasswordDialog
        open={openPassword}
        onOpenChange={setOpenPassword}
        onSaved={() => {
          toast.success("تم تغيير كلمة المرور")
        }}
      />
    </div>
  )
}

