'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import CodeBlock from '@tiptap/extension-code-block'
import React from 'react'

interface TiptapEditorProps {
  content: string
  onChange: (richHtml: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Isključujemo fabrički da bismo uključili prilagođeni CodeBlock ispod
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-[#111620] text-emerald-400 font-mono text-xs p-4 rounded-xl border border-gray-800 my-3 block whitespace-pre-wrap',
        },
      }),
      Image.configure({
        inline: true,
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'min-h-[300px] max-h-[500px] overflow-y-auto p-4 bg-[#181c24] text-[#e2e8f0] focus:outline-none font-sans text-sm rounded-b-xl border border-t-0 border-gray-800',
      },
    },
  })

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = window.prompt('Unesite URL slike (JPG/PNG):')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="flex flex-col border border-gray-800 rounded-xl overflow-hidden shadow-md">
      {/* Toolbar / Traka sa alatkama */}
      <div className="bg-[#1f242d] px-3 py-2 border-b border-gray-800 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2.5 py-1 rounded font-mono text-xs transition ${
            editor.isActive('heading', { level: 1 }) ? 'bg-sky-400 text-[#0f131c] font-bold' : 'bg-[#181c24] text-[#94a3b8] hover:text-white'
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2.5 py-1 rounded font-mono text-xs transition ${
            editor.isActive('heading', { level: 2 }) ? 'bg-sky-400 text-[#0f131c] font-bold' : 'bg-[#181c24] text-[#94a3b8] hover:text-white'
          }`}
        >
          H2
        </button>
        <span className="w-[1px] h-4 bg-gray-700 mx-1"></span>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2.5 py-1 rounded font-mono text-xs transition ${
            editor.isActive('bold') ? 'bg-sky-400 text-[#0f131c] font-bold' : 'bg-[#181c24] text-[#94a3b8] hover:text-white'
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2.5 py-1 rounded font-mono text-xs transition ${
            editor.isActive('italic') ? 'bg-sky-400 text-[#0f131c] font-bold' : 'bg-[#181c24] text-[#94a3b8] hover:text-white'
          }`}
        >
          Italic
        </button>
        <span className="w-[1px] h-4 bg-gray-700 mx-1"></span>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2.5 py-1 rounded font-mono text-xs transition ${
            editor.isActive('codeBlock') ? 'bg-sky-400 text-[#0f131c] font-bold' : 'bg-[#181c24] text-[#94a3b8] hover:text-white'
          }`}
        >
          &lt;/&gt; Code Snippet
        </button>
        <button
          type="button"
          onClick={addImage}
          className="px-2.5 py-1 rounded font-mono text-xs bg-[#181c24] text-[#94a3b8] hover:text-white transition flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">image</span> Slika
        </button>
      </div>

      {/* Editor radna površina */}
      <EditorContent editor={editor} />
      
      <div className="bg-[#181c24] px-4 py-1.5 border-t border-gray-800/60 text-[10px] font-mono text-[#94a3b8]">
        <span>Savjet: Kada ste u bloku koda, pišite više linija. Za izlaz iz bloka pritisnite strelicu nadole (↓) na tastaturi.</span>
      </div>
    </div>
  )
}