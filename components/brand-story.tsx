'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"

export function BrandStory() {
  const [content, setContent] = useState<any>({
    image: '/images/artisan-story.jpg',
    label: 'Our Story',
    title: 'Preserving the art of Indian craft, one piece at a time',
    description_1: 'Hindustani Saudagar was born from a simple belief: that the hands which shape clay also shape culture. We partner with over 180 artisans across 12 Indian states, bringing their centuries-old techniques to contemporary homes.',
    description_2: 'Every piece in our collection tells a story of patience, skill, and the quiet dedication of makers who have inherited their craft through generations. From the red earth of Rajasthan to the terracotta traditions of Bengal, each region brings its own unique aesthetic.',
    hindi_quote: 'हर टुकड़े में एक कहानी है',
    hindi_quote_translation: 'Every piece has a story',
    stat_value: '30+',
    stat_label: 'Years of craft',
    cta_text: 'Read our story',
    cta_link: '#about',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/landing-page?section=brand_story')
      if (res.ok) {
        const data = await res.json()
        if (data.content) setContent((prev: any) => ({ ...prev, ...data.content }))
      }
    } catch (error) {
      console.error('Failed to fetch brand story content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <section className="py-20 md:py-32 bg-warm-beige animate-pulse" />
  }

  return (
    <section id="story" className="py-20 md:py-32 bg-warm-beige grain-texture overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-full h-full border border-terracotta/20 rounded-3xl -z-10" />
              
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-premium-lg">
                <Image
                  src={content.image}
                  alt="Indian artisan shaping clay on pottery wheel"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 -right-6 bg-cream rounded-2xl px-8 py-6 shadow-premium-lg border border-border/30">
                <p className="text-4xl font-serif text-terracotta mb-1">{content.stat_value}</p>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{content.stat_label}</p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-8">
            <Reveal>
              <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-medium">
                {content.label}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight leading-[1.15]">
                {content.title}
              </h2>
            </Reveal>

            <Reveal delay={200}>
              <div className="space-y-5 text-base md:text-[17px] text-muted-foreground font-light leading-[1.9]">
                <p>{content.description_1}</p>
                <p>{content.description_2}</p>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="pt-4 border-t border-border/50">
                <p className="font-hindi text-2xl text-clay-brown">
                  &ldquo;{content.hindi_quote}&rdquo;
                </p>
                <p className="text-sm text-muted-foreground mt-2 italic">
                  — {content.hindi_quote_translation}
                </p>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <Button 
                asChild
                variant="outline"
                className="rounded-full px-8 py-6 text-sm font-light tracking-widest uppercase border-ink/20 hover:bg-ink hover:text-cream hover:border-ink transition-all duration-300 group"
              >
                <Link href={content.cta_link}>
                  {content.cta_text}
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </Link>
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
