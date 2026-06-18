import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createChapter } from "./actions"
import { DeleteChapterButton } from "@/components/studio/DeleteChapterButton"

export default async function ChaptersPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: { chapters: { orderBy: { order: 'asc' } } }
  })

  if (!project) notFound()

  // Wrapper for server action to be called from a form button
  const handleCreate = async () => {
    "use server"
    await createChapter(resolvedParams.id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/studio/${project.id}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Chapters - {project.title}</h1>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Kelola bab cerita Anda.</p>
        <form action={handleCreate}>
          <Button type="submit"><Plus className="h-4 w-4 mr-2"/> Tambah Chapter</Button>
        </form>
      </div>

      <div className="grid gap-4 mt-4">
        {project.chapters.length === 0 ? (
          <div className="text-center py-10 border rounded-lg bg-muted/20 backdrop-blur-sm">
            Belum ada chapter. Silakan tambahkan chapter pertama.
          </div>
        ) : (
          project.chapters.map(chapter => (
            <div key={chapter.id} className="p-4 border rounded-lg bg-card/80 backdrop-blur-sm flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{chapter.title}</h3>
                <p className="text-sm text-muted-foreground">{chapter.wordCount} kata | {chapter.charCount} karakter • Status: {chapter.status}</p>
              </div>
              <div className="flex items-center">
                <Link href={`/studio/${project.id}/chapters/${chapter.id}`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <DeleteChapterButton chapterId={chapter.id} projectId={project.id} chapterTitle={chapter.title} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
