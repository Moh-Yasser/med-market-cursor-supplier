"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/lib/profile/profile.client"
import type { MeUser } from "@/types/auth"

const schema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
})

type FormValues = z.infer<typeof schema>

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: MeUser
  onSaved: () => void | Promise<void>
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  })

  useEffect(() => {
    if (!open) return
    form.reset({
      name: user?.name || "",
      email: user?.email || "",
    })
  }, [open, user, form])

  const mutation = useMutation({
    mutationFn: (values: FormValues) => updateProfile(values),
    onSuccess: async () => {
      await onSaved()
      onOpenChange(false)
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "حدث خطأ غير متوقع"),
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>تعديل معلومات المستخدم</DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="space-y-2">
            <Label htmlFor="name">الاسم</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name?.message ? (
              <div className="text-xs text-destructive">{form.formState.errors.name.message}</div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" type="email" dir="ltr" {...form.register("email")} />
            {form.formState.errors.email?.message ? (
              <div className="text-xs text-destructive">{form.formState.errors.email.message}</div>
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

