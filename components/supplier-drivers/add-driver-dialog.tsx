"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
  UserPlus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  driverDefaultValues,
  DriverFormValues,
  DriverSchema,
} from "./driver-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DRIVERS_KEYS } from "@/lib/drivers/drivers-keys";
import { createDriver } from "@/lib/drivers/drivers.client";

interface AddDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddDriverDialog({ open, onOpenChange }: AddDriverDialogProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(DriverSchema),
    defaultValues: driverDefaultValues,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DRIVERS_KEYS.all });
      onOpenChange?.(false);
      form.reset();
    },
  });

  const handleSubmit = () => {
    mutation.mutate(form.getValues());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        showCloseButton={false}
        className="flex max-h-[92vh] flex-col overflow-hidden p-0 sm:max-w-md"
      >
        <div className="relative shrink-0 bg-primary px-6 pt-6 pb-12 text-primary-foreground">
          <h2 className="mt-2 font-heading text-2xl font-bold">
            إضافة سائق جديد
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/80 text-pretty">
            أدخل بيانات السائق لإضافته إلى فريق التوصيل.
          </p>

         
          <button
            type="button"
            className="absolute -bottom-7 left-6 flex size-14 items-center justify-center rounded-full bg-accent-foreground text-primary-foreground ring-4 ring-popover"
            aria-label="رفع صورة السائق"
          >
            <User className="size-6" aria-hidden="true" />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-5 overflow-y-auto px-6 pt-10 pb-6"
          >
            {/* Full name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      icon={<User className="size-4" aria-hidden="true" />}
                      placeholder="مثال: أحمد العمري"
                      autoComplete="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      icon={<Mail className="size-4" aria-hidden="true" />}
                      type="email"
                      dir="ltr"
                      placeholder="driver@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <InputWithIcon
                      icon={<Phone className="size-4" aria-hidden="true" />}
                      type="tel"
                      dir="ltr"
                      placeholder="+963 9X XXX XXXX"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
                        <Lock className="size-4" aria-hidden="true" />
                      </span>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="h-11 pr-10 pl-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 left-3 flex items-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none"
                        aria-label={
                          showPassword
                            ? "إخفاء كلمة المرور"
                            : "إظهار كلمة المرور"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Shift times */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="workStartTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>بدء الوردية</FormLabel>
                    <FormControl>
                      <Input type="time" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workEndTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نهاية الوردية</FormLabel>
                    <FormControl>
                      <Input type="time" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer */}
            <div className="mt-2 flex items-center gap-3">
              <Button type="submit" className="h-11 flex-1 gap-2">
                <UserPlus className="size-4" aria-hidden="true" />
                إضافة السائق
              </Button>
              <DialogClose>
                <Button type="button" variant="outline" className="h-11 px-6">
                  إلغاء
                </Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface InputWithIconProps extends React.ComponentProps<typeof Input> {
  icon: React.ReactNode;
}

function InputWithIcon({ icon, className, ...props }: InputWithIconProps) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
        {icon}
      </span>
      <Input className={cn("h-11 pr-10", className)} {...props} />
    </div>
  );
}
