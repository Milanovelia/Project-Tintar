"use client"

import Link from 'next/link'
import { BookOpen, Library, LibraryBig, PenTool, LayoutDashboard } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function Sidebar() {
  const { data: session } = useSession()
  const linkClass = session 
    ? "flex items-center gap-3 rounded-lg px-3 py-2 text-amber-800 dark:text-amber-500 transition-all hover:bg-amber-100 dark:hover:bg-amber-950 font-medium"
    : "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"

  return (
    <div className="sticky top-0 flex h-screen w-64 flex-col border-r bg-background shrink-0 z-20">
      <div className="flex h-14 items-center border-b px-4 font-bold text-lg">
        <LibraryBig className="mr-2 h-5 w-5" />
        Tintar
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          <div className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            eBook Manager
          </div>
          <Link
            href="/dashboard"
            className={linkClass}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/collection"
            className={linkClass}
          >
            <Library className="h-4 w-4" />
            Koleksi Saya
          </Link>
          
          <div className="mt-6 px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Writing Studio
          </div>
          <Link
            href="/studio"
            className={linkClass}
          >
            <PenTool className="h-4 w-4" />
            Proyek Cerita
          </Link>
        </nav>
      </div>
    </div>
  )
}
