export interface Invoice {
  id: number
  orderId: number
  invoiceNumber: string
  subtotal: number
  taxAmount: number
  totalAmount: number
  status: "generated" | "sent" | "paid" | "overdue" | "cancelled"
  paymentStatus: "pending" | "paid" | "partial" | "overdue" | "refunded"
  generatedAt: string
  dueDate: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export interface InvoiceDetailResponse {
  success: boolean
  data: Invoice
}
