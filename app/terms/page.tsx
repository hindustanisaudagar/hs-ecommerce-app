import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
                Legal
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                Terms & Conditions
              </h1>
              <p className="text-muted-foreground mt-4">
                Last updated: May 2026
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="prose prose-lg max-w-none text-ink/80">
              <p className="mb-6">
                Welcome to Hindustani Saudagar. By accessing and using our website, you agree to be bound by these Terms and Conditions. Please read them carefully before making a purchase.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">1. General</h2>
              <p className="mb-6">
                These terms apply to all users of the Hindustani Saudagar website. We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on the website.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">2. Products</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>All products are handcrafted and may have slight variations in color, size, and finish. These variations are a testament to the handmade nature of our products and are not defects.</li>
                <li>Product images are for representation purposes. Actual products may vary slightly due to the handmade process.</li>
                <li>We reserve the right to limit quantities and discontinue products without notice.</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">3. Pricing</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise.</li>
                <li>We reserve the right to change prices without prior notice.</li>
                <li>Shipping charges are additional and calculated at checkout.</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">4. Orders</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>By placing an order, you agree to provide accurate and complete information.</li>
                <li>We reserve the right to cancel any order for any reason, including pricing errors or product unavailability.</li>
                <li>Order confirmation does not guarantee product availability. We will notify you if any items are out of stock.</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">5. Payment</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>We accept payments through Razorpay, Cashfree, UPI, credit/debit cards, and Cash on Delivery (COD).</li>
                <li>For COD orders, please ensure exact change is available.</li>
                <li>Payment must be completed before order processing begins.</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">6. Shipping</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>We ship across India. International shipping is available on select products.</li>
                <li>Standard delivery takes 5-7 business days.</li>
                <li>Express delivery options are available at additional cost.</li>
                <li>Free shipping on orders above ₹2,000.</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">7. Returns & Refunds</h2>
              <p className="mb-4">
                Please refer to our <Link href="/returns" className="text-terracotta hover:underline">Returns & Refund Policy</Link> for detailed information.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">8. Intellectual Property</h2>
              <p className="mb-6">
                All content on this website, including text, images, logos, and designs, is the property of Hindustani Saudagar and is protected by copyright laws. Unauthorized use is prohibited.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">9. Limitation of Liability</h2>
              <p className="mb-6">
                Hindustani Saudagar shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">10. Governing Law</h2>
              <p className="mb-6">
                These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Jaipur, Rajasthan.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Contact Us</h2>
              <p className="mb-2"><strong>Email:</strong> hello@hindustanisaudagar.com</p>
              <p><strong>Address:</strong> Jaipur, Rajasthan, India</p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
