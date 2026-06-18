"use client"

import { useEffect, useState } from "react"
import { EbookReader } from "@/components/reader/EbookReader"
import { updateProgress } from "./actions"

interface ReadPageClientProps {
  ebookId: string
  url: string
  type: "pdf" | "epub" | "docx"
  initialProgress: number
}

export function ReadPageClient({ ebookId, url, type, initialProgress }: ReadPageClientProps) {
  const [progress, setProgress] = useState(initialProgress)

  // Use a simple debounce for saving progress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress !== initialProgress && progress > 0) {
        updateProgress(ebookId, progress)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [progress, ebookId, initialProgress])

  return (
    <EbookReader 
      url={url} 
      type={type} 
      initialProgress={initialProgress}
      onProgressUpdate={(p) => setProgress(p)}
    />
  )
}
