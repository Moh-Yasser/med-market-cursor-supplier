import { Company } from "./company"
import { Product } from "./products"

type Kpi = {
        id:string
        title: string
        value: number
        description: string
         trend?: {
          value: string
          direction: 'up'| 'down' | 'flat'
          tone: 'positive' | 'warning' | 'neutral' | 'danger'
        }
      }

  export type Kpis = Kpi[]
    
    type SalesSeriesObject={
        day:"string"
        sales: number
    }

  export  type SalesSeries = SalesSeriesObject[]
      
  export type TopProducts = Product[]
  export type TopBuyers=  Company[]
  
   export type DashboardData = {
    kpis: Kpis
    salesSeries: SalesSeries
    topProducts: TopProducts
    topBuyers: TopBuyers
   }

   export type DashboardApiResponse = {
    data: DashboardData
    success: boolean
    message: string 
   }