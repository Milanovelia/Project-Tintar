import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, BookText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function LorePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: { lore: true }
  })

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/studio/${project.id}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Lore Cerita - {project.title}</h1>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Kelola worldbuilding dan lore.</p>
        <Button><Plus className="h-4 w-4 mr-2"/> Tambah Lore</Button>
      </div>

      <div className="grid gap-4 mt-4">
        {project.lore.length === 0 ? (
          <div className="text-center py-10 border rounded-lg bg-muted/20">
            Belum ada catatan lore.
          </div>
        ) : (
          project.lore.map(item => (
            <div key={item.id} className="p-4 border rounded-lg bg-card flex gap-4 items-center">
              <BookText className="h-8 w-8 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">Kategori: {item.category || "-"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
