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

export async function createFolder(name: string) {
  if (!name.trim()) return { success: false, error: "Nama folder tidak boleh kosong" }
  
  try {
    const folder = await prisma.ebookCategory.create({
      data: { name }
    })
    revalidatePath("/collection")
    return { success: true, folder }
  } catch (error) {
    return { success: false, error: "Gagal membuat folder. Nama mungkin sudah ada." }
  }
}

export async function deleteEbookAction(ebookId: string) {
  try {
    const ebook = await prisma.ebook.findUnique({ where: { id: ebookId } })
    if (!ebook) return { success: false, error: "eBook tidak ditemukan" }

    // Hapus file fisik
    await deleteSupabaseFile(ebook.filePath)
    if (ebook.cover) {
      await deleteSupabaseFile(ebook.cover)
    }

    await prisma.ebook.delete({ where: { id: ebookId } })
    revalidatePath("/collection", "layout")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Gagal menghapus eBook" }
  }
}

export async function deleteFolderAction(folderId: string, deleteContents: boolean) {
  try {
    if (deleteContents) {
      const relations = await prisma.ebookCategoryRelation.findMany({
        where: { categoryId: folderId },
        include: { ebook: true }
      })
      
      for (const rel of relations) {
        await deleteSupabaseFile(rel.ebook.filePath)
        if (rel.ebook.cover) {
          await deleteSupabaseFile(rel.ebook.cover)
        }
        await prisma.ebook.delete({ where: { id: rel.ebook.id } }).catch(console.error)
      }
    }
    
    await prisma.ebookCategory.delete({ where: { id: folderId } })
    
    revalidatePath("/collection", "layout")
    return { success: true }
  } catch (error) {
    console.error("Delete folder error:", error)
    return { success: false, error: "Gagal menghapus folder" }
  }
}
