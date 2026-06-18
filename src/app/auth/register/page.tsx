"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak cocok!")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Gagal mendaftar")
      } else {
        toast.success("Registrasi berhasil! Silakan login.")
        router.push("/auth/login")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Daftar Akun Baru</CardTitle>
          <CardDescription>Buat akun Tintar untuk menyimpan proyek Anda.</CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input 
                id="confirmPassword" 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Sudah punya akun? <Link href="/auth/login" className="text-primary hover:underline">Login di sini</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
