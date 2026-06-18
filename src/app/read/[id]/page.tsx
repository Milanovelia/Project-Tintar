import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EbookReader } from "@/components/reader/EbookReader"
import { ReadPageClient } from "./client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function ReadPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const ebook = await prisma.ebook.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!ebook) {
    notFound()
  }

  // Determine type from extension
  const lowerPath = ebook.filePath.toLowerCase()
  let type: "pdf" | "epub" | "docx" = "pdf"
  if (lowerPath.endsWith('.epub')) type = "epub"
  else if (lowerPath.endsWith('.docx')) type = "docx"

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/collection" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
        </Link>
        <h1 className="text-xl font-bold truncate">{ebook.title}</h1>
      </div>
      
      <div className="flex-1 bg-muted/30 rounded-lg overflow-hidden">
        <ReadPageClient 
          ebookId={ebook.id}
          url={ebook.filePath} 
          type={type} 
          initialProgress={ebook.progress}
        />
      </div>
    </div>
  )
}
