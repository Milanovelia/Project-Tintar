"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteProjectAction(projectId: string) {
  try {
    await prisma.project.delete({
      where: { id: projectId }
    })
    revalidatePath("/studio")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete project:", error)
    return { success: false, error: "Gagal menghapus proyek" }
  }
}
