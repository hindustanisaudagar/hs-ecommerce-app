import { redirect } from 'next/navigation'
import { getServerUser } from '@/lib/auth/server'
import Link from 'next/link'
import { Package, Heart, MapPin, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth/client'

export default async function AccountPage() {
  const user = await getServerUser()

  if (!user) {
    redirect('/auth/login')
  }

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'

  return (
    <main className="min-h-screen bg-warm-beige/40 grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-ink">My Account</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="bg-cream rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow group"
          >
            <Package className="w-8 h-8 text-terracotta mb-4" />
            <h3 className="font-medium text-ink mb-1">My Orders</h3>
            <p className="text-sm text-muted-foreground">Track and manage your orders</p>
          </Link>

          <Link
            href="/account/wishlist"
            className="bg-cream rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow group"
          >
            <Heart className="w-8 h-8 text-terracotta mb-4" />
            <h3 className="font-medium text-ink mb-1">Wishlist</h3>
            <p className="text-sm text-muted-foreground">Your saved items</p>
          </Link>

          <Link
            href="/account/addresses"
            className="bg-cream rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow group"
          >
            <MapPin className="w-8 h-8 text-terracotta mb-4" />
            <h3 className="font-medium text-ink mb-1">Addresses</h3>
            <p className="text-sm text-muted-foreground">Manage shipping addresses</p>
          </Link>

          <Link
            href="/account/settings"
            className="bg-cream rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow group"
          >
            <Settings className="w-8 h-8 text-terracotta mb-4" />
            <h3 className="font-medium text-ink mb-1">Settings</h3>
            <p className="text-sm text-muted-foreground">Update profile and password</p>
          </Link>

          <form action={async () => {
            'use server'
            await signOut()
            redirect('/')
          }} className="bg-cream rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow group">
            <button type="submit" className="w-full text-left">
              <LogOut className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-medium text-red-600 mb-1">Logout</h3>
              <p className="text-sm text-muted-foreground">Sign out of your account</p>
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
