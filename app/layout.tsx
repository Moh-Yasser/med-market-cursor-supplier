import type React from "react"
import "./globals.css"
import Provider from "@/components/Provider"

export const metadata = {
  title: "سوق الدواء — بوابة الصيدلية",
  description: "لوحة إدارة التوريدات الطبية",
}

export default async  function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
