import type React from "react"
import { Inter  } from "next/font/google"
import "./globals.css"
import Provider from "@/components/Provider"

const cairo = Inter ({ subsets: ["latin"] })

export const metadata = {
  title: "سوق الدواء — بوابة الصيدلية",
  description: "لوحة إدارة التوريدات الطبية",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.className} antialiased`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
