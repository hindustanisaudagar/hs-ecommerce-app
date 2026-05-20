import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Reveal } from "@/components/reveal"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
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
                Privacy Policy
              </h1>
              <p className="text-muted-foreground mt-4">
                Last updated: May 2026
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="prose prose-lg max-w-none text-ink/80">
              <p className="mb-6">
                At Hindustani Saudagar, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Information We Collect</h2>
              <p className="mb-4">We collect the following types of information:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing addresses when you place an order or create an account.</li>
                <li><strong>Payment Information:</strong> Payment details are processed securely through our payment partners (Razorpay, Cashfree). We do not store your full credit card or bank details.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited, products viewed, and time spent on site.</li>
                <li><strong>Device Information:</strong> Browser type, IP address, and device type for security and optimization purposes.</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Send promotional emails (only if you opt-in)</li>
                <li>Improve our website and product offerings</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Data Sharing</h2>
              <p className="mb-4">
                We do not sell your personal information. We may share your data with:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><strong>Payment Processors:</strong> To securely process your payments</li>
                <li><strong>Shipping Partners:</strong> To deliver your orders</li>
                <li><strong>Service Providers:</strong> Who help us operate our website (hosting, analytics, email services)</li>
                <li><strong>Legal Authorities:</strong> When required by law</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Data Security</h2>
              <p className="mb-6">
                We implement industry-standard security measures to protect your personal information. Our website uses SSL encryption, and all payment transactions are processed through secure, PCI-compliant payment gateways.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Cookies</h2>
              <p className="mb-6">
                We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
              </p>

              <h2 className="font-serif text-2xl text-ink mt-10 mb-4">Contact Us</h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
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
