'use client'

import { useState, useEffect } from 'react'
import { Reveal } from "@/components/reveal"
import { Quote, Star } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const reviews = [
  { quote: "The craftsmanship is extraordinary. Each piece feels like it carries the warmth of the hands that made it.", name: "Priya Sharma", city: "Mumbai", rating: 5 },
  { quote: "I've never owned ceramics that feel so alive. The terracotta diffuser has become the soul of my living room.", name: "Arjun Mehta", city: "Bangalore", rating: 5 },
  { quote: "Finally, a brand that celebrates Indian craft without compromising on contemporary aesthetics. Absolutely stunning.", name: "Ananya Reddy", city: "Hyderabad", rating: 5 },
  { quote: "Every piece tells a story. The attention to detail and the quality of craftsmanship is unmatched.", name: "Vikram Singh", city: "Delhi", rating: 5 },
]

export function Reviews() {
  const [content, setContent] = useState<any>({
    label: 'Testimonials',
    title: 'What our community says',
    title_highlight: 'community',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/landing-page?section=reviews')
      if (res.ok) {
        const data = await res.json()
        if (data.content) setContent((prev: any) => ({ ...prev, ...data.content }))
      }
    } catch (error) {
      console.error('Failed to fetch reviews content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <section className="py-24 md:py-32 bg-background animate-pulse" />
  }

  return (
    <section className="py-24 md:py-32 bg-background grain-texture overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
              {content.label}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
              {content.title}
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <Carousel opts={{ align: "center", loop: true }} plugins={[Autoplay({ delay: 6000 })]} className="w-full">
            <CarouselContent className="-ml-4">
              {reviews.map((review, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-4/5 lg:basis-3/5">
                  <div className="bg-warm-beige/50 rounded-3xl p-8 md:p-12 lg:p-16 text-center relative shadow-premium">
                    <div className="absolute top-6 left-6 md:top-8 md:left-8">
                      <Quote className="w-8 h-8 text-terracotta/20" strokeWidth={1} />
                    </div>
                    <div className="flex justify-center gap-1 mb-8">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-terracotta text-terracotta" />
                      ))}
                    </div>
                    <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl text-ink font-light leading-relaxed mb-10">
                      &ldquo;{review.quote}&rdquo;
                    </blockquote>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-4">
                        <span className="text-lg font-serif text-terracotta">{review.name.charAt(0)}</span>
                      </div>
                      <p className="font-medium text-ink tracking-wide">{review.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{review.city}</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4 lg:-left-6 bg-cream border-border/50 hover:bg-warm-beige shadow-premium w-12 h-12" />
            <CarouselNext className="hidden md:flex -right-4 lg:-right-6 bg-cream border-border/50 hover:bg-warm-beige shadow-premium w-12 h-12" />
          </Carousel>
        </Reveal>
      </div>
    </section>
  )
}
