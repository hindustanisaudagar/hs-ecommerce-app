"use client"

import { useState } from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Reveal } from "@/components/reveal"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      setEmail("")
      setIsSubmitted(false)
    }, 3000)
  }

  return (
    <section className="py-24 md:py-32 bg-ink relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-3xl mx-auto px-6 md:px-10 text-center relative">
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-cream/5 rounded-full px-5 py-2.5 mb-8">
            <Sparkles className="w-4 h-4 text-terracotta-light" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-cream/70">
              Exclusive Access
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-cream tracking-tight mb-6">
            Join the <span className="italic text-terracotta-light">studio</span>
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-cream/60 font-light mb-10 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
            Be the first to know about new collections, artisan stories, 
            and exclusive offers. No spam, just beautiful things.
          </p>
        </Reveal>

        <Reveal delay={300}>
          {isSubmitted ? (
            <div className="bg-terracotta/20 rounded-2xl py-6 px-8 max-w-md mx-auto">
              <p className="text-cream font-light">Welcome to the studio family!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-cream/5 border-cream/10 text-cream placeholder:text-cream/40 rounded-full px-6 py-7 text-sm font-light focus:ring-terracotta focus:border-terracotta/50 flex-1"
              />
              <Button 
                type="submit"
                className="bg-cream text-ink hover:bg-cream/90 rounded-full px-8 py-7 text-sm font-light tracking-widest uppercase group btn-shine whitespace-nowrap shadow-premium"
              >
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Button>
            </form>
          )}
        </Reveal>

        <Reveal delay={400}>
          <p className="text-cream/30 text-xs mt-8 font-light">
            By subscribing, you agree to receive marketing communications. Unsubscribe anytime.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
