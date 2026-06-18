"use client"

import { Moon, Sun, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { signOut, useSession } from "next-auth/react"

export function Topbar() {
  const { setTheme, theme } = useTheme()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <header className="flex h-14 items-center justify-end border-b bg-background px-4 lg:px-6"></header>
  }

  return (
    <header className="flex h-14 items-center justify-end border-b bg-background px-4 lg:px-6 gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        title="Ubah Tema"
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {session && (
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900"
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      )}
    </header>
  )
}
