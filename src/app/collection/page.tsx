import prisma from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Folder, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createFolder } from "./actions"
import { redirect } from "next/navigation"
import { DeleteFolderButton } from "@/components/collection/DeleteFolderButton"
import { DeleteEbookButton } from "@/components/collection/DeleteEbookButton"

export default async function CollectionPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || ""

  // Fetch Folders
  const folders = await prisma.ebookCategory.findMany({
    where: { name: { contains: query } },
    orderBy: { name: 'asc' },
    include: { _count: { select: { ebooks: true } } }
  })

  // Fetch eBooks
  const ebooks = await prisma.ebook.findMany({
    where: { 
      OR: [
        { title: { contains: query } },
        { author: { contains: query } }
      ]
    },
    orderBy: { title: 'asc' }
  })

  // Fetch last read book
  const lastRead = await prisma.ebook.findFirst({
    where: { progress: { gt: 0 } },
    orderBy: { updatedAt: 'desc' }
  })

  // Server action to handle search
  const handleSearch = async (formData: FormData) => {
    "use server"
    const q = formData.get("q") as string
    redirect(`/collection?q=${encodeURIComponent(q)}`)
  }

  // Server action to create folder
  const handleCreateFolder = async (formData: FormData) => {
    "use server"
    const name = formData.get("name") as string
    if (name) {
      await createFolder(name)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Koleksi Saya</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <form action={handleSearch} className="flex relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input name="q" defaultValue={query} placeholder="Cari buku atau folder..." className="pl-8" />
          </form>
          <Link href="/collection/new" className={buttonVariants({ variant: "default" })}>
            <Plus className="h-4 w-4 mr-2" /> File Baru
          </Link>
        </div>
      </div>

      {lastRead && !query && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">Lanjutkan Membaca</p>
              <h3 className="font-bold text-lg">{lastRead.title}</h3>
              <p className="text-sm text-muted-foreground">Progres: {Math.round(lastRead.progress)}%</p>
            </div>
            <Link href={`/read/${lastRead.id}`} className={buttonVariants({ variant: "default" })}>
              Lanjutkan
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Folders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center"><Folder className="mr-2 h-5 w-5" /> Folder</h2>
          <form action={handleCreateFolder} className="flex gap-2">
            <Input name="name" placeholder="Nama Folder Baru" className="w-48 h-9" required />
            <Button type="submit" size="sm" variant="secondary">Buat Folder</Button>
          </form>
        </div>
        
        {folders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada folder ditemukan.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.map(folder => (
              <Card key={folder.id} className="group relative hover:bg-muted/50 transition-colors border-transparent hover:border-border h-full">
                <DeleteFolderButton folderId={folder.id} folderName={folder.name} />
                <Link href={`/collection/folder/${folder.id}`} className="block h-full cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
                    <Folder className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-semibold line-clamp-1">{folder.name}</p>
                      <p className="text-xs text-muted-foreground">{folder._count.ebooks} file</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* All Files Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center"><BookOpen className="mr-2 h-5 w-5" /> Semua File</h2>
        {ebooks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-background">
            <BookOpen className="mx-auto h-12 w-12 opacity-20 mb-4" />
            <p>Belum ada buku/file ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {ebooks.map(ebook => (
              <Card key={ebook.id} className="group relative hover:bg-muted/50 transition-colors h-full overflow-hidden border-transparent hover:border-border">
                <DeleteEbookButton ebookId={ebook.id} ebookTitle={ebook.title} />
                <Link href={`/read/${ebook.id}`} className="block h-full cursor-pointer">
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
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
