import prisma from "@/lib/prisma"
import { NewEbookForm } from "./new-ebook-form"

export default async function NewEbookPage({ searchParams }: { searchParams: Promise<{ folderId?: string }> }) {
  const resolvedParams = await searchParams;
  const defaultFolderId = resolvedParams.folderId || "";
  const folders = await prisma.ebookCategory.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tambah eBook / File</h1>
      </div>
      
      <NewEbookForm folders={folders} defaultFolderId={defaultFolderId} />
    </div>
  )
}
