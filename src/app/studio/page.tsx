import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PenTool, FolderPlus } from "lucide-react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { DeleteProjectButton } from "@/components/studio/DeleteProjectButton"

export default async function StudioPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Proyek Cerita</h1>
        <Link href="/studio/new" className={buttonVariants({ variant: "default" })}>
          <FolderPlus className="mr-2 h-4 w-4" />
          Buat Proyek Baru
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg bg-background">
          <PenTool className="mx-auto h-12 w-12 opacity-20 mb-4" />
          <p>Belum ada proyek cerita.</p>
          <Link href="/studio/new" className={buttonVariants({ variant: "outline", className: "mt-4" })}>
            Mulai menulis
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Card key={project.id} className="group relative hover:bg-muted/50 transition-colors h-full">
              <DeleteProjectButton projectId={project.id} projectTitle={project.title} asGhostIcon={true} />
              <Link href={`/studio/${project.id}`} className="block h-full cursor-pointer">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {project.description || "Tidak ada deskripsi."}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                      {project.status}
                    </span>
                    {project.genre && (
                      <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary/20">
                        {project.genre}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
