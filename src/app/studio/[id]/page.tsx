import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Book, Users, Map, Building2, BookOpen, Clock, StickyNote } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteProjectButton } from "@/components/studio/DeleteProjectButton"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: {
      _count: {
        select: { chapters: true }
      }
    }
  })

  if (!project) {
    notFound()
  }

  const sections = [
    { title: "Chapters", count: project._count.chapters, icon: Book, href: `/studio/${project.id}/chapters` },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/studio" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground">{project.description}</p>
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              {project.status}
            </span>
            {project.genre && (
              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground ring-1 ring-inset ring-secondary/20">
                {project.genre}
              </span>
            )}
          </div>
        </div>
        <DeleteProjectButton projectId={project.id} projectTitle={project.title} redirectAfter={true} asGhostIcon={false} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
        {sections.map(section => (
          <Link href={section.href} key={section.title}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{section.title}</CardTitle>
                <section.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{section.count}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
