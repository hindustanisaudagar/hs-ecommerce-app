'use client'

import React, { useState, useEffect } from 'react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Mail, Phone, Loader2 } from 'lucide-react'

export default function BulkOrderPage() {
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/admin/deals')
      if (!res.ok) {
        console.error('API error:', await res.text())
        return
      }
      const json = await res.json()
      if (json && !json.error) {
        setSettings(json)
      }
    } catch (e) {
      console.error('Failed to load deals data', e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-cream">
      <Header />

      {settings?.banner_url && (
        <div className="relative w-full h-[400px] overflow-hidden">
          <img src={settings.banner_url} alt="Wholesale Banner" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">

        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-6 text-center">
          {settings?.title || 'Hindustani Saudagar – Bulk & Wholesale Program'}
        </h1>
        <p className="text-lg text-ink/70 text-center mb-6">
          India's Home of Handmade Ceramics & Artisan Craft
        </p>
        <p className="text-ink/80 text-center max-w-2xl mx-auto mb-8">
          Sometimes, the best things truly come in handmade packages — crafted with mitti, warmth, and the soulful touch of Indian artisans.
        </p>
        <p className="text-ink/80 text-center max-w-2xl mx-auto mb-10">
          If you run a store, gifting company, boutique, café, or want to start your own business, HS brings authentic handmade ceramics & artisan lifestyle products straight from the source.
        </p>

        {/* Why Partner */}
        <section className="bg-white p-8 rounded-2xl shadow-premium mb-8">
          <h2 className="text-2xl font-serif text-ink mb-6">Why Partner With Hindustani Saudagar?</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-ink">Exclusive Wholesale Pricing</h3>
              <p className="text-ink/70">Enjoy special discounts, bulk benefits & reseller-friendly prices designed to give you better profit margins.</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Assured Quality & Craftsmanship</h3>
              <p className="text-ink/70">Every mug, jar, diffuser, plate, bowl and lamp passes through strict quality checks so that your customers get only the best of Indian craftsmanship.</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Safe & Secure Packaging</h3>
              <p className="text-ink/70">We follow export-grade packing, triple-layer protection & strong carton boxes to ensure zero breakage delivery.</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Fast Dispatch & Reliable Delivery</h3>
              <p className="text-ink/70">We ship quickly through trusted courier partners all over India, ensuring your order reaches safely and on time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-ink">Handmade in India</h3>
              <p className="text-ink/70">All products are crafted by real artisans across India. Each piece supports rural livelihoods and preserves traditional craft skills.</p>
            </div>
          </div>
        </section>

        {/* Min Order & Discounts */}
        <section className="bg-warm-beige/30 p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-serif text-ink mb-6">🛒 Minimum Order & Discounts</h2>
          <p className="mb-2"><strong>✔ Minimum Order: ₹25,000</strong></p>
          <p className="mb-4 text-ink/70">Once your cart reaches ₹25,000, you become eligible for straight discount (customizable) on wholesale billing.</p>
          <p className="mb-2"><strong>✔ Flexible Quantity</strong></p>
          <p className="text-ink/70">You can mix and match different products — mugs, bowls, aroma diffusers, essential oils, trays, jars, gifting sets, and more.</p>
        </section>

        {/* GST Billing */}
        <section className="bg-white p-8 rounded-2xl shadow-premium mb-8">
          <h2 className="text-2xl font-serif text-ink mb-6">🧾 GST Billing</h2>
          <p className="mb-3"><strong>Do you have a GST Number?</strong></p>
          <p className="mb-2">✔ Yes → You will get a proper GST Tax Invoice on your business name.</p>
          <p className="mb-3"><strong>Don't have GST?</strong></p>
          <p className="text-ink/70">✔ You can still place bulk orders. (But as per government guidelines, businesses with turnover above ₹20,00,000 must register for GST.)</p>
        </section>

        {/* Selling Restrictions */}
        <section className="bg-white p-8 rounded-2xl shadow-premium mb-8">
          <h2 className="text-2xl font-serif text-ink mb-6">❌ Where You Cannot Sell</h2>
          <p className="mb-4 text-ink/70">To protect our brand identity, HS products CANNOT be sold on:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6 text-ink/70">
            <li>Amazon</li>
            <li>Flipkart</li>
            <li>Meesho</li>
            <li>Myntra</li>
            <li>Any online marketplaces</li>
          </ul>
          <p className="mb-4 text-ink/70">These platforms need Brand Authorization Letters which are not provided.</p>

          <h3 className="text-xl font-serif text-ink mb-4">✔ Where You CAN Sell</h3>
          <p className="mb-3 text-ink/70">You are allowed to sell HS products on:</p>
          <ul className="list-disc pl-6 space-y-2 text-ink/70">
            <li>Your own Website</li>
            <li>Retail Stores / Boutique Shops</li>
            <li>Gift Stores</li>
            <li>Social Media Pages (Instagram/Facebook)</li>
            <li>WhatsApp Reselling</li>
            <li>Café / Restaurant Display</li>
            <li>Corporate Gifting</li>
            <li>Society Exhibitions / Flea Markets / Melas</li>
          </ul>
        </section>

        {/* Return Policy */}
        <section className="bg-warm-beige/30 p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-serif text-ink mb-6">🔄 Return & Replacement Policy (Wholesale)</h2>
          <p className="mb-4 text-ink/70">Bulk sales are outright sales. However, you can return up to 20% of your order if:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4 text-ink/70">
            <li>✔ Products are less than 45 days old</li>
            <li>✔ Products are unused & undamaged</li>
          </ul>
          <p className="text-ink/70">The refund is given as Credit Note, redeemable in your next purchase.</p>
        </section>

        {/* Why Choose HS */}
        <section className="bg-white p-8 rounded-2xl shadow-premium mb-8">
          <h2 className="text-2xl font-serif text-ink mb-6">🎨 Why Choose HS for Your Business?</h2>
          <ul className="space-y-3 text-ink/70">
            <li>100% Handmade & Homegrown</li>
            <li>Strong Artisan Network</li>
            <li>Authentic Designs & Unique Collections</li>
            <li>Perfect for Gifting, Retail, Home Decor & Café Serving</li>
            <li>High resale value and strong customer demand</li>
            <li>Products that "sell themselves" due to quality & design</li>
          </ul>
        </section>

        {/* Start Your Journey */}
        <section className="bg-ink text-cream p-8 rounded-2xl mb-8 text-center">
          <h2 className="text-2xl font-serif mb-4">🌍 Start Your Journey With HS Handmade</h2>
          <p className="mb-2">Every piece you sell carries the story of an artisan.</p>
          <p className="mb-2">Every order you place supports Indian craftsmanship.</p>
          <p>Let's grow together — ethically, beautifully, proudly Indian.</p>
        </section>

        {/* Contact */}
        <section className="bg-white p-8 rounded-2xl shadow-premium mb-8">
          <h2 className="text-2xl font-serif text-ink mb-6">📞 Get in Touch</h2>
          <p className="mb-4 text-ink/70">For wholesale inquiries, custom orders, or catalogue:</p>
          <div className="space-y-3">
            <p><strong>📩 Email:</strong> <a href="mailto:support@hindustanisaudagar.in" className="text-terracotta">support@hindustanisaudagar.in</a></p>
            <p><strong>📞 Phone/WhatsApp:</strong> <a href="tel:+918882667424" className="text-terracotta">+91 8882667424</a></p>
            <p><strong>🛒 Website:</strong> <a href="https://www.hindustanisaudagar.in" target="_blank" className="text-terracotta">www.hindustanisaudagar.in</a></p>
          </div>
        </section>

        {/* Inquiry Form */}
        <section className="bg-white p-8 rounded-2xl shadow-premium mb-8">
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

      </div>
      <Footer />
    </main>
  )
}
