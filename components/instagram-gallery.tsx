import Image from "next/image"
import Link from "next/link"
import { Instagram, ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"

const images = [
  { src: "/images/instagram-1.jpg", alt: "Ceramic vase with dried flowers" },
  { src: "/images/instagram-2.jpg", alt: "Handmade mugs on shelf" },
  { src: "/images/instagram-3.jpg", alt: "Ceramic bowl with food" },
  { src: "/images/instagram-4.jpg", alt: "Mosaic lamp glowing" },
  { src: "/images/instagram-5.jpg", alt: "Pottery workshop" },
  { src: "/images/instagram-6.jpg", alt: "Finished ceramic pieces" },
]

export function InstagramGallery() {
  return (
    <section className="py-24 md:py-32 bg-warm-beige/30 grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
                @hindustanisaudagar
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                Follow the <span className="italic">studio</span>
              </h2>
            </div>
            <Link 
              href="https://instagram.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-ink link-underline tracking-wide flex items-center gap-2 group"
            >
              <Instagram className="w-4 h-4" strokeWidth={1.5} />
              Follow us
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {images.map((image, index) => (
            <Reveal key={index} delay={index * 60}>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl shadow-premium"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                  <div className="flex items-center gap-2 text-cream">
                    <Instagram className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
