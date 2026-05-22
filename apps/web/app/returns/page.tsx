import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import Link from "next/link"
import { ArrowLeft, RotateCcw, Shield, CheckCircle } from "lucide-react"

export default function ReturnsPage() {
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
                Returns & Refund Policy
              </h1>
              <p className="text-muted-foreground mt-4">
                Last updated: May 2026
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-cream rounded-2xl p-6 shadow-premium text-center">
                <RotateCcw className="w-8 h-8 text-terracotta mx-auto mb-3" />
                <h3 className="font-medium text-ink mb-1">7-Day Returns</h3>
                <p className="text-sm text-muted-foreground">From delivery date</p>
              </div>
              <div className="bg-cream rounded-2xl p-6 shadow-premium text-center">
                <Shield className="w-8 h-8 text-terracotta mx-auto mb-3" />
                <h3 className="font-medium text-ink mb-1">Quality Guarantee</h3>
                <p className="text-sm text-muted-foreground">100% satisfaction</p>
              </div>
              <div className="bg-cream rounded-2xl p-6 shadow-premium text-center">
                <CheckCircle className="w-8 h-8 text-terracotta mx-auto mb-3" />
                <h3 className="font-medium text-ink mb-1">Easy Process</h3>
                <p className="text-sm text-muted-foreground">Hassle-free returns</p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="prose prose-lg max-w-none text-ink/80">
              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Return Eligibility</h2>
              <p className="mb-4">You can return a product within 7 days of delivery if:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>The product is unused and in its original packaging</li>
                <li>The product is damaged or defective upon arrival</li>
                <li>The wrong product was delivered</li>
                <li>The product does not match the description on our website</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Non-Returnable Items</h2>
              <p className="mb-4">The following items cannot be returned:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Products that have been used or damaged by the customer</li>
                <li>Customized or personalized products</li>
                <li>Products without original packaging and tags</li>
                <li>Sale items (unless defective)</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">How to Return</h2>
              <ol className="list-decimal pl-6 mb-6 space-y-2">
                <li>Contact us at hello@hindustanisaudagar.com or call +91 98765 43210 within 7 days of delivery.</li>
                <li>Provide your order number, product details, and reason for return.</li>
                <li>Share photos of the product (if reporting damage or defect).</li>
                <li>Our team will review your request and provide a Return Authorization Number (RAN) within 24-48 hours.</li>
                <li>Pack the product securely in its original packaging.</li>
                <li>Ship the product to the address provided by our team.</li>
              </ol>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Return Shipping Costs</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Defective/Wrong Product:</strong> We will bear the return shipping cost.</li>
                <li><strong>Change of Mind:</strong> Customer bears the return shipping cost.</li>
                <li>Return shipping must be via a trackable courier service.</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Refund Process</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Once we receive and inspect the returned product, we will process your refund within 5-7 business days.</li>
                <li>Refunds will be issued to the original payment method.</li>
                <li>For COD orders, refunds will be processed via bank transfer (please provide bank details).</li>
                <li>Shipping charges are non-refundable unless the return is due to our error.</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Exchange Policy</h2>
              <p className="mb-6">
                We offer exchanges for size or color variations, subject to product availability. Exchanges must be requested within 7 days of delivery. If the desired variant is not available, a refund will be processed instead.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Damaged Products</h2>
              <p className="mb-6">
                If you receive a damaged product, please report it within 48 hours of delivery with clear photos of the damage and packaging. We will arrange a replacement or full refund at no additional cost.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Contact Us</h2>
              <p className="mb-2"><strong>Email:</strong> hello@hindustanisaudagar.com</p>
              <p className="mb-2"><strong>Phone:</strong> +91 98765 43210</p>
              <p><strong>Address:</strong> Jaipur, Rajasthan, India</p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
