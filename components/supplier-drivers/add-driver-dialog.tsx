"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { driversKeys } from "@/lib/drivers/drivers-keys"
import { createDriver } from "@/lib/drivers/drivers.client"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const emptyForm = { name: "", email: "", password: "" }

export function AddDriverDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(emptyForm)

  const mutation = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: driversKeys.all })
      onOpenChange(false)
      setForm(emptyForm)
    },
  })

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) return
    mutation.mutate({ name: form.name, email: form.email, password: form.password })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>إضافة سائق جديد</DialogTitle>
          <DialogDescription>أدخل بيانات السائق أدناه.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="driverName">الاسم الكامل</Label>
            <Input id="driverName" placeholder="مثال: أحمد محمد" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="driverEmail">البريد الإلكتروني</Label>
            <Input id="driverEmail" type="email" placeholder="driver@company.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="driverPassword">كلمة المرور</Label>
            <Input id="driverPassword" type="password" placeholder="8 أحرف على الأقل" value={form.password} onChange={(e) => set("password", e.target.value)} />
          </div>
          {mutation.isError && (
            <p className="text-sm text-destructive">فشل في إنشاء السائق. يرجى المحاولة مرة أخرى.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>إلغاء</Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending || !form.name || !form.email || !form.password}>
            {mutation.isPending ? "جاري الإضافة..." : "إضافة السائق"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
