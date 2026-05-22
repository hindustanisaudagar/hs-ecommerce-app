'use client'

import { useState, useEffect } from 'react'
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"

export function Hero() {
  const [content, setContent] = useState<any>({
    slides: [
      {
        image: '/images/hero-product.jpg',
        type: 'image',
        title_hindi: 'बिताइए कुछ पल',
        title_hindi_highlight: 'देश की मिट्टी',
        title_hindi_suffix: 'के नाम।',
        subtitle: 'Earth, fire & the quiet hands of India.',
        description: "Each piece in our collection is hand-thrown, kiln-fired, and studio-finished by skilled artisans across India. No two pieces are identical — that's the beauty of handmade.",
        cta_text: 'Shop Collection',
        cta_link: '#shop',
      }
    ],
    stats: [
      { value: '180+', label: 'Artisan partners' },
      { value: '12', label: 'Indian states' },
      { value: '1-of-1', label: 'Hand-finished' },
    ],
  })
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  useEffect(() => {
    const slides = content.slides || []
    if (slides.length <= 1) return
    
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [currentSlide, content.slides])

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/landing-page?section=hero')
      if (res.ok) {
        const data = await res.json()
        if (data.content) {
          if (data.content.slides && data.content.slides.length > 0) {
            setContent((prev: any) => ({ ...prev, ...data.content }))
          } else if (data.content.image) {
            setContent((prev: any) => ({
              ...prev,
              ...data.content,
              slides: [{
                image: data.content.image,
                type: data.content.media_type || 'image',
                title_hindi: data.content.title_hindi,
                title_hindi_highlight: data.content.title_hindi_highlight,
                title_hindi_suffix: data.content.title_hindi_suffix,
                subtitle: data.content.subtitle,
                description: data.content.description,
                cta_text: data.content.cta_text,
                cta_link: data.content.cta_link,
              }]
            }))
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch hero content:', error)
    } finally {
      setLoading(false)
    }
  }

  const goToSlide = (index: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide(index)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const nextSlide = () => {
    const slides = content.slides || []
    goToSlide((currentSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    const slides = content.slides || []
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }

  if (loading) {
    return (
      <section className="relative overflow-hidden h-[85vh] min-h-[600px] bg-warm-beige animate-pulse" />
    )
  }

  const slides = content.slides || []
  const currentSlideData = slides[currentSlide] || slides[0] || {}

  return (
    <section className="relative overflow-hidden h-[85vh] min-h-[600px]">
      {/* Background Image/Video */}
      <div className="absolute inset-0">
        {currentSlideData.type === 'video' ? (
          <video
            src={currentSlideData.image}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={currentSlideData.image || '/images/hero-product.jpg'}
            alt="Handmade ceramic vase from Hindustani Saudagar collection"
            fill
            className="object-cover transition-opacity duration-500"
            priority
            sizes="100vw"
            quality={100}
          />
        )}
      </div>
      
      {currentSlide === 0 && (
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
      )}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center hover:bg-cream transition-all duration-300 shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 text-ink" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center hover:bg-cream transition-all duration-300 shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 text-ink" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-terracotta' : 'w-4 bg-cream/50 hover:bg-cream/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <div className="max-w-2xl space-y-8 lg:space-y-10">
            
            <Reveal key={`title-${currentSlide}`} delay={100}>
              <h1 className="font-hindi text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-normal leading-[1.1] text-ink">
                {currentSlideData.title_hindi}
                <br />
                <span className="text-terracotta">{currentSlideData.title_hindi_highlight}</span> {currentSlideData.title_hindi_suffix}
              </h1>
            </Reveal>

            <Reveal key={`subtitle-${currentSlide}`} delay={200}>
              <p className="font-serif text-2xl md:text-3xl italic text-clay-brown/90 font-light tracking-wide">
                {currentSlideData.subtitle}
              </p>
            </Reveal>

            <Reveal key={`desc-${currentSlide}`} delay={300}>
              <p className="text-base md:text-[17px] text-muted-foreground font-light leading-[1.8] max-w-lg">
                {currentSlideData.description}
              </p>
            </Reveal>

            <Reveal key={`cta-${currentSlide}`} delay={400}>
              <div className="flex flex-wrap items-center gap-5 pt-4">
                <Button 
                  asChild
                  className="bg-ink text-cream hover:bg-ink/90 rounded-full px-10 py-7 text-sm font-light tracking-widest uppercase group btn-shine shadow-premium transition-all duration-300 hover:shadow-premium-lg"
                >
                  <Link href={currentSlideData.cta_link || '#shop'}>
                    {currentSlideData.cta_text || 'Shop Collection'}
                    <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" strokeWidth={1.5} />
                  </Link>
                </Button>
              </div>
            </Reveal>

            <Reveal key={`stats-${currentSlide}`} delay={500}>
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
