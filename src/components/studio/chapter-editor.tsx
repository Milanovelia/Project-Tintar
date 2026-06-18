"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useEffect } from 'react'
import { Extension } from '@tiptap/core'
import { Bold, Italic, Type, Save, ArrowLeft, Loader2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { saveChapter } from '@/app/studio/[id]/chapters/actions'
import { toast } from 'sonner'
import Link from 'next/link'

interface ChapterEditorProps {
  chapter: {
    id: string
    projectId: string
    title: string
    content: string | null
    wordCount: number
    charCount: number
  }
}

const FONTS = [
  { name: 'System Default', value: 'inherit' },
  { name: 'Poppins', value: '"Poppins", sans-serif' },
  { name: 'Times New Roman', value: '"Times New Roman", serif' },
  { name: 'Inter', value: '"Inter", sans-serif' },
  { name: 'Lora', value: '"Lora", serif' },
]

const SIZES = [
  { name: 'Kecil', value: 'text-sm' },
  { name: 'Normal', value: 'text-base' },
  { name: 'Besar', value: 'text-lg' },
  { name: 'Sangat Besar', value: 'text-xl' },
]

// Custom Text Align Extension
const TextAlign = Extension.create({
  name: 'textAlign',
  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right'],
      defaultAlignment: 'left',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          textAlign: {
            default: this.options.defaultAlignment,
            parseHTML: element => element.style.textAlign || this.options.defaultAlignment,
            renderHTML: attributes => {
              if (attributes.textAlign === this.options.defaultAlignment) {
                return {}
              }
              return { style: `text-align: ${attributes.textAlign}` }
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setTextAlign: (alignment: string) => ({ commands }) => {
        if (!this.options.alignments.includes(alignment)) {
          return false
        }
        return this.options.types.some((type: string) => commands.updateAttributes(type, { textAlign: alignment }))
      },
      unsetTextAlign: () => ({ commands }) => {
        return this.options.types.some((type: string) => commands.resetAttributes(type, 'textAlign'))
      },
    }
  }
})

export function ChapterEditor({ chapter }: ChapterEditorProps) {
  const [title, setTitle] = useState(chapter.title)
  const [isSaving, setIsSaving] = useState(false)
  const [font, setFont] = useState(FONTS[0].value)
  const [fontSize, setFontSize] = useState(SIZES[1].value)

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign,
      CharacterCount.configure({
        limit: null,
      }),
      Placeholder.configure({
        placeholder: 'Mulai menulis cerita Anda di sini...',
      }),
    ],
    content: chapter.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[500px] max-w-none w-full p-4',
      },
    },
  })

  const handleSave = async () => {
    if (!editor) return
    setIsSaving(true)
    try {
      const content = editor.getHTML()
      const wordCount = editor.storage.characterCount.words()
      const charCount = editor.storage.characterCount.characters()
      
      await saveChapter(chapter.id, title, content, wordCount, charCount)
      toast.success('Chapter berhasil disimpan')
    } catch (error) {
      toast.error('Gagal menyimpan chapter')
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleSave()
    }, 30000)
    return () => clearInterval(interval)
  }, [editor, title])

  if (!editor) {
    return <div className="flex items-center justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header & Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card/80 backdrop-blur-sm rounded-lg border">
        <div className="flex items-center gap-4">
          <Link href={`/studio/${chapter.projectId}/chapters`} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 w-full max-w-md"
            placeholder="Judul Chapter"
          />
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* Formatting */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-primary/20' : ''}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-primary/20' : ''}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Alignment */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-primary/20' : ''}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-primary/20' : ''}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-primary/20' : ''}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Font settings */}
          <select 
            value={font} 
            onChange={(e) => setFont(e.target.value)}
            className="h-9 px-3 py-1 bg-background border rounded-md text-sm"
          >
            {FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
          </select>
          
          <select 
            value={fontSize} 
            onChange={(e) => setFontSize(e.target.value)}
            className="h-9 px-3 py-1 bg-background border rounded-md text-sm"
          >
            {SIZES.map(s => <option key={s.value} value={s.value}>{s.name}</option>)}
          </select>

          <div className="h-6 w-px bg-border mx-2" />

          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Simpan
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div 
        className={`flex-1 bg-card/80 backdrop-blur-sm rounded-lg border overflow-hidden flex flex-col ${fontSize}`}
        style={{ fontFamily: font }}
      >
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <EditorContent editor={editor} />
        </div>
        
        {/* Character Counter Status Bar */}
        <div className="h-10 border-t bg-muted/30 px-4 flex items-center justify-end text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{editor.storage.characterCount.words()} kata</span>
            <span>{editor.storage.characterCount.characters()} karakter</span>
          </div>
        </div>
      </div>
    </div>
  )
}
