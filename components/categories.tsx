import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/reveal"

const categories = [
  {
    name: "Ceramic Diffusers",
    description: "Handcrafted aroma",
    image: "/images/category-diffuser.jpg",
    href: "#diffusers",
  },
  {
    name: "Artisan Cups",
    description: "Morning rituals",
    image: "/images/category-cups.jpg",
    href: "#cups",
  },
  {
    name: "Ceramic Bowls",
    description: "Everyday elegance",
    image: "/images/category-bowls.jpg",
    href: "#bowls",
  },
  {
    name: "Home Decor",
    description: "Statement pieces",
    image: "/images/category-decor.jpg",
    href: "#decor",
  },
  {
    name: "Mosaic Lamps",
    description: "Ambient glow",
    image: "/images/category-lamps.jpg",
    href: "#lamps",
  },
  {
    name: "Handmade Gifts",
    description: "Thoughtful giving",
    image: "/images/category-gifts.jpg",
    href: "#gifts",
  },
]

export function Categories() {
  return (
    <section id="categories" className="py-20 md:py-32 bg-background grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
                Collections
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                Shop by <span className="italic">Category</span>
              </h2>
            </div>
            <Link 
              href="#shop" 
              className="text-sm font-light text-ink link-underline tracking-wide flex items-center gap-2 group"
            >
              View all
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={index * 80}>
              <Link href={category.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl shadow-premium transition-all duration-500 group-hover:shadow-premium-lg">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Premium gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cream/70 mb-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      {category.description}
                    </p>
                    <h3 className="font-serif text-xl md:text-2xl text-cream font-light tracking-wide">
                      {category.name}
                    </h3>
                    <div className="w-0 h-[1px] bg-cream/50 mt-4 group-hover:w-full transition-all duration-700 ease-out" />
                  </div>

                  {/* Corner arrow */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-cream/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:bg-cream/20">
                    <ArrowUpRight className="w-4 h-4 text-cream" strokeWidth={1.5} />
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
