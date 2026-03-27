"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changePassword } from "@/lib/profile/profile.client"

const schema = z
  .object({
    current_password: z.string().min(6, "كلمة المرور الحالية مطلوبة"),
    password: z.string().min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
    password_confirmation: z.string().min(8, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["password_confirmation"],
  })

type FormValues = z.infer<typeof schema>

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void | Promise<void>
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (values: FormValues) => changePassword(values),
    onSuccess: async () => {
      await onSaved()
      form.reset()
      onOpenChange(false)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع"),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تغيير كلمة المرور</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
          <div className="space-y-2">
            <Label htmlFor="current_password">كلمة المرور الحالية</Label>
            <Input id="current_password" type="password" dir="ltr" {...form.register("current_password")} />
            {form.formState.errors.current_password?.message ? (
              <div className="text-xs text-destructive">{form.formState.errors.current_password.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور الجديدة</Label>
            <Input id="password" type="password" dir="ltr" {...form.register("password")} />
            {form.formState.errors.password?.message ? (
              <div className="text-xs text-destructive">{form.formState.errors.password.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">تأكيد كلمة المرور</Label>
            <Input
              id="password_confirmation"
              type="password"
              dir="ltr"
              {...form.register("password_confirmation")}
            />
            {form.formState.errors.password_confirmation?.message ? (
              <div className="text-xs text-destructive">{form.formState.errors.password_confirmation.message}</div>
            ) : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

