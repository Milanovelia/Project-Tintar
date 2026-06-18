"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { deleteEbookAction } from "@/app/collection/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DeleteEbookButton({ ebookId, ebookTitle }: { ebookId: string, ebookTitle: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const res = await deleteEbookAction(ebookId)
    setLoading(false)
    if (res.success) {
      toast.success("eBook berhasil dihapus")
      setOpen(false)
    } else {
      toast.error(res.error || "Gagal menghapus eBook")
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 text-white bg-black/40 hover:bg-destructive hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-full"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Hapus eBook</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Hapus eBook</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus eBook <strong>{ebookTitle}</strong>? Tindakan ini akan menghapus file secara permanen dan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Menghapus..." : "Hapus eBook"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
