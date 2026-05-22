'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, User, LogOut, Package, Heart, MapPin, Settings, ChevronRight } from 'lucide-react'
import { signOut } from '@/lib/auth/client'
import { useAuth } from '@/hooks/use-auth'

export function UserDropdown() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) return null
  if (!user) return null

  const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-warm-beige/60 rounded-full transition-colors"
      >
        <div className="w-8 h-8 bg-terracotta text-cream rounded-full flex items-center justify-center text-sm font-medium">
          {userInitial}
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-cream rounded-xl shadow-premium-lg border border-border/50 z-50 overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <p className="font-medium text-ink">{userName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>

            <nav className="p-2">
              <Link
                href="/account"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink hover:bg-warm-beige transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                My Account
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Link>

              <Link
                href="/account/orders"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink hover:bg-warm-beige transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Package className="w-4 h-4" />
                My Orders
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Link>

              <Link
                href="/account/wishlist"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink hover:bg-warm-beige transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Heart className="w-4 h-4" />
                Wishlist
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Link>

              <Link
                href="/account/addresses"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink hover:bg-warm-beige transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <MapPin className="w-4 h-4" />
                Addresses
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Link>

              <Link
                href="/account/settings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ink hover:bg-warm-beige transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
                <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Link>
            </nav>

            <div className="p-2 border-t border-border/50">
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors w-full disabled:opacity-50"
              >
                {signingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
