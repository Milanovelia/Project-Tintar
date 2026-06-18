"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createProjectAction } from "./actions"

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      const result = await createProjectAction(formData)
      if (result.success) {
        toast.success("Proyek cerita berhasil dibuat!")
        router.push(`/studio/${result.projectId}`)
      } else {
        toast.error(result.error || "Gagal membuat proyek")
      }
    } catch (e) {
      toast.error("Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Buat Proyek Baru</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detail Proyek Cerita</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Cerita</Label>
              <Input id="title" name="title" required placeholder="Masukkan judul..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" name="genre" placeholder="Mis. Fantasi, Misteri" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi / Premis</Label>
              <Textarea id="description" name="description" rows={5} placeholder="Ceritakan premis atau logline..." />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Buat Proyek"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
