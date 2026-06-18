import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, StickyNote } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function NotesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: { notes: true }
  })

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/studio/${project.id}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Catatan - {project.title}</h1>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Ide dan coretan bebas untuk proyek ini.</p>
        <Button><Plus className="h-4 w-4 mr-2"/> Tambah Catatan</Button>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {project.notes.length === 0 ? (
          <div className="col-span-full text-center py-10 border rounded-lg bg-muted/20">
            Belum ada catatan.
          </div>
        ) : (
          project.notes.map(note => (
            <div key={note.id} className="p-4 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">{note.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
