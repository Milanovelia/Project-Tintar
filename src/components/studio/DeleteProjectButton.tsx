"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { deleteProjectAction } from "@/app/studio/actions"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Props {
  projectId: string
  projectTitle: string
  redirectAfter?: boolean
  asGhostIcon?: boolean
}

export function DeleteProjectButton({ projectId, projectTitle, redirectAfter = false, asGhostIcon = true }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const res = await deleteProjectAction(projectId)
    setLoading(false)
    if (res.success) {
      toast.success("Proyek berhasil dihapus")
      setOpen(false)
      if (redirectAfter) {
        router.push("/studio")
      }
    } else {
      toast.error(res.error || "Gagal menghapus proyek")
    }
  }

  return (
    <>
      {asGhostIcon ? (
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
          <span className="sr-only">Hapus Proyek</span>
        </Button>
      ) : (
        <Button
          variant="outline"
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/20"
          onClick={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" /> Hapus Proyek
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Hapus Proyek</DialogTitle>
            <DialogDescription>
              Apakah anda ingin menghapus proyek <strong>{projectTitle}</strong>? Tindakan ini akan menghapus seluruh isi tulisan, karakter, dan data di dalamnya secara permanen.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Tidak
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? "Menghapus..." : "Ya"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
