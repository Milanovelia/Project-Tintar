"use client"

import { useState, useEffect, useRef } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import ePub, { Rendition, Book } from "epubjs"
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface ReaderProps {
  url: string
  type: "pdf" | "epub" | "docx"
  initialProgress?: number
  onProgressUpdate?: (progress: number) => void
}

export function EbookReader({ url, type, initialProgress = 0, onProgressUpdate }: ReaderProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [docxHtml, setDocxHtml] = useState<string>("")
  const epubViewerRef = useRef<HTMLDivElement>(null)
  const docxRef = useRef<HTMLDivElement>(null)
  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const renditionRef = useRef<Rendition | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(800)

  useEffect(() => {
    if (type === "epub" && epubViewerRef.current) {
      const book = ePub(url)
      const rendition = book.renderTo(epubViewerRef.current, {
        width: "100%",
        height: "100%",
        spread: "none"
      })
      renditionRef.current = rendition
      
      book.ready.then(() => {
        return book.locations.generate(1600)
      }).then(() => {
        if (initialProgress > 0) {
          const cfi = book.locations.cfiFromPercentage(initialProgress / 100)
          rendition.display(cfi)
        } else {
          rendition.display()
        }
      }).catch(() => {
        rendition.display()
      })

      rendition.on("relocated", (location: any) => {
        if (onProgressUpdate) {
          onProgressUpdate(location.start.percentage * 100)
        }
      })

      return () => {
        book.destroy()
      }
    } else if (type === "docx") {
      const loadMammoth = async () => {
        if (!(window as any).mammoth) {
          await new Promise((resolve, reject) => {
            const script = document.createElement("script")
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js"
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
          })
        }
        try {
          const response = await fetch(url)
          const arrayBuffer = await response.arrayBuffer()
          const result = await (window as any).mammoth.convertToHtml({ arrayBuffer })
          // Add some basic styling wrapping since prose might not be installed
          setDocxHtml(`<div class="docx-content" style="line-height: 1.8; font-size: 1rem; color: var(--foreground);">${result.value}</div>`)
        } catch (error) {
          console.error("Error reading docx:", error)
          setDocxHtml("<p>Gagal membaca file DOCX.</p>")
        }
      }
      loadMammoth()
    }
  }, [type, url])

  useEffect(() => {
    if (type === "pdf" && pdfContainerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContainerWidth(Math.min(entry.contentRect.width - 32, 1000))
        }
      })
      resizeObserver.observe(pdfContainerRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [type])

  const handleDocxScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight > clientHeight) {
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      if (onProgressUpdate) onProgressUpdate(progress);
    }
  };

  useEffect(() => {
    if (type === "docx" && docxHtml && docxRef.current && initialProgress > 0) {
      const { scrollHeight, clientHeight } = docxRef.current;
      const targetScroll = (initialProgress / 100) * (scrollHeight - clientHeight);
      docxRef.current.scrollTop = targetScroll;
    }
  }, [docxHtml, type, initialProgress]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    if (initialProgress > 0) {
      const startPage = Math.max(1, Math.floor((initialProgress / 100) * numPages))
      setPageNumber(startPage)
    }
  }

  const changePage = (offset: number) => {
    if (type === "pdf") {
      setPageNumber(prevPageNumber => {
        const newPage = Math.min(Math.max(1, prevPageNumber + offset), numPages)
        if (onProgressUpdate) {
          onProgressUpdate((newPage / numPages) * 100)
        }
        return newPage
      })
    } else if (type === "epub" && renditionRef.current) {
      if (offset > 0) {
        renditionRef.current.next()
      } else {
        renditionRef.current.prev()
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-background relative border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-hidden p-4 bg-muted/10 relative">
        {type === "pdf" && (
          <div ref={pdfContainerRef} className="w-full h-full overflow-auto flex justify-center">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              className="flex flex-col items-center"
            >
              <Page 
                pageNumber={pageNumber} 
                className="shadow-xl"
                renderTextLayer={true}
                renderAnnotationLayer={true}
                width={containerWidth}
              />
            </Document>
          </div>
        )}
        
        {type === "epub" && (
          <div ref={epubViewerRef} className="w-full h-full max-w-4xl mx-auto" />
        )}

        {type === "docx" && (
          <div 
            ref={docxRef}
            className="w-full h-full max-w-3xl mx-auto bg-card shadow-sm border p-8 md:p-12 overflow-y-auto rounded text-justify"
            dangerouslySetInnerHTML={{ __html: docxHtml || '<div class="animate-pulse flex flex-col gap-4"><div class="h-4 bg-muted rounded w-3/4"></div><div class="h-4 bg-muted rounded w-1/2"></div></div>' }}
            onScroll={handleDocxScroll}
          />
        )}
      </div>
      
      {type !== "docx" && (
        <div className="h-14 border-t flex items-center justify-between px-6 bg-muted/50 z-10">
          <button 
            onClick={() => changePage(-1)}
            disabled={type === "pdf" && pageNumber <= 1}
            className="px-4 py-2 bg-background border rounded hover:bg-muted disabled:opacity-50"
          >
            Sebelumnya
          </button>
          
          {type === "pdf" && (
            <span className="text-sm font-medium">
              Halaman {pageNumber} dari {numPages}
            </span>
          )}

          <button 
            onClick={() => changePage(1)}
            disabled={type === "pdf" && pageNumber >= numPages}
            className="px-4 py-2 bg-background border rounded hover:bg-muted disabled:opacity-50"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  )
}
