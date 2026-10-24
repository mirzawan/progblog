'use client'

import { useState } from 'react'
import TiptapEditor from './TiptapEditor'

export default function TiptapEditorWrapper() {
  const [htmlContent, setHtmlContent] = useState('')

  return (
    <div className="flex flex-col gap-2">
      <TiptapEditor content={htmlContent} onChange={setHtmlContent} />
      {/* Skriveno polje preko kojeg server akcija preuzima HTML sadržaj editora */}
      <input type="hidden" name="content" value={htmlContent} />
    </div>
  )
}