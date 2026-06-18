"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { uploadEbookAction } from "./actions"
import { createFolder } from "../actions"
import { FolderPlus } from "lucide-react"

export function NewEbookForm({ folders: initialFolders, defaultFolderId = "" }: { folders: { id: string, name: string }[], defaultFolderId?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [folders, setFolders] = useState(initialFolders)
  const [useFolder, setUseFolder] = useState<"yes" | "no" | "">(defaultFolderId ? "yes" : "")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [selectedFolder, setSelectedFolder] = useState(defaultFolderId)

  async function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    try {
      const res = await createFolder(newFolderName)
      if (res.success && res.folder) {
        setFolders([...folders, res.folder].sort((a, b) => a.name.localeCompare(b.name)))
        setSelectedFolder(res.folder.id)
        toast.success("Folder berhasil dibuat")
        setNewFolderName("")
        setIsCreatingFolder(false)
      } else {
        toast.error(res.error)
      }
    } catch (e) {
      toast.error("Gagal membuat folder")
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    if (useFolder === "no" && !defaultFolderId) {
      formData.delete("folderId")
    }
    
    if (defaultFolderId) {
      formData.set("folderId", defaultFolderId)
    }
    
    try {
      const result = await uploadEbookAction(formData)
      if (result.success) {
        toast.success("File/eBook berhasil ditambahkan!")
        if (defaultFolderId) {
          router.push(`/collection/folder/${defaultFolderId}`)
        } else {
          router.push("/collection")
        }
      } else {
        toast.error(result.error || "Gagal menambahkan file")
      }
    } catch (e) {
      toast.error("Terjadi kesalahan saat mengunggah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <form action={handleSubmit} className="space-y-8">
          
          {/* STEP 1: FOLDER */}
          {!defaultFolderId && (
            <div className="space-y-4 border rounded-xl p-6 bg-card shadow-sm">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2"><span className="flex items-center justify-center bg-primary text-primary-foreground w-6 h-6 rounded-full text-sm">1</span> Pengaturan Folder</h2>
                <p className="text-sm text-muted-foreground mt-1">Apakah Anda ingin memasukkan buku/file ini ke dalam folder?</p>
              </div>
              
              <div className="flex gap-4">
                <label className={`flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 hover:bg-muted/50 transition-colors ${useFolder === 'yes' ? 'ring-2 ring-primary border-transparent' : ''}`}>
                  <input type="radio" name="useFolderToggle" value="yes" className="hidden" checked={useFolder === "yes"} onChange={() => setUseFolder("yes")} />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${useFolder === 'yes' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {useFolder === 'yes' && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className="font-medium">Ya, gunakan folder</span>
                </label>
                <label className={`flex items-center gap-2 cursor-pointer border p-3 rounded-lg flex-1 hover:bg-muted/50 transition-colors ${useFolder === 'no' ? 'ring-2 ring-primary border-transparent' : ''}`}>
                  <input type="radio" name="useFolderToggle" value="no" className="hidden" checked={useFolder === "no"} onChange={() => setUseFolder("no")} />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${useFolder === 'no' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {useFolder === 'no' && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className="font-medium">Tidak, simpan di luar</span>
                </label>
              </div>

              {useFolder === "yes" && (
                <div className="space-y-4 pt-4 border-t mt-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-2">
                    <Label htmlFor="folderId">Pilih Folder</Label>
                    <select 
                      id="folderId" 
                      name="folderId" 
                      value={selectedFolder}
                      onChange={(e) => setSelectedFolder(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="">-- Silakan Pilih Folder --</option>
                      {folders.map((f: any) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2">
                    {!isCreatingFolder ? (
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsCreatingFolder(true)}>
                        <FolderPlus className="w-4 h-4 mr-2" /> Buat Folder Baru
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border">
                        <Input 
                          placeholder="Ketik nama folder..." 
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          className="bg-background"
                        />
                        <Button type="button" size="sm" onClick={handleCreateFolder}>Simpan</Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setIsCreatingFolder(false)}>Batal</Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {defaultFolderId && <input type="hidden" name="folderId" value={defaultFolderId} />}

          {/* STEP 2: FILE */}
          <div className={`space-y-4 border rounded-xl p-6 bg-card shadow-sm transition-all duration-300 ${!useFolder && !defaultFolderId ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2"><span className="flex items-center justify-center bg-primary text-primary-foreground w-6 h-6 rounded-full text-sm">2</span> Unggah File eBook</h2>
              <p className="text-sm text-muted-foreground mt-1">Pilih file berformat PDF, EPUB, atau DOCX.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File Dokumen <span className="text-red-500">*</span></Label>
              <Input id="file" name="file" type="file" accept=".pdf,.epub,.docx" required className="h-12 file:h-12 file:mr-4 file:px-4 file:bg-muted file:border-0 hover:file:bg-muted/80 cursor-pointer" />
            </div>
          </div>

          {/* STEP 3: COVER */}
          <div className={`space-y-4 border rounded-xl p-6 bg-card shadow-sm transition-all duration-300 ${!useFolder && !defaultFolderId ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2"><span className="flex items-center justify-center bg-primary text-primary-foreground w-6 h-6 rounded-full text-sm">3</span> Tampilan Sampul</h2>
              <p className="text-sm text-muted-foreground mt-1">Unggah gambar cover agar tampilan lebih menarik dan rapi (Opsional).</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cover">Cover Buku</Label>
              <Input id="cover" name="cover" type="file" accept="image/*" className="h-12 file:h-12 file:mr-4 file:px-4 file:bg-muted file:border-0 hover:file:bg-muted/80 cursor-pointer" />
            </div>
          </div>

          {/* STEP 4: DETAILS */}
          <div className={`space-y-4 border rounded-xl p-6 bg-card shadow-sm transition-all duration-300 ${!useFolder && !defaultFolderId ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2"><span className="flex items-center justify-center bg-primary text-primary-foreground w-6 h-6 rounded-full text-sm">4</span> Detail Informasi Buku</h2>
              <p className="text-sm text-muted-foreground mt-1">Lengkapi data informasi buku ini. Seluruh kolom wajib diisi.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Buku <span className="text-red-500">*</span></Label>
                <Input id="title" name="title" required placeholder="Masukkan judul..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Nama Penulis <span className="text-red-500">*</span></Label>
                <Input id="author" name="author" required placeholder="Nama penulis..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Tahun Terbit <span className="text-red-500">*</span></Label>
                <Input id="year" name="year" type="number" required placeholder="Mis. 2023" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre Buku <span className="text-red-500">*</span></Label>
                <Input id="genre" name="genre" required placeholder="Mis. Fiksi, Edukasi" />
              </div>
            </div>
          </div>

          <div className={`pt-4 flex justify-end gap-4 transition-all duration-300 ${!useFolder && !defaultFolderId ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} disabled={loading}>
              Batalkan
            </Button>
            <Button type="submit" size="lg" disabled={loading} className="px-8">
              {loading ? "Memproses..." : "Selesai & Simpan Buku"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
