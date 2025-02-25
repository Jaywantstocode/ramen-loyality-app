import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "麺ポイント",
  description: "ポイントを貯めて素敵な特典と交換しよう",
  generator: 'v0.dev',
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className={`${inter.className} flex h-full flex-col bg-background text-foreground`}>
        <SidebarProvider>
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mx-auto w-full max-w-7xl">
                {children}
              </div>
            </main>
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}



import './globals.css'