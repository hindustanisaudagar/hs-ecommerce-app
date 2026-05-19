'use client'

import { useRef, useEffect } from 'react'

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current && textareaRef.current.value !== content) {
      textareaRef.current.value = content
    }
  }, [content])

  return (
    <div className={`border border-border/50 rounded-xl overflow-hidden bg-warm-beige/30 ${className}`}>
      <textarea
        ref={textareaRef}
        defaultValue={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={6}
        className="w-full px-4 py-3 bg-transparent text-ink focus:outline-none resize-y min-h-[150px]"
      />
    </div>
  )
}
