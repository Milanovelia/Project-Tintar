"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createChapter(projectId: string) {
  const chapterCount = await prisma.chapter.count({
    where: { projectId }
  })

  const newChapter = await prisma.chapter.create({
    data: {
      projectId,
      title: `Chapter ${chapterCount + 1}`,
      content: "",
      order: chapterCount + 1,
      status: "DRAFT",
    }
  })

  revalidatePath(`/studio/${projectId}/chapters`)
  redirect(`/studio/${projectId}/chapters/${newChapter.id}`)
}

export async function saveChapter(chapterId: string, title: string, content: string, wordCount: number, charCount: number) {
  await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      title,
      content,
      wordCount,
      charCount,
      updatedAt: new Date()
    }
  })

  // We could revalidate but since it's an API action called from client, we might just return success
  return { success: true }
}

export async function deleteChapter(chapterId: string, projectId: string) {
  try {
    await prisma.chapter.delete({
      where: { id: chapterId }
    })
    revalidatePath(`/studio/${projectId}/chapters`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting chapter:", error)
    return { success: false, error: "Gagal menghapus chapter" }
  }
}
