import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"

export function StudioBanner() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      <Image
        src="/images/studio-banner.jpg"
        alt="The Studio Edition - Pottery studio with ceramic pieces"
        fill
        className="object-cover scale-105"
      />
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/40 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <Reveal>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-cream/50" />
            <p className="text-[11px] uppercase tracking-[0.4em] text-cream/70">
              The Studio Edition
            </p>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-cream/50" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-cream font-light tracking-tight max-w-4xl leading-[1.1] mb-8">
            Where <span className="italic text-terracotta-light">earth</span> meets{" "}
            <span className="italic text-terracotta-light">intention</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-cream/60 font-light max-w-lg mb-10 text-base md:text-lg">
            Discover our curated selection of studio pieces, each crafted with intention and finished with care.
          </p>
        </Reveal>
        <Reveal delay={300}>
          <Button 
            asChild
            className="bg-cream text-ink hover:bg-cream/90 rounded-full px-10 py-7 text-sm font-light tracking-widest uppercase group btn-shine shadow-premium-lg"
          >
            <Link href="#studio">
              Explore Studio
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" strokeWidth={1.5} />
            </Link>
          </Button>
        </Reveal>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-cream/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-cream/20" />
    </section>
  )
}
