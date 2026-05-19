'use client'

import { useState } from 'react'

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start typing...',
  className = '',
}: RichTextEditorProps) {
  return (
    <div className={`border border-border/50 rounded-xl overflow-hidden bg-warm-beige/30 ${className}`}>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full px-4 py-3 bg-transparent text-ink focus:outline-none resize-y min-h-[150px]"
      />
    </div>
  )
}
