import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Heart } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"

const products = [
  {
    name: "Terracotta Studio Vase",
    price: 2450,
    originalPrice: 2850,
    image: "/images/product-1.jpg",
    tag: "New",
    tagColor: "bg-ink",
    href: "#",
  },
  {
    name: "Artisan Coffee Mug",
    price: 890,
    originalPrice: null,
    image: "/images/product-2.jpg",
    tag: "Bestseller",
    tagColor: "bg-terracotta",
    href: "#",
  },
  {
    name: "Clay Aroma Diffuser",
    price: 1850,
    originalPrice: null,
    image: "/images/product-3.jpg",
    tag: "Editor&apos;s Pick",
    tagColor: "bg-clay-brown",
    href: "#",
  },
  {
    name: "Handmade Bowl Set",
    price: 3200,
    originalPrice: 3800,
    image: "/images/product-4.jpg",
    tag: null,
    tagColor: null,
    href: "#",
  },
]

export function Bestsellers() {
  return (
    <section id="shop" className="py-20 md:py-32 bg-warm-beige/40 grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
                Most Loved
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                Bestsellers
              </h2>
            </div>
            <Link 
              href="#shop" 
              className="text-sm font-light text-ink link-underline tracking-wide flex items-center gap-2 group"
            >
              View all products
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
          {products.map((product, index) => (
            <Reveal key={product.name} delay={index * 100}>
              <Link href={product.href} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-2xl md:rounded-3xl bg-cream mb-5 shadow-premium transition-all duration-500 group-hover:shadow-premium-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {product.tag && (
                    <Badge 
                      className={`absolute top-4 left-4 ${product.tagColor} text-cream text-[9px] font-light tracking-widest uppercase rounded-full px-4 py-1.5 shadow-sm`}
                    >
                      {product.tag}
                    </Badge>
                  )}
                  {/* Wishlist button */}
                  <button 
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-cream shadow-sm"
                    aria-label="Add to wishlist"
                  >
                    <Heart className="w-4 h-4 text-ink" strokeWidth={1.5} />
                  </button>
                  {/* Quick add overlay */}
                  <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <button className="w-full bg-ink/90 backdrop-blur-sm text-cream py-3 rounded-xl text-[11px] uppercase tracking-widest font-light hover:bg-ink transition-colors">
                      Quick Add
                    </button>
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="font-serif text-lg text-ink group-hover:text-terracotta transition-colors duration-300">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-base font-light text-ink">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-muted-foreground line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </p>
                    )}
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
