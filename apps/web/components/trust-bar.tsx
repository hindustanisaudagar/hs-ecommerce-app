import { Truck, Shield, RefreshCw, Award } from "lucide-react"
import { Reveal } from "@/components/reveal"

const trustItems = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders above ₹999",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure checkout",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "7-day return policy",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Handcrafted with care",
  },
]

export function TrustBar() {
  return (
    <section className="py-12 md:py-16 bg-warm-beige/30 border-y border-border/30">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {trustItems.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <div className="flex items-center gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
