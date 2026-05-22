"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, User, ShoppingBag, Menu, ChevronDown, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/store/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { UserDropdown } from "@/components/auth/user-dropdown"

interface SubCategory {
  id: string
  name: string
  slug: string
  children?: SubCategory[]
}

interface Category {
  id: string
  name: string
  slug: string
  children: SubCategory[]
}

interface StaticLink {
  href: string
  label: string
}

const staticLinks: StaticLink[] = [
  { href: "#bulk-order", label: "Bulk Order & Deals" },
]

export function Header() {
  const router = useRouter()
  const getTotalItems = useCart((state) => state.getTotalItems)
  const cartCount = getTotalItems()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?hierarchical=true')
      const data = await res.json()
      const cats = data || []
      
      // Sort categories: those with children (dropdowns) first, then alphabetically
      const sorted = [...cats].sort((a, b) => {
        const aHasChildren = a.children?.length > 0 ? 0 : 1
        const bHasChildren = b.children?.length > 0 ? 0 : 1
        if (aHasChildren !== bHasChildren) return aHasChildren - bHasChildren
        return a.name.localeCompare(b.name)
      })
      
      setCategories(sorted)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }
    
    setSearching(true)
    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=8`)
      const data = await res.json()
      setSearchResults(data.products || [])
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearching(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchOpen(false)
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleSearchResultClick = (slug: string) => {
    setSearchOpen(false)
    router.push(`/products/${slug}`)
  }

  const handleMouseEnter = (slug: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setActiveDropdown(slug)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 500)
    setDropdownTimeout(timeout)
  }

  const toggleMobileDropdown = (slug: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === slug ? null : slug)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top Thin Black Strip */}
      <div className="bg-ink h-1 w-full" />

      {/* Main Header - Compact Single Row */}
      <div className={cn(
        "transition-all duration-500 ease-out bg-background border-b border-border/20",
        isScrolled && "shadow-premium bg-background/95 backdrop-blur-xl"
      )}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo + Brand Name */}
            <Link href="/" className="flex items-center gap-3 group shrink-0 min-w-0">
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                <Image
                  src="/images/logo.jpg"
                  alt="Hindustani Saudagar"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-serif text-sm md:text-base font-semibold tracking-tight text-ink whitespace-nowrap">
                Hindustani Saudagar
              </span>
            </Link>

            {/* Hindi Strip - Compact Tri-Color */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="font-hindi text-base text-orange-600 font-medium tracking-wide">
                बिताइए कुछ पल
              </span>
              <span className="text-ink/40 text-base">·</span>
              <span className="font-hindi text-base text-green-700 font-medium tracking-wide">
                देश की मिट्टी के नाम
              </span>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="p-2 hover:text-terracotta transition-all duration-300 rounded-full hover:bg-warm-beige/60" 
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" strokeWidth={1.5} />
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl bg-cream border-border/50">
                  <DialogHeader>
                    <DialogTitle className="text-ink font-serif text-xl">Search Products</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSearchSubmit} className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by name, SKU, or color..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-warm-beige/50 border border-border/50 rounded-xl text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                        autoFocus
                      />
                    </div>
                  </form>
                  
                  {searching && (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                    </div>
                  )}
                  
                  {searchResults.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-80 overflow-y-auto">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSearchResultClick(product.slug)}
                          className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-warm-beige/50 transition-colors text-left"
                        >
                          {product.images?.[0] && (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-warm-beige shrink-0">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink truncate">{product.name}</p>
                            {product.sku && (
                              <p className="text-xs text-muted-foreground font-mono">SKU: {product.sku}</p>
                            )}
                            {product.specifications?.color && (
                              <p className="text-xs text-muted-foreground">Color: {product.specifications.color}</p>
                            )}
                          </div>
                          <p className="text-sm font-medium text-terracotta shrink-0">
                            ₹{product.price?.toLocaleString('en-IN')}
                          </p>
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setSearchOpen(false)
                          router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
                        }}
                        className="w-full text-center py-3 text-sm text-terracotta hover:text-terracotta/80 transition-colors"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  )}
                  
                  {searchQuery && searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No products found for "{searchQuery}"</p>
                      <p className="text-xs mt-1">Try searching by name, SKU, or color</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              
              <AuthButton />
              
              <Link 
                href="/cart"
                className="p-2 hover:text-terracotta transition-all duration-300 relative rounded-full hover:bg-warm-beige/60" 
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-terracotta text-cream text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden ml-1 hover:bg-warm-beige/60" aria-label="Menu">
                    <Menu className="w-5 h-5" strokeWidth={1.5} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-cream border-l border-border/50 w-[320px] p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <Image
                            src="/images/logo.jpg"
                            alt="Hindustani Saudagar"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <span className="font-serif text-base">Hindustani Saudagar</span>
                      </div>
                    </div>
                    <nav className="flex flex-col p-4 overflow-y-auto">
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                        </div>
                      ) : (
                        <>
                          {categories.map((category, index) => (
                            <div key={category.id}>
                              <SheetClose asChild>
                                <Link
                                  href={`/products?category=${category.slug}`}
                                  className="flex items-center justify-between text-sm font-medium text-ink hover:text-terracotta hover:bg-warm-beige/40 transition-all duration-300 py-3 px-4 rounded-lg uppercase tracking-wide"
                                  style={{ animationDelay: `${index * 50}ms` }}
                                  onClick={category.children?.length ? (e) => {
                                    e.preventDefault()
                                    toggleMobileDropdown(category.slug)
                                  } : undefined}
                                >
                                  {category.name}
                                  {category.children?.length > 0 && (
                                    <ChevronDown 
                                      className={cn(
                                        "w-4 h-4 transition-transform duration-200",
                                        mobileOpenDropdown === category.slug && "rotate-180"
                                      )} 
                                    />
                                  )}
                                </Link>
                              </SheetClose>
                              
                              {/* Mobile Dropdown */}
                              {category.children?.length > 0 && (
                                <div className={cn(
                                  "overflow-hidden transition-all duration-300 ease-in-out",
                                  mobileOpenDropdown === category.slug ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                )}>
                                  <div className="pl-4 pb-3 space-y-1">
                                    {category.children.map((child) => (
                                      <div key={child.id}>
                                        <SheetClose asChild>
                                          <Link
                                            href={`/products?category=${child.slug}`}
                                            className="block text-sm text-ink/70 hover:text-terracotta py-2 px-4 rounded-md transition-colors"
                                          >
                                            {child.name}
                                          </Link>
                                        </SheetClose>
                                        {child.children?.map((subChild) => (
                                          <SheetClose asChild key={subChild.id}>
                                            <Link
                                              href={`/products?category=${subChild.slug}`}
                                              className="block text-sm text-ink/50 hover:text-terracotta py-1.5 px-8 rounded-md transition-colors"
                                            >
                                              {subChild.name}
                                            </Link>
                                          </SheetClose>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Static Links */}
                          {staticLinks.map((link, index) => (
                            <SheetClose asChild key={link.href}>
                              <Link
                                href={link.href}
                                className="flex items-center text-sm font-medium text-ink hover:text-terracotta hover:bg-warm-beige/40 transition-all duration-300 py-3 px-4 rounded-lg uppercase tracking-wide"
                                style={{ animationDelay: `${(categories.length + index) * 50}ms` }}
                              >
                                {link.label}
                              </Link>
                            </SheetClose>
                          ))}
                        </>
                      )}
                    </nav>
                    <div className="mt-auto p-6 border-t border-border/50 bg-warm-beige/30">
                      <p className="text-sm text-muted-foreground font-light">
                        Handcrafted with love in India
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar with Dropdowns */}
      <nav className={cn(
        "hidden md:block transition-all duration-500 ease-out border-b border-border/20",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl" 
          : "bg-background"
      )}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-center gap-4 xl:gap-6 2xl:gap-8 py-3">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="relative group"
                    onMouseEnter={() => category.children?.length > 0 ? handleMouseEnter(category.slug) : undefined}
                    onMouseLeave={category.children?.length > 0 ? handleMouseLeave : undefined}
                  >
                    <Link
                      href={`/products?category=${category.slug}`}
                      className={cn(
                        "relative flex items-center gap-1 text-[13px] font-normal transition-colors tracking-wide whitespace-nowrap",
                        activeDropdown === category.slug ? "text-ink" : "text-ink/80 hover:text-ink"
                      )}
                    >
                      <span className="uppercase">{category.name}</span>
                      {category.children?.length > 0 && (
                        <ChevronDown className={cn(
                          "w-3 h-3 transition-transform duration-200",
                          activeDropdown === category.slug && "rotate-180"
                        )} />
                      )}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-terracotta transition-all duration-300 group-hover:w-full" />
                    </Link>

                    {/* Desktop Dropdown - Full width mega menu */}
                    {category.children?.length > 0 && (
                      <div
                        className={cn(
                          "absolute top-full left-0 pt-3 transition-all duration-200 ease-out z-50",
                          activeDropdown === category.slug 
                            ? "opacity-100 visible translate-y-0" 
                            : "opacity-0 invisible -translate-y-2 pointer-events-none"
                        )}
                        onMouseEnter={() => handleMouseEnter(category.slug)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-background border border-border/50 shadow-premium-lg rounded-xl p-6 min-w-[600px] max-w-[1100px]">
                          <div className={cn(
                            "grid",
                            category.children.length >= 4 ? "grid-cols-4 gap-6" :
                            category.children.length === 3 ? "grid-cols-3 gap-6" :
                            category.children.length === 2 ? "grid-cols-2 gap-6" : "grid-cols-1 gap-4"
                          )}>
                            {category.children.map((child) => (
                              <div key={child.id} className="min-w-0">
                                <Link
                                  href={`/products?category=${child.slug}`}
                                  className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 block hover:text-terracotta transition-colors"
                                >
                                  {child.name}
                                </Link>
                                <ul className="space-y-2">
                                  {child.children?.map((subChild) => (
                                    <li key={subChild.id}>
                                      <Link
                                        href={`/products?category=${subChild.slug}`}
                                        className="text-sm text-ink/70 hover:text-terracotta transition-colors block py-1"
                                      >
                                        {subChild.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Static Links */}
                {staticLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative flex items-center gap-1 text-[13px] font-normal text-ink/80 hover:text-ink transition-colors tracking-wide whitespace-nowrap group"
                  >
                    <span className="uppercase">{link.label}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-terracotta transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

function AuthButton() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-warm-beige/60 animate-pulse hidden sm:block" />
    )
  }

  if (user) {
    return <UserDropdown />
  }

  return (
    <Link
      href="/auth/login"
      className="p-2 hover:text-terracotta transition-all duration-300 rounded-full hover:bg-warm-beige/60 hidden sm:flex"
      aria-label="Account"
    >
      <User className="w-5 h-5" strokeWidth={1.5} />
    </Link>
  )
}
