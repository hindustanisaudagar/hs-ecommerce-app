import type { Metadata } from 'next'
import { Tiro_Devanagari_Hindi } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CompareBar } from '@/components/compare-bar'
import './globals.css'

const tiroDevanagari = Tiro_Devanagari_Hindi({
  subsets: ['devanagari'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-tiro'
})

export const metadata: Metadata = {
  title: 'HS Hindustani Saudagar | Handmade Ceramics & Home Decor',
  description: 'Discover handcrafted ceramics and artisan home decor from India. Each piece is hand-thrown, kiln-fired, and studio-finished by skilled artisans across 12 Indian states.',
  keywords: ['handmade ceramics', 'Indian pottery', 'home decor', 'artisan crafts', 'terracotta', 'ceramic diffusers', 'handmade mugs'],
  openGraph: {
    title: 'HS Hindustani Saudagar | Handmade Ceramics & Home Decor',
    description: 'Earth, fire & the quiet hands of India. Discover handcrafted ceramics and artisan home decor.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${tiroDevanagari.variable} bg-background`}>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
        <script src="https://sdk.cashfree.com/js/v3/cashfree.js" async />
      </head>
      <body className="font-sans antialiased">
        {children}
        <CompareBar />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
