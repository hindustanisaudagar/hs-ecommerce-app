'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"

export function Hero() {
  const [content, setContent] = useState<any>({
    image: '/images/hero-product.jpg',
    title_hindi: 'बिताइए कुछ पल',
    title_hindi_highlight: 'देश की मिट्टी',
    title_hindi_suffix: 'के नाम।',
    subtitle: 'Earth, fire & the quiet hands of India.',
    description: "Each piece in our collection is hand-thrown, kiln-fired, and studio-finished by skilled artisans across India. No two pieces are identical — that's the beauty of handmade.",
    cta_text: 'Shop Collection',
    cta_link: '#shop',
    secondary_text: 'Our Story',
    secondary_link: '#story',
    stats: [
      { value: '180+', label: 'Artisan partners' },
      { value: '12', label: 'Indian states' },
      { value: '1-of-1', label: 'Hand-finished' },
    ],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/landing-page?section=hero')
      if (res.ok) {
        const data = await res.json()
        if (data.content) {
          setContent((prev: any) => ({ ...prev, ...data.content }))
        }
      }
    } catch (error) {
      console.error('Failed to fetch hero content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="relative overflow-hidden h-[85vh] min-h-[600px] bg-warm-beige animate-pulse" />
    )
  }

  return (
    <section className="relative overflow-hidden h-[85vh] min-h-[600px]">
      <div className="absolute inset-0">
        <Image
          src={content.image}
          alt="Handmade ceramic vase from Hindustani Saudagar collection"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <div className="max-w-2xl space-y-8 lg:space-y-10">
            
            <Reveal delay={100}>
              <h1 className="font-hindi text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-normal leading-[1.1] text-ink">
                {content.title_hindi}
                <br />
                <span className="text-terracotta">{content.title_hindi_highlight}</span> {content.title_hindi_suffix}
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="font-serif text-2xl md:text-3xl italic text-clay-brown/90 font-light tracking-wide">
                {content.subtitle}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <p className="text-base md:text-[17px] text-muted-foreground font-light leading-[1.8] max-w-lg">
                {content.description}
              </p>
            </Reveal>

            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-5 pt-4">
                <Button 
                  asChild
                  className="bg-ink text-cream hover:bg-ink/90 rounded-full px-10 py-7 text-sm font-light tracking-widest uppercase group btn-shine shadow-premium transition-all duration-300 hover:shadow-premium-lg"
                >
                  <Link href={content.cta_link}>
                    {content.cta_text}
                    <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" strokeWidth={1.5} />
                  </Link>
                </Button>
                <Link 
                  href={content.secondary_link} 
                  className="text-sm font-light text-ink link-underline tracking-wide py-2"
                >
                  {content.secondary_text}
                </Link>
              </div>
            </Reveal>

            <Reveal delay={500}>
              <div className="flex flex-wrap gap-10 pt-8 border-t border-border/50">
                {content.stats?.map((stat: any, index: number) => (
                  <div key={index} className="group">
                    <p className="text-3xl md:text-4xl font-serif font-light text-ink group-hover:text-terracotta transition-colors duration-300">{stat.value}</p>
                    <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
