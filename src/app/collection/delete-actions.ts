"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

async function deleteSupabaseFile(fileUrl: string | null) {
  if (!fileUrl) return;
  try {
    const urlParts = fileUrl.split('/tintar-storage/')
    if (urlParts.length === 2) {
      const filePath = urlParts[1]
      await supabase.storage.from('tintar-storage').remove([filePath])
    }
  } catch (error) {
    console.error("Failed to delete file from Supabase", fileUrl, error)
  }
}

export async function deleteEbook(id: string) {
  try {
    const ebook = await prisma.ebook.findUnique({ where: { id } })
    if (!ebook) return { success: false, error: "eBook tidak ditemukan" }

    // Delete files
    await deleteSupabaseFile(ebook.filePath)
    if (ebook.cover) {
      await deleteSupabaseFile(ebook.cover)
    }

    // Delete database record
    await prisma.ebook.delete({ where: { id } })

    revalidatePath("/collection")
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting ebook:", error)
    return { success: false, error: "Gagal menghapus eBook" }
  }
}

export async function deleteFolder(id: string, deleteContents: boolean) {
  try {
    const folder = await prisma.ebookCategory.findUnique({ 
      where: { id },
      include: { ebooks: { include: { ebook: true } } }
    })
    
    if (!folder) return { success: false, error: "Folder tidak ditemukan" }

    if (deleteContents) {
      // Delete all ebooks inside this folder
      for (const relation of folder.ebooks) {
        const ebook = relation.ebook
        await deleteSupabaseFile(ebook.filePath)
        if (ebook.cover) {
          await deleteSupabaseFile(ebook.cover)
        }
        await prisma.ebook.delete({ where: { id: ebook.id } })
      }
    }

    // Finally delete the folder
    await prisma.ebookCategory.delete({ where: { id } })

    revalidatePath("/collection")
    return { success: true }
  } catch (error) {
    console.error("Error deleting folder:", error)
    return { success: false, error: "Gagal menghapus folder" }
  }
}
