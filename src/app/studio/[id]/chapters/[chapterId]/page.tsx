import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ChapterEditor } from "@/components/studio/chapter-editor"

export default async function ChapterEditPage({ params }: { params: Promise<{ id: string, chapterId: string }> }) {
  const resolvedParams = await params;
  
  const chapter = await prisma.chapter.findUnique({
    where: { 
      id: resolvedParams.chapterId,
      projectId: resolvedParams.id
    }
  })

  if (!chapter) {
    notFound()
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <ChapterEditor chapter={chapter} />
    </div>
  )
}
