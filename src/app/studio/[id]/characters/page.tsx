import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function CharactersPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: { characters: true }
  })

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/studio/${project.id}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Karakter - {project.title}</h1>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Kelola karakter dalam cerita Anda.</p>
        <Button><Plus className="h-4 w-4 mr-2"/> Tambah Karakter</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {project.characters.length === 0 ? (
          <div className="col-span-full text-center py-10 border rounded-lg bg-muted/20">
            Belum ada karakter.
          </div>
        ) : (
          project.characters.map(character => (
            <div key={character.id} className="p-4 border rounded-lg bg-card flex gap-4 items-center">
              <UserCircle className="h-10 w-10 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">{character.name}</h3>
                <p className="text-sm text-muted-foreground">{character.age || "Umur tidak diketahui"} • {character.race || "Ras tidak diketahui"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
