import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import Link from "next/link"
import { ArrowLeft, Truck, Clock, Package } from "lucide-react"

export default function ShippingPage() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-20 md:py-32 bg-warm-beige/40 grain-texture">
        <div className="max-w-[900px] mx-auto px-6 md:px-10 lg:px-16">
          <Reveal>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </Reveal>

          <Reveal>
            <div className="mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
                Policies
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                Shipping Policy
              </h1>
              <p className="text-muted-foreground mt-4">
                Last updated: May 2026
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-cream rounded-2xl p-6 shadow-premium text-center">
                <Truck className="w-8 h-8 text-terracotta mx-auto mb-3" />
                <h3 className="font-medium text-ink mb-1">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders above ₹2,000</p>
              </div>
              <div className="bg-cream rounded-2xl p-6 shadow-premium text-center">
                <Clock className="w-8 h-8 text-terracotta mx-auto mb-3" />
                <h3 className="font-medium text-ink mb-1">Delivery Time</h3>
                <p className="text-sm text-muted-foreground">5-7 business days</p>
              </div>
              <div className="bg-cream rounded-2xl p-6 shadow-premium text-center">
                <Package className="w-8 h-8 text-terracotta mx-auto mb-3" />
                <h3 className="font-medium text-ink mb-1">Safe Packaging</h3>
                <p className="text-sm text-muted-foreground">Secure & insured</p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="prose prose-lg max-w-none text-ink/80">
              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Shipping Destinations</h2>
              <p className="mb-6">
                We currently ship to all major cities and towns across India. For remote areas, delivery may take additional time. International shipping is available on select products – please contact us for details.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Shipping Costs</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Free Shipping:</strong> On all orders above ₹2,000</li>
                <li><strong>Standard Shipping:</strong> ₹150 for orders below ₹2,000</li>
                <li><strong>Express Shipping:</strong> ₹300 (2-3 business days)</li>
                <li><strong>International Shipping:</strong> Calculated at checkout based on destination</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Delivery Timeline</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Order Processing:</strong> 1-2 business days</li>
                <li><strong>Standard Delivery:</strong> 5-7 business days after dispatch</li>
                <li><strong>Express Delivery:</strong> 2-3 business days after dispatch</li>
                <li><strong>Remote Areas:</strong> May take 8-10 business days</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Order Tracking</h2>
              <p className="mb-6">
                Once your order is dispatched, you will receive a tracking number via email and SMS. You can track your order status on our website or through the courier partner's website.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Packaging</h2>
              <p className="mb-6">
                All our products are carefully packaged to ensure safe delivery. Fragile items are wrapped in bubble wrap and placed in sturdy boxes. We take extra care with our handmade ceramics to ensure they reach you in perfect condition.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Delivery Issues</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>If your order is delayed beyond the expected delivery date, please contact us.</li>
                <li>If you receive a damaged product, please report it within 48 hours of delivery with photos.</li>
                <li>If no one is available to receive the delivery, the courier will attempt delivery up to 3 times.</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Contact Us</h2>
              <p className="mb-2"><strong>Email:</strong> hello@hindustanisaudagar.com</p>
              <p><strong>Phone:</strong> +91 98765 43210</p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
