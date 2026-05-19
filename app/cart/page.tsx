'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/reveal'
import { useCart } from '@/hooks/store/use-cart'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart()

  const shipping = getTotalPrice() > 2000 ? 0 : 150
  const total = getTotalPrice() + shipping

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-20 md:py-32 bg-warm-beige/40 grain-texture">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <Reveal>
            <div className="mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
                Your Cart
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                Shopping Cart ({getTotalItems()})
              </h1>
            </div>
          </Reveal>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-6" strokeWidth={1} />
              <h2 className="font-serif text-2xl text-ink mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-ink text-cream px-8 py-4 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <Reveal key={item.product.id}>
                    <div className="flex gap-6 p-6 bg-cream rounded-2xl shadow-premium">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-xl overflow-hidden bg-warm-beige">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="font-serif text-lg text-ink hover:text-terracotta transition-colors"
                          >
                            {item.product.name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-ink font-light mb-4">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-border/50 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-2 hover:bg-warm-beige transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-1 text-ink min-w-[2.5rem] text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-2 hover:bg-warm-beige transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <p className="font-medium text-ink">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={clearCart}
                    className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <Link
                    href="/products"
                    className="text-sm text-terracotta hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Reveal delay={200}>
                  <div className="bg-cream rounded-2xl p-8 shadow-premium sticky top-32">
                    <h2 className="font-serif text-xl text-ink mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
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
                      {shipping > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Free shipping on orders above ₹2,000
                        </p>
                      )}
                      <div className="border-t border-border/50 pt-4">
                        <div className="flex justify-between">
                          <span className="font-medium text-ink">Total</span>
                          <span className="font-medium text-ink text-lg">
                            ₹{total.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/checkout"
                      className="w-full bg-ink text-cream py-4 rounded-xl text-sm uppercase tracking-widest font-light hover:bg-ink/90 transition-colors flex items-center justify-center gap-2"
                    >
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <div className="mt-6 pt-6 border-t border-border/50">
                      <p className="text-xs text-muted-foreground text-center">
                        Secure checkout powered by Razorpay
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
