import React from 'react'
import { Mail, Phone, Download, Building2 } from 'lucide-react'

export default function BulkOrderPage() {
  return (
    <main className="min-h-screen bg-cream py-12">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 text-center">
          Hindustani Saudagar – Bulk & Wholesale Program
        </h1>
        <p className="text-lg text-ink/70 text-center mb-12">
          Authentic handmade ceramics & artisan lifestyle products, sourced directly from the creators.
        </p>

        {/* Hero Section */}
        <div className="bg-ink text-cream p-8 rounded-2xl mb-12">
          <h2 className="text-2xl font-serif mb-4">Partner with us for Wholesale</h2>
          <p className="mb-6 opacity-90">
            Expand your business with our unique, handcrafted ceramic collections. Designed for boutiques, cafés, and corporate gifting.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+918882667424" className="flex items-center gap-2 bg-terracotta text-cream px-6 py-3 rounded-xl font-medium hover:bg-terracotta/90 transition-colors">
              <Phone className="w-4 h-4" /> Call: +91 8882667424
            </a>
            <a href="mailto:support@hindustanisaudagar.in" className="flex items-center gap-2 bg-cream/10 text-cream px-6 py-3 rounded-xl font-medium hover:bg-cream/20 transition-colors">
              <Mail className="w-4 h-4" /> Email Us
            </a>
          </div>
        </div>

        {/* Inquiry Form */}
        <section className="bg-white p-8 rounded-2xl shadow-premium mb-12">
          <h2 className="text-2xl font-serif text-ink mb-6">Bulk Inquiry Form</h2>
          <form className="grid md:grid-cols-2 gap-6" action="https://formspree.io/f/mwpkvrwe" method="POST">
            <input type="text" name="name" placeholder="Your Name" required className="p-3 bg-warm-beige/30 rounded-lg border border-border/50" />
            <input type="text" name="business" placeholder="Business Name" required className="p-3 bg-warm-beige/30 rounded-lg border border-border/50" />
            <input type="email" name="email" placeholder="Email Address" required className="p-3 bg-warm-beige/30 rounded-lg border border-border/50" />
            <input type="tel" name="phone" placeholder="Phone Number" required className="p-3 bg-warm-beige/30 rounded-lg border border-border/50" />
            <textarea name="message" placeholder="Tell us about your requirements (e.g., product type, volume)" className="md:col-span-2 p-3 bg-warm-beige/30 rounded-lg border border-border/50" rows={4}></textarea>
            <button type="submit" className="md:col-span-2 bg-ink text-cream py-3 rounded-xl hover:bg-ink/90 transition-colors">
              Send Inquiry
            </button>
          </form>
        </section>

        {/* Catalog Section */}
        <section className="text-center bg-warm-beige/20 p-8 rounded-2xl mb-12">
          <h2 className="text-2xl font-serif text-ink mb-4">Download Catalog</h2>
          <p className="text-ink/70 mb-6">Explore our latest wholesale collections.</p>
          <a href="/catalog.pdf" download className="inline-flex items-center gap-2 bg-terracotta text-cream px-8 py-3 rounded-xl font-medium hover:bg-terracotta/90 transition-colors">
            <Download className="w-4 h-4" /> Download Wholesale Catalog (PDF)
          </a>
        </section>

        {/* Policy Details */}
        <div className="prose prose-ink max-w-none space-y-8">
           <section>
            <h3 className="text-xl font-semibold">Program Highlights</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Minimum Order:</strong> ₹25,000</li>
              <li><strong>Pricing:</strong> Competitive wholesale discounts for better margins.</li>
              <li><strong>Shipping:</strong> Safe, export-grade packaging with fast, reliable delivery across India.</li>
              <li><strong>GST:</strong> Proper tax invoices provided for business accounts.</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
