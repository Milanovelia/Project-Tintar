"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { deleteChapter } from "@/app/studio/[id]/chapters/actions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DeleteChapterButton({ chapterId, projectId, chapterTitle }: { chapterId: string, projectId: string, chapterTitle: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const res = await deleteChapter(chapterId, projectId)
    setLoading(false)
    if (res.success) {
      toast.success("Chapter berhasil dihapus")
      setOpen(false)
    } else {
      toast.error(res.error || "Gagal menghapus chapter")
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20 ml-2"
        onClick={(e) => {
          e.preventDefault()
          setOpen(true)
        }}
      >
        <Trash2 className="h-4 w-4 mr-1" /> Hapus
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Hapus Chapter</DialogTitle>
            <DialogDescription>
              Anda yakin ingin menghapus chapter <strong>{chapterTitle}</strong>? Tindakan ini akan menghapus isi tulisan secara permanen dan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Menghapus..." : "Hapus Chapter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
