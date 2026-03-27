import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";

type BundleQuantityProps = {
  isSelected: boolean; 
  handleDecreaseQuantity: (productId: number) => void,
  handleIncreaseQuantity: (productId: number) => void,
  productId: number;
  quantity:number
  updateQuantity: (productId: number, newQuantity: number) => void;
};

export function BundleQuantity({
  isSelected,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  productId,
  quantity,
  updateQuantity,
}: BundleQuantityProps) {
  const [draftQty, setDraftQty] = useState("10");

  const commitQty = (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      updateQuantity(productId, parsedValue);
    }
  };
  
useEffect(()=>{
  setDraftQty(quantity.toString())
},[quantity])

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex items-center rounded-lg border border-border">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!isSelected}
          onClick={() => handleDecreaseQuantity(productId)}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Input
          type="text"
          inputMode="numeric"
          value={draftQty}
          disabled={!isSelected}
          onChange={(e) => setDraftQty(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={() => commitQty(draftQty)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commitQty(draftQty);
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="h-8 w-12 rounded-none border-0 px-1 text-center text-sm font-medium shadow-none focus-visible:ring-0"
          aria-label="الكمية"
        />

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={!isSelected}
          onClick={() => handleIncreaseQuantity(productId)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}