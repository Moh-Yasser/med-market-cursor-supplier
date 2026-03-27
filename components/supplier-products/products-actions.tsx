"use client"

import { Edit2, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Product } from "@/types/products"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProduct } from "@/lib/products/products.client"
import { productsKeys } from "@/lib/products/products-keys"

type Props = {
  product: Product
  onEdit: () => void
}

export function ProductsActions({ product, onEdit }: Props) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productsKeys.all }),
  })

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
        onClick={onEdit}
      >
        <Edit2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={() => handleDelete(product.id)}
        disabled={deleteMutation.isPending}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}