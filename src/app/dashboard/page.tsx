import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, BookCheck, Clock } from "lucide-react"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"

export default async function Dashboard() {
  const ebooks = await prisma.ebook.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  })
  
  const totalEbooks = await prisma.ebook.count()
  const readingEbooks = await prisma.ebook.count({ where: { status: 'READING' } })
  const finishedEbooks = await prisma.ebook.count({ where: { status: 'FINISHED' } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Link href="/collection/new" className={buttonVariants({ variant: "default" })}>
            Tambah eBook
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Koleksi</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEbooks}</div>
            <p className="text-xs text-muted-foreground">Buku dalam pustaka</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sedang Dibaca</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readingEbooks}</div>
            <p className="text-xs text-muted-foreground">Buku sedang dibaca</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai Dibaca</CardTitle>
            <BookCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{finishedEbooks}</div>
            <p className="text-xs text-muted-foreground">Buku yang telah ditamatkan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Baru Ditambahkan</CardTitle>
            <CardDescription>
              {ebooks.length} buku terbaru di koleksimu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ebooks.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">Belum ada eBook.</div>
              ) : (
                ebooks.map((ebook) => (
                  <div key={ebook.id} className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0">
                    <div className="h-14 w-10 bg-muted rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {ebook.cover ? (
                        <img src={ebook.cover} alt={ebook.title} className="object-cover w-full h-full" />
                      ) : (
                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{ebook.title}</p>
                      <p className="text-sm text-muted-foreground">{ebook.author}</p>
                    </div>
                    <div className="font-medium text-sm">
                      <Link href={`/read/${ebook.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                        Baca
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
