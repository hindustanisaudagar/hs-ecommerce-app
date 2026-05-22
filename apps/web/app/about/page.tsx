import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import Link from "next/link"
import { ArrowLeft, Heart, Users, Award, Leaf } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-20 md:py-32 bg-warm-beige/40 grain-texture">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <Reveal>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Reveal>

          <Reveal>
            <div className="mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
                Our Story
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                About Hindustani Saudagar
              </h1>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <Reveal>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-ink/80 leading-relaxed mb-6">
                  Hindustani Saudagar is more than just a brand – it's a celebration of India's rich artisan heritage. Born from a deep respect for traditional craftsmanship, we bring you handcrafted ceramics and home decor that tell stories of centuries-old techniques passed down through generations.
                </p>
                <p className="text-ink/70 leading-relaxed mb-6">
                  Every piece in our collection is hand-thrown, kiln-fired, and studio-finished by skilled artisans across 12 Indian states. From the terracotta workshops of West Bengal to the blue pottery studios of Jaipur, we partner with master craftspeople who pour their heart and soul into every creation.
                </p>
                <p className="text-ink/70 leading-relaxed">
                  Our mission is simple: to preserve India's artisan traditions while bringing beautiful, functional art into modern homes. When you choose Hindustani Saudagar, you're not just buying a product – you're supporting a craftsman's livelihood and keeping alive a tradition that dates back thousands of years.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="bg-cream rounded-2xl p-8 shadow-premium">
                <h3 className="font-serif text-2xl text-ink mb-6">Our Values</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                      <Heart className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                      <h4 className="font-medium text-ink mb-1">Handcrafted with Love</h4>
                      <p className="text-sm text-muted-foreground">Every piece is made by hand, ensuring uniqueness and character in every product.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                      <h4 className="font-medium text-ink mb-1">Empowering Artisans</h4>
                      <p className="text-sm text-muted-foreground">We work directly with artisans, ensuring fair wages and sustainable livelihoods.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                      <h4 className="font-medium text-ink mb-1">Quality Craftsmanship</h4>
                      <p className="text-sm text-muted-foreground">We maintain the highest standards of quality while preserving traditional techniques.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center shrink-0">
                      <Leaf className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                      <h4 className="font-medium text-ink mb-1">Sustainable Practices</h4>
                      <p className="text-sm text-muted-foreground">Eco-friendly materials and processes that respect our planet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="bg-ink text-cream rounded-2xl p-12 md:p-16 text-center">
              <p className="font-hindi text-2xl md:text-3xl mb-4">
                बिताइए कुछ पल, देश की मिट्टी के नाम
              </p>
              <p className="text-cream/70 text-lg font-light max-w-2xl mx-auto">
                Spend some moments in the name of India's soil. Every purchase supports an artisan family and preserves a tradition.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
