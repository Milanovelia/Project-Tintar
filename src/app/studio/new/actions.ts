"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function createProjectAction(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const genre = formData.get("genre") as string
    const description = formData.get("description") as string

    if (!title) {
      return { success: false, error: "Judul harus diisi" }
    }

    const project = await prisma.project.create({
      data: {
        title,
        genre: genre || null,
        description: description || null,
      }
    })

    revalidatePath("/studio")
    return { success: true, projectId: project.id }
  } catch (error) {
    console.error("Create project error:", error)
    return { success: false, error: "Gagal membuat proyek" }
  }
}
