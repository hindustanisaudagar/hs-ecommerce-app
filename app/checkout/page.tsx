'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/reveal'
import { useCart } from '@/hooks/store/use-cart'

declare global {
  interface Window {
    Razorpay: any
    Cashfree: any
  }
}

type PaymentMethod = 'razorpay' | 'cashfree' | 'cod'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  })

  const shipping = getTotalPrice() > 2000 ? 0 : 150
  const total = getTotalPrice() + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRazorpayPayment = async (orderData: any) => {
    const options = {
      key: orderData.razorpay_key_id,
      amount: orderData.amount * 100,
      currency: 'INR',
      name: 'Hindustani Saudagar',
      description: 'Order Payment',
      order_id: orderData.razorpay_order_id,
      handler: async (response: any) => {
        await fetch('/api/payment/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })

        clearCart()
        setOrderSuccess(true)
      },
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: '#B85A38',
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  const handleCashfreePayment = async (orderData: any) => {
    const cashfree = await import('@cashfreepayments/cashfree-js')
    const cf = await cashfree.load({ mode: 'sandbox' })

    const checkoutOptions = {
      paymentSessionId: orderData.payment_session_id,
      redirectTarget: '_modal',
    }

    cf.checkout(checkoutOptions).then((result: any) => {
      if (result.error) {
        alert('Payment failed: ' + result.error.message)
        return
      }
      if (result.redirect) {
        return
      }
      clearCart()
      setOrderSuccess(true)
    })
  }

  const handleCOD = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shipping_address: formData,
          billing_address: formData,
          payment_method: 'cod',
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create order')
      }

      clearCart()
      setOrderSuccess(true)
    } catch (error: any) {
      alert(error.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (paymentMethod === 'cod') {
        await handleCOD()
        return
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          shipping_address: formData,
          billing_address: formData,
          payment_method: paymentMethod,
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment(data)
      } else if (paymentMethod === 'cashfree') {
        await handleCashfreePayment(data)
      }
    } catch (error: any) {
      alert(error.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderSuccess) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="py-20 md:py-32 bg-warm-beige/40 grain-texture">
          <div className="max-w-[600px] mx-auto px-6 text-center">
            <Reveal>
              <CheckCircle className="w-20 h-20 mx-auto text-green-600 mb-6" />
              <h1 className="font-serif text-3xl md:text-4xl text-ink mb-4">
                {paymentMethod === 'cod' ? 'Order Placed Successfully!' : 'Payment Successful!'}
              </h1>
              <p className="text-muted-foreground mb-8">
                {paymentMethod === 'cod'
                  ? 'Thank you for your order. We will contact you soon for delivery.'
                  : "Thank you for your purchase. We'll send you a confirmation email shortly."}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-ink text-cream px-8 py-4 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </Reveal>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (items.length === 0 && !loading) {
    router.push('/cart')
    return null
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-20 md:py-32 bg-warm-beige/40 grain-texture">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <Reveal>
            <h1 className="font-serif text-3xl md:text-4xl text-ink mb-12">
              Checkout
            </h1>
          </Reveal>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <Reveal>
                <div className="bg-cream rounded-2xl p-8 shadow-premium">
                  <h2 className="font-serif text-xl text-ink mb-6">
                    Shipping Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm text-muted-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-muted-foreground mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="address_line1"
                        required
                        value={formData.address_line1}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-muted-foreground mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="address_line2"
                        value={formData.address_line2}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                      />
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="bg-cream rounded-2xl p-8 shadow-premium">
                  <h2 className="font-serif text-xl text-ink mb-6">
                    Payment Method
                  </h2>

                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === 'razorpay'
                          ? 'border-terracotta bg-terracotta/5'
                          : 'border-border/50 hover:border-terracotta/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 accent-terracotta"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-ink">Razorpay</p>
                        <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking, Wallets</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-warm-beige px-2 py-1 rounded">UPI</span>
                        <span className="text-xs bg-warm-beige px-2 py-1 rounded">Cards</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === 'cashfree'
                          ? 'border-terracotta bg-terracotta/5'
                          : 'border-border/50 hover:border-terracotta/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cashfree"
                        checked={paymentMethod === 'cashfree'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 accent-terracotta"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-ink">Cashfree</p>
                        <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-warm-beige px-2 py-1 rounded">UPI</span>
                        <span className="text-xs bg-warm-beige px-2 py-1 rounded">Cards</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                        paymentMethod === 'cod'
                          ? 'border-terracotta bg-terracotta/5'
                          : 'border-border/50 hover:border-terracotta/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-4 h-4 accent-terracotta"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-ink">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive</p>
                      </div>
                    </label>
                  </div>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-1">
              <Reveal delay={200}>
                <div className="bg-cream rounded-2xl p-8 shadow-premium sticky top-32">
                  <h2 className="font-serif text-xl text-ink mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className="text-ink">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}

                    <div className="border-t border-border/50 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-ink">
                          ₹{getTotalPrice().toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="text-ink">
                          {shipping === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `₹${shipping.toLocaleString('en-IN')}`
                          )}
                        </span>
                      </div>
                      <div className="border-t border-border/50 pt-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-ink">Total</span>
                          <span className="font-medium text-ink text-lg">
                            ₹{total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-ink text-cream py-4 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : paymentMethod === 'cod' ? (
                      'Place Order (COD)'
                    ) : (
                      'Pay Now'
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {paymentMethod === 'cod'
                      ? 'Cash on Delivery available'
                      : 'Secure payment powered by Razorpay & Cashfree'}
                  </p>
                </div>
              </Reveal>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
