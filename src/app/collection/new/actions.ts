"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

export async function uploadEbookAction(formData: FormData) {
  try {
    const file = formData.get("file") as File
    const cover = formData.get("cover") as File | null
    const title = formData.get("title") as string
    const author = formData.get("author") as string
    const year = formData.get("year") as string
    const genre = formData.get("genre") as string
    const folderId = formData.get("folderId") as string

    if (!file || !title || !author || !year || !genre) {
      return { success: false, error: "Mohon lengkapi seluruh data wajib (File, Judul, Penulis, Tahun, Genre)" }
    }

    // Save eBook file to Supabase
    const fileExt = file.name.split('.').pop()
    const fileName = `ebooks/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const fileBuffer = await file.arrayBuffer()
    const { error: fileError } = await supabase.storage
      .from('tintar-storage')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
      })

    if (fileError) throw new Error("Gagal upload file eBook: " + fileError.message)
    
    const { data: { publicUrl: filePathUrl } } = supabase.storage
      .from('tintar-storage')
      .getPublicUrl(fileName)

    // Save Cover file if exists
    let coverPathUrl = null
    if (cover && cover.size > 0) {
      const coverExt = cover.name.split('.').pop()
      const coverName = `covers/cover-${Date.now()}-${Math.random().toString(36).substring(7)}.${coverExt}`
      const coverBuffer = await cover.arrayBuffer()
      
      const { error: coverError } = await supabase.storage
        .from('tintar-storage')
        .upload(coverName, coverBuffer, {
          contentType: cover.type,
        })
        
      if (coverError) throw new Error("Gagal upload cover: " + coverError.message)

      const { data: { publicUrl } } = supabase.storage
        .from('tintar-storage')
        .getPublicUrl(coverName)
        
      coverPathUrl = publicUrl
    }

    // Save to Database
    const ebook = await prisma.ebook.create({
      data: {
        title,
        author,
        year: year || null,
        genre: genre || null,
        filePath: filePathUrl,
        cover: coverPathUrl,
        categories: folderId ? {
          create: [{
            category: {
              connect: { id: folderId }
            }
          }]
        } : undefined
      }
    })

    revalidatePath("/")
    revalidatePath("/collection", "layout")
    return { success: true, ebookId: ebook.id }
  } catch (error: any) {
    console.error("Upload error:", error)
    return { success: false, error: "Gagal menyimpan data: " + (error.message || String(error)) }
  }
}
