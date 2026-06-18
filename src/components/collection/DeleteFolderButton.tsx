"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { deleteFolderAction } from "@/app/collection/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DeleteFolderButton({ folderId, folderName }: { folderId: string, folderName: string }) {
  const [open, setOpen] = useState(false)
  const [deleteContents, setDeleteContents] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const res = await deleteFolderAction(folderId, deleteContents)
    setLoading(false)
    if (res.success) {
      toast.success("Folder berhasil dihapus")
      setOpen(false)
    } else {
      toast.error(res.error || "Gagal menghapus folder")
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Hapus Folder</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Hapus Folder</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus folder <strong>{folderName}</strong>?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer border p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={deleteContents}
                onChange={(e) => setDeleteContents(e.target.checked)}
              />
              <span className="font-medium text-destructive">Hapus juga semua eBook di dalam folder ini</span>
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              Jika tidak dicentang, eBook akan tetap ada di menu "Semua File".
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Menghapus..." : "Hapus Folder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
