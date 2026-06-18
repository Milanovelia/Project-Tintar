"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPublicRoute = pathname === "/" || pathname.startsWith("/auth")

  if (isPublicRoute) {
    return <main className="flex-1 flex flex-col h-full w-full">{children}</main>
  }

  return (
    <>
      <Sidebar />
      <div 
        className="flex flex-1 flex-col min-w-0 min-h-screen relative bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: `url('/uploads/background1.jfif')` }}
      >
        {/* Overlay to ensure readability */}
        <div className="absolute inset-0 bg-background/90 dark:bg-background/95 backdrop-blur-[2px] z-0 pointer-events-none" />
        
        <div className="relative z-10 flex flex-1 flex-col h-full">
          <Topbar />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
