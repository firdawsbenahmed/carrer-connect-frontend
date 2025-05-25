import type React from "react"
import { MainNav } from "@/components/main-nav"

export default function CVDetailsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">CV Ranking</span>
          </div>
          <MainNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
