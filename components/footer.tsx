import Link from "next/link"
import { Instagram, Facebook, Twitter, MapPin, Mail, Phone } from "lucide-react"
import { Reveal } from "@/components/reveal"

const shopLinks = [
  { label: "All Products", href: "#shop" },
  { label: "New Arrivals", href: "#new" },
  { label: "Bestsellers", href: "#bestsellers" },
  { label: "Gift Cards", href: "#gifts" },
  { label: "Collections", href: "#collections" },
]

const helpLinks = [
  { label: "Shipping & Returns", href: "#shipping" },
  { label: "FAQs", href: "#faq" },
  { label: "Track Order", href: "#track" },
  { label: "Care Guide", href: "#care" },
  { label: "Contact Us", href: "#contact" },
]

const companyLinks = [
  { label: "Our Story", href: "#story" },
  { label: "Artisan Partners", href: "#artisans" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Press", href: "#press" },
]

const paymentMethods = [
  { name: "Visa", icon: "💳" },
  { name: "Mastercard", icon: "💳" },
  { name: "UPI", icon: "📱" },
  { name: "Paytm", icon: "📱" },
]

export function Footer() {
  return (
    <footer id="contact" className="bg-ink text-cream relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 md:gap-8">
            {/* Brand Column */}
            <Reveal>
              <div className="col-span-2">
                <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                  <div className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center border border-cream/10 group-hover:border-terracotta/30 transition-colors">
                    <span className="text-xl font-serif font-semibold">HS</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="font-serif text-lg">Hindustani Saudagar</span>
                  </div>
                </Link>
                <p className="text-[15px] text-cream/60 font-light leading-relaxed mb-6 max-w-xs">
                  Handcrafted ceramics from the heart of India. Each piece tells a story of tradition and artistry.
                </p>
                <p className="font-hindi text-lg text-terracotta-light">
                  हस्तनिर्मित · देश की मिट्टी
                </p>
              </div>
            </Reveal>

            {/* Shop Links */}
            <Reveal delay={100}>
              <div>
                <h4 className="text-[11px] font-medium mb-6 tracking-[0.2em] uppercase text-cream/80">Shop</h4>
                <ul className="space-y-4">
                  {shopLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-cream/60 hover:text-terracotta-light transition-colors duration-300 font-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Help Links */}
            <Reveal delay={150}>
              <div>
                <h4 className="text-[11px] font-medium mb-6 tracking-[0.2em] uppercase text-cream/80">Help</h4>
                <ul className="space-y-4">
                  {helpLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-cream/60 hover:text-terracotta-light transition-colors duration-300 font-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Company Links */}
            <Reveal delay={200}>
              <div>
                <h4 className="text-[11px] font-medium mb-6 tracking-[0.2em] uppercase text-cream/80">Company</h4>
                <ul className="space-y-4">
                  {companyLinks.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-cream/60 hover:text-terracotta-light transition-colors duration-300 font-light"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Contact */}
            <Reveal delay={250}>
              <div>
                <h4 className="text-[11px] font-medium mb-6 tracking-[0.2em] uppercase text-cream/80">Contact</h4>
                <div className="space-y-4 text-[15px] text-cream/60 font-light">
                  <p className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-terracotta-light" strokeWidth={1.5} />
                    hello@hindustanisaudagar.com
                  </p>
                  <p className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-terracotta-light" strokeWidth={1.5} />
                    +91 98765 43210
                  </p>
                  <p className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-terracotta-light" strokeWidth={1.5} />
                    Jaipur, Rajasthan, India
                  </p>
                </div>
                <div className="flex gap-3 mt-8">
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-cream/5 flex items-center justify-center hover:bg-terracotta/20 hover:text-terracotta-light transition-all duration-300"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </Link>
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-cream/5 flex items-center justify-center hover:bg-terracotta/20 hover:text-terracotta-light transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-cream/5 flex items-center justify-center hover:bg-terracotta/20 hover:text-terracotta-light transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-cream/10">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[13px] text-cream/40 font-light">
                © 2025 Hindustani Saudagar. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-[13px] text-cream/40">
                  <span>Accepted:</span>
                  {['Visa', 'Mastercard', 'UPI', 'Paytm'].map((method) => (
                    <span key={method} className="font-light">
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
