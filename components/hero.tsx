import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/reveal"

export function Hero() {
  return (
    <section className="relative overflow-hidden h-[85vh] min-h-[600px]">
      {/* Full-Width Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-product.jpg"
          alt="Handmade ceramic vase from Hindustani Saudagar collection"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full">
          <div className="max-w-2xl space-y-8 lg:space-y-10">
            
            {/* Main Title */}
            <Reveal delay={100}>
              <h1 className="font-hindi text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-normal leading-[1.1] text-ink">
                बिताइए कुछ पल
                <br />
                <span className="text-terracotta">देश की मिट्टी</span> के नाम।
              </h1>
            </Reveal>

            {/* Subtitle */}
            <Reveal delay={200}>
              <p className="font-serif text-2xl md:text-3xl italic text-clay-brown/90 font-light tracking-wide">
                Earth, fire & the quiet hands of India.
              </p>
            </Reveal>

            {/* Description */}
            <Reveal delay={300}>
              <p className="text-base md:text-[17px] text-muted-foreground font-light leading-[1.8] max-w-lg">
                Each piece in our collection is hand-thrown, kiln-fired, and studio-finished 
                by skilled artisans across India. No two pieces are identical — that&apos;s the beauty 
                of handmade.
              </p>
            </Reveal>

            {/* Buttons */}
            <Reveal delay={400}>
              <div className="flex flex-wrap items-center gap-5 pt-4">
                <Button 
                  asChild
                  className="bg-ink text-cream hover:bg-ink/90 rounded-full px-10 py-7 text-sm font-light tracking-widest uppercase group btn-shine shadow-premium transition-all duration-300 hover:shadow-premium-lg"
                >
                  <Link href="#shop">
                    Shop Collection
                    <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" strokeWidth={1.5} />
                  </Link>
                </Button>
                <Link 
                  href="#story" 
                  className="text-sm font-light text-ink link-underline tracking-wide py-2"
                >
                  Our Story
                </Link>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={500}>
              <div className="flex flex-wrap gap-10 pt-8 border-t border-border/50">
                <div className="group">
                  <p className="text-3xl md:text-4xl font-serif font-light text-ink group-hover:text-terracotta transition-colors duration-300">180+</p>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">Artisan partners</p>
                </div>
                <div className="group">
                  <p className="text-3xl md:text-4xl font-serif font-light text-ink group-hover:text-terracotta transition-colors duration-300">12</p>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">Indian states</p>
                </div>
                <div className="group">
                  <p className="text-3xl md:text-4xl font-serif font-light text-ink group-hover:text-terracotta transition-colors duration-300">1-of-1</p>
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mt-1">Hand-finished</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
