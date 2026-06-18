"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })

      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Login berhasil!")
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/20">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login ke Tintar</CardTitle>
          <CardDescription>Masukkan username dan password Anda untuk masuk.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Belum punya akun? <Link href="/auth/register" className="text-primary hover:underline">Daftar di sini</Link>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              <Link href="/" className="hover:underline">Kembali ke Halaman Utama</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
