'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Reveal } from '@/components/reveal'
import { Product } from '@/types'

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState<any[]>([])
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    const urlCategory = searchParams.get('category') || ''
    const urlSortBy = searchParams.get('sortBy') || 'created_at'
    const urlSortOrder = searchParams.get('sortOrder') || 'desc'
    const urlPage = parseInt(searchParams.get('page') || '1')

    setSearch(urlSearch)
    setSelectedCategory(urlCategory)
    setSortBy(urlSortBy)
    setSortOrder(urlSortOrder)
    setPage(urlPage)
    setInitialized(true)
  }, [searchParams])

  useEffect(() => {
    if (!initialized) return
    fetchProducts()
  }, [search, selectedCategory, sortBy, sortOrder, page, initialized])

  useEffect(() => {
    fetchCategories()
  }, [])

  const updateUrl = (params: Record<string, string>) => {
    if (typeof window === 'undefined') return
    const current = new URLSearchParams(window.location.search)
    Object.entries(params).forEach(([key, value]) => {
      if (value) current.set(key, value)
      else current.delete(key)
    })
    const newUrl = `${window.location.pathname}?${current.toString()}`
    router.push(newUrl, { scroll: false })
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
        sortOrder,
      })

      if (search) params.set('search', search)
      if (selectedCategory) params.set('category', selectedCategory)

      const res = await fetch(`/api/products?${params}`)
      const data = await res.json()
      setProducts(data.products || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
    updateUrl({ search: value, page: '1' })
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    setPage(1)
    updateUrl({ category: value, page: '1' })
  }

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-')
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
    setPage(1)
    updateUrl({ sortBy: newSortBy, sortOrder: newSortOrder, page: '1' })
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    updateUrl({ page: newPage.toString() })
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-20 md:py-32 bg-warm-beige/40 grain-texture">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <Reveal>
            <div className="mb-14">
              <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
                Our Collection
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
                All Products
              </h1>
            </div>
          </Reveal>

          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-3 bg-cream border border-border/50 rounded-xl text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
            </div>

              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-3 bg-cream border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-3 bg-cream border border-border/50 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-cream rounded-2xl md:rounded-3xl mb-5" />
                  <div className="h-4 bg-cream rounded w-3/4 mb-2" />
                  <div className="h-4 bg-cream rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No products found
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl md:rounded-3xl bg-cream mb-5 shadow-premium transition-all duration-500 group-hover:shadow-premium-lg">
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                      {product.original_price && product.original_price > product.price && (
                        <span className="absolute top-4 left-4 bg-terracotta text-cream text-[9px] font-light tracking-widest uppercase rounded-full px-4 py-1.5 shadow-sm">
                          Sale
                        </span>
                      )}
                    </div>
                    <div className="px-1">
                      <h3 className="font-serif text-lg text-ink group-hover:text-terracotta transition-colors duration-300">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-base font-light text-ink">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                        {product.original_price && product.original_price > product.price && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₹{product.original_price.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={() => handlePageChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-6 py-3 bg-cream border border-border/50 rounded-xl text-ink disabled:opacity-50 disabled:cursor-not-allowed hover:bg-warm-beige transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-ink">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-6 py-3 bg-cream border border-border/50 rounded-xl text-ink disabled:opacity-50 disabled:cursor-not-allowed hover:bg-warm-beige transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  )
}
