import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'
import Link from 'next/link'
import { ArrowLeft, Heart } from 'lucide-react'

export default async function WishlistPage() {
  const user = await getServerUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <main className="min-h-screen bg-warm-beige/40 grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-12">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Account
        </Link>

        <h1 className="font-serif text-3xl text-ink mb-8">My Wishlist</h1>

        <div className="text-center py-12 bg-cream rounded-2xl">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" strokeWidth={1} />
          <h2 className="font-serif text-xl text-ink mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Save items you love to buy them later</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-ink text-cream px-6 py-3 rounded-xl text-sm hover:bg-ink/90 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </main>
  )
}
