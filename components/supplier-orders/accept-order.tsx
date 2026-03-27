"use client";

import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Driver } from "@/types/supplier-orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { driversKeys } from "@/lib/drivers/drivers-keys";
import { fetchDrivers } from "@/lib/drivers/drivers.client";
import { DriversApiResponse } from "@/types/supplier-drivers";
import { assignDriver, cancelOrder } from "@/lib/orders/orders.client";
import { ordersKeys } from "@/lib/orders/orders-keys";

interface AcceptOrderDialogProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    orderId: string;
    currentDriverId?: string | null;
}

export default function AcceptOrderDialog({ open, setOpen, orderId, currentDriverId }: AcceptOrderDialogProps) {
    const queryClient = useQueryClient();
    const [driver, setDriver] = useState("");

    useEffect(() => {
        if (open) {
            setDriver(currentDriverId ?? "");
        }
    }, [open, currentDriverId]);

    const { data, isLoading } = useQuery<DriversApiResponse>({
        queryKey: driversKeys.lists(),
        queryFn: () => fetchDrivers()
    })
    const mutation = useMutation({
        mutationFn: ({ orderId, driverId }: { orderId: number; driverId: number }) =>
            assignDriver(orderId, driverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ordersKeys.all });
            setOpen(false);
        },
    });
    const cancelMutation = useMutation({
        mutationFn: (id: number) => cancelOrder(id, "Cancelled by supplier"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ordersKeys.all });
            setOpen(false);
        },
    });

    const onConfirmOrder = (driverId: string) => {
        mutation.mutate({
            orderId: Number(orderId),
            driverId: Number(driverId)
        })
    }

    const drivers = data?.data ?? [] as Driver[]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent dir="rtl" className="sm:max-w-md">

                <DialogHeader>
                    <DialogTitle> اجراءات الطلب</DialogTitle>
                    <DialogDescription>
                    قم بإدارة الطلب واتخاذ الإجراءات الحاسمة بشكل فوري.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">



                    <div className="space-y-2">
                        <Label>اختيار السائق</Label>
                        <Select value={driver} onValueChange={setDriver}>
                            <SelectTrigger className="w-full flex-row-reverse text-right">
                                <SelectValue
                                    placeholder="اختر السائق"
                                    className="w-full text-right justify-end"
                                />
                            </SelectTrigger>
                            <SelectContent
                                dir="rtl"
                                side="bottom"
                                align="start"
                                sideOffset={4}
                                className="w-(--radix-select-trigger-width)"
                            >
                                {drivers.map((d) => (
                                    <SelectItem
                                        key={d.id}
                                        value={String(d.id)}
                                    >
                                        {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                </div>


                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="destructive" onClick={() => cancelMutation.mutate(Number(orderId))} disabled={cancelMutation.isPending || mutation.isPending}>
                        {cancelMutation.isPending ? "جاري الإلغاء..." : "إلغاء الطلب"}
                    </Button>

                  

                    <Button
                        onClick={() => onConfirmOrder(driver)}
                        disabled={!driver || isLoading || mutation.isPending || cancelMutation.isPending || driver === (currentDriverId ?? "")}
                    >
                        {isLoading || mutation.isPending ? "جاري التأكيد..." : "تأكيد"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}