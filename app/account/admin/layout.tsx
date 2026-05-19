'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Package, ShoppingCart, FolderOpen, LayoutDashboard, ArrowLeft, Shield } from 'lucide-react'

const adminNav = [
  { href: '/account/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/account/admin/products', label: 'Products', icon: Package },
  { href: '/account/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/account/admin/categories', label: 'Categories', icon: FolderOpen },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/admin/check')
        const data = await res.json()
        
        if (!data.isAdmin) {
          router.push('/account')
        } else {
          setIsAdmin(true)
        }
      } catch (error) {
        router.push('/account')
      }
    }
    checkAdmin()
  }, [router])

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-warm-beige/30 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-terracotta mx-auto mb-4 animate-pulse" />
          <p className="text-ink font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-warm-beige/30">
      <div className="flex">
        <aside className="w-64 bg-ink text-cream min-h-screen p-6 fixed">
          <Link href="/account" className="block mb-8">
            <span className="font-serif text-xl">Admin Database Panel</span>
          </Link>

          <nav className="space-y-2">
            {adminNav.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-terracotta text-cream'
                      : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <Link
              href="/account"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-cream/70 hover:bg-cream/10 hover:text-cream transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Back to Account</span>
            </Link>
          </div>
        </aside>

        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
