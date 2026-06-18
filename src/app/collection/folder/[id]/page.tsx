import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { DeleteEbookButton } from "@/components/collection/DeleteEbookButton"

export default async function FolderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const folder = await prisma.ebookCategory.findUnique({
    where: { id: resolvedParams.id },
    include: {
      ebooks: {
        include: { ebook: true }
      }
    }
  })

  if (!folder) notFound()

  const ebooks = folder.ebooks.map((e: any) => e.ebook)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/collection" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Folder: {folder.name}</h1>
      </div>

      <div className="flex justify-end mb-4">
        <Link href={`/collection/new?folderId=${folder.id}`} className={buttonVariants({ variant: "default" })}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah File ke Folder
        </Link>
      </div>

      {ebooks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg bg-background">
          <BookOpen className="mx-auto h-12 w-12 opacity-20 mb-4" />
          <p>Belum ada file di folder ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {ebooks.map((ebook: any) => (
            <div key={ebook.id} className="relative group">
              <DeleteEbookButton ebookId={ebook.id} ebookTitle={ebook.title} />
              <Link href={`/read/${ebook.id}`} className="block h-full">
                <Card className="hover:bg-muted/50 transition-colors h-full cursor-pointer overflow-hidden border-transparent hover:border-border">
                  <div className="aspect-[2/3] bg-muted relative flex items-center justify-center">
                  {ebook.cover ? (
                    <img src={ebook.cover} alt={ebook.title} className="object-cover w-full h-full" />
                  ) : (
                    <BookOpen className="h-10 w-10 text-muted-foreground opacity-50" />
                  )}
                </div>
                <CardContent className="p-3">
                  <p className="font-semibold text-sm line-clamp-2" title={ebook.title}>{ebook.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{ebook.author}</p>
                  {ebook.progress > 0 && (
                    <div className="w-full bg-muted rounded-full h-1 mt-2">
                      <div className="bg-primary h-1 rounded-full" style={{ width: `${ebook.progress}%` }} />
                    </div>
                  )}
                </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
