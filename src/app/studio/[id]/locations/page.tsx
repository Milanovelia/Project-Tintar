import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function LocationsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const project = await prisma.project.findUnique({
    where: { id: resolvedParams.id },
    include: { locations: true }
  })

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/studio/${project.id}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">Lokasi - {project.title}</h1>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">Kelola tempat dan lokasi dunia cerita.</p>
        <Button><Plus className="h-4 w-4 mr-2"/> Tambah Lokasi</Button>
      </div>

      <div className="grid gap-4 mt-4">
        {project.locations.length === 0 ? (
          <div className="text-center py-10 border rounded-lg bg-muted/20">
            Belum ada lokasi tercatat.
          </div>
        ) : (
          project.locations.map(loc => (
            <div key={loc.id} className="p-4 border rounded-lg bg-card flex gap-4 items-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
              <div>
                <h3 className="font-semibold">{loc.name}</h3>
                <p className="text-sm text-muted-foreground">{loc.type || "Tipe tidak diketahui"}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
