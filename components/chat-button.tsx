"use client"

import { MessageCircle } from "lucide-react"

export function ChatButton() {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-ink text-cream pl-5 pr-6 py-4 rounded-full shadow-premium-lg hover:shadow-2xl transition-all duration-500 group btn-shine"
      aria-label="Chat with us"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-ink animate-pulse-ring -z-10" />
      
      <div className="relative">
        <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
        {/* Online indicator */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-ink" />
      </div>
      <span className="text-sm font-light tracking-wide">Chat with us</span>
    </button>
  )
}
