import { ProductOffer } from "@/types/offer"
import { Separator } from "../ui/separator"
import { Switch } from "../ui/switch"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import Link from "next/link"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { Card } from "../ui/card"



const borderColorClass: Record<string, string> = {
    buy_x_get_y: "border-r-brand",
  percentage_discount: "border-r-primary",
    fixed_discount: "border-r-primary",
    bundle_fixed: "border-r-purple",
    bundle_percentage: "border-r-purple",
  }
  
  const textColorClass: Record<string, string> = {
    buy_x_get_y: "text-brand",
    percentage_discount: "text-primary",
    fixed_discount: "text-primary",
    bundle_fixed: "text-purple",
    bundle_percentage: "text-purple",
  }
  
  const TypeLabels: Record<string, string> = {
    buy_x_get_y: "هدية مجانية",
    percentage_discount: "خصم بنسبة مئوية على المنتج" ,
    fixed_discount: " خصم بمبلغ ثابت على المنتج" ,
    bundle_fixed:"حزمة",
    bundle_percentage:"حزمة"
  }

  interface OfferCardProps {
    offer: ProductOffer
    handleSwitch: (offer: ProductOffer, checked: boolean) => void
    handleDelete: (id: number) => void
    isDeletePending: boolean
    isSwitchPending: boolean
  }

export default function OfferCard ({
  offer,
  handleDelete,
  handleSwitch,
  isDeletePending,
  isSwitchPending,
}: OfferCardProps) {
    let offerExpr=""
    if(offer.offerType==="buy_x_get_y")
     offerExpr =`اشتري ${offer.quantityRequired} و احصل  على ${offer.quantityFree} مجانا`
   else  if(offer.offerType==="fixed_discount")
     offerExpr =`اشتري ${offer.quantityRequired}  و احصل  على ${offer.discountValue} ل.س خصم`
  else  if(offer.offerType==="percentage_discount")
     offerExpr =`اشتري ${offer.quantityRequired} و احصل  على ${offer.discountValue} % خصم`
   else if(offer.offerType==="bundle_fixed")
     offerExpr =`اشتري الحزمة و احصل على ${offer.discountValue} ل.س خصم`
   else if(offer.offerType==="bundle_percentage")
     offerExpr =` اشتري الحزمة و احصل  على ${offer.discountValue} % خصم`

const enabled=offer.isActive;
  
    return (
      <Card className={`p-5 rounded-3xl border-r-4 ${borderColorClass[offer.offerType]} `}>
        <div className="flex h-42 flex-col gap-4 mb-4  ">
          <div className="flex-1">
            <div className="text-sm text-muted-foreground space-y-1">
              <p className={`capitalize ${textColorClass[offer.offerType]}`}>{TypeLabels[offer.offerType]}</p>
           
                <h1 className="text-lg text-black">
                {offer.name}
                </h1>
             <p>
                {offerExpr}
             </p>
          
              <p>
                {new Date(offer.startDate).toLocaleDateString("ar")} — {new Date(offer.endDate).toLocaleDateString("ar")}
              </p>
              {offer.description && (
                <p className="text-foreground mt-1">{offer.description}</p>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Label htmlFor={`offer-mode-${offer.id}`}>نشط</Label>
              <Switch
                id={`offer-mode-${offer.id}`}
                dir="ltr"
                className="data-[state=checked]:bg-primary "
                checked={enabled}
                disabled={isSwitchPending}
                onCheckedChange={(value) => handleSwitch(offer, value)}
              />
              {isSwitchPending && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground shrink-0" />
              )}
            </div>
           <div className="flex items-center gap-2 flex-nowrap">
            <Link href={`/offers/${offer.id}/edit`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 cursor-pointer"
              disabled={isDeletePending}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            </Link>
              <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={() => handleDelete(offer.id)}
              disabled={isDeletePending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }
