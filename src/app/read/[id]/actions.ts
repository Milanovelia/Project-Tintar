"use server"

import prisma from "@/lib/prisma"

export async function updateProgress(ebookId: string, progress: number) {
  try {
    let status = "READING"
    if (progress >= 99) {
      status = "FINISHED"
    }

    await prisma.ebook.update({
      where: { id: ebookId },
      data: {
        progress,
        status,
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error("Failed to update progress:", error)
    return { success: false }
  }
}
