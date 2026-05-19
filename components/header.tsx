"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, User, ShoppingBag, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/store/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { UserDropdown } from "@/components/auth/user-dropdown"

interface DropdownColumn {
  title: string
  items: string[]
}

interface NavLink {
  href: string
  label: string
  hasDropdown: boolean
  dropdown?: {
    columns: DropdownColumn[]
  }
}

const navLinks: NavLink[] = [
  {
    href: "#dining",
    label: "Dining",
    hasDropdown: true,
    dropdown: {
      columns: [
        { title: "SERVEWARE", items: ["Plates & Platters", "Bowls", "Trays", "Dinner Sets"] },
        { title: "DRINKWARE", items: ["Coffee Mugs", "Tea Cups", "Kettle & Cups", "Beer Mugs", "Kullads", "Cup & Coasters"] },
        { title: "TABLEWARE", items: ["Cutlery Holders", "Toothpick Holders", "Salt & Pepper Shakers", "Napkin Holders", "Coasters"] }
      ]
    }
  },
  {
    href: "#storage",
    label: "Storage",
    hasDropdown: true,
    dropdown: {
      columns: [
        { title: "JARS", items: ["Jars & Containers", "Spice Boxes"] },
        { title: "MORE", items: ["Chopping Boards"] }
      ]
    }
  },
  {
    href: "#decor",
    label: "Decor",
    hasDropdown: true,
    dropdown: {
      columns: [
        { title: "WALL DECOR", items: ["Wall clocks", "Wall Shelves", "Wall Hangings", "Key Holders"] },
        { title: "VASES", items: ["Ceramic Vases", "Metal Vases"] }
      ]
    }
  },
  {
    href: "#bath-accessories",
    label: "Bath Accessories",
    hasDropdown: true,
    dropdown: {
      columns: [
        { title: "", items: ["Soap Dispensers", "Bathroom Sets", "Tissue Roll Holders"] }
      ]
    }
  },
  {
    href: "#lighting",
    label: "Lighting",
    hasDropdown: true,
    dropdown: {
      columns: [
        { title: "", items: ["Table Lamps", "Candle Holders"] }
      ]
    }
  },
  {
    href: "#fragrance",
    label: "Fragrance",
    hasDropdown: true,
    dropdown: {
      columns: [
        { title: "", items: ["Electric Diffusers", "Candle Diffusers", "Essential Oils"] }
      ]
    }
  },
  {
    href: "#garden",
    label: "Garden",
    hasDropdown: true,
    dropdown: {
      columns: [
        { title: "PLANTERS", items: ["Ceramic Planters", "Hanging Planters", "Wall Planters"] },
        { title: "GARDEN DECOR", items: ["Bird Feeders", "Wind Chimes", "Garden Statues"] },
        { title: "OUTDOOR", items: ["Outdoor Bowls", "Fountain Sets"] }
      ]
    }
  },
  {
    href: "#studio-art",
    label: "Studio Art",
    hasDropdown: true,
    dropdown: {
      columns: [
        { title: "ART PIECES", items: ["Sculptures", "Wall Art", "Abstract Pieces"] },
        { title: "COLLECTIBLES", items: ["Limited Edition", "Artist Series", "Signed Pieces"] }
      ]
    }
  },
  { href: "#sale", label: "Sale", hasDropdown: false },
  {
    href: "#gifting",
    label: "Gifting",
    hasDropdown: true,
    dropdown: {
      columns: [
        { title: "BY OCCASION", items: ["Wedding Gifts", "Housewarming", "Corporate Gifts", "Festive Gifts"] },
        { title: "BY PRICE", items: ["Under ₹500", "₹500-1000", "₹1000-₹2500", "Premium Gifts"] },
        { title: "GIFT SETS", items: ["Curated Sets", "DIY Kits", "Gift Cards"] }
      ]
    }
  },
  { href: "#bulk-order", label: "Bulk Order & Deals", hasDropdown: false },
]

export function Header() {
  const getTotalItems = useCart((state) => state.getTotalItems)
  const cartCount = getTotalItems()
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleMouseEnter = (href: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout)
      setDropdownTimeout(null)
    }
    setActiveDropdown(href)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
    setDropdownTimeout(timeout)
  }

  const toggleMobileDropdown = (href: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === href ? null : href)
  }

  const getDropdownWidth = (columns: DropdownColumn[]) => {
    if (columns.length >= 3) return "w-[800px]"
    if (columns.length === 2) return "w-[500px]"
    return "w-[280px]"
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
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-14 h-14 md:w-16 md:h-16 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo.jpg"
                  alt="Hindustani Saudagar"
                  fill
                  className="object-contain mix-blend-multiply"
                  priority
                />
              </div>
              <span className="font-serif text-base md:text-lg font-semibold tracking-tight text-ink">
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
              <button 
                className="p-2 hover:text-terracotta transition-all duration-300 rounded-full hover:bg-warm-beige/60" 
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              
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
                        <div className="relative w-14 h-14">
                          <Image
                            src="/images/logo.jpg"
                            alt="Hindustani Saudagar"
                            fill
                            className="object-contain mix-blend-multiply"
                          />
                        </div>
                        <span className="font-serif text-lg">Hindustani Saudagar</span>
                      </div>
                    </div>
                    <nav className="flex flex-col p-4 overflow-y-auto">
                      {navLinks.map((link, index) => (
                        <div key={link.href}>
                          <SheetClose asChild>
                            <Link
                              href={link.href}
                              className="flex items-center justify-between text-sm font-medium text-ink hover:text-terracotta hover:bg-warm-beige/40 transition-all duration-300 py-3 px-4 rounded-lg uppercase tracking-wide"
                              style={{ animationDelay: `${index * 50}ms` }}
                              onClick={!link.hasDropdown ? undefined : (e) => {
                                e.preventDefault()
                                toggleMobileDropdown(link.href)
                              }}
                            >
                              {link.label}
                              {link.hasDropdown && (
                                <ChevronDown 
                                  className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    mobileOpenDropdown === link.href && "rotate-180"
                                  )} 
                                />
                              )}
                            </Link>
                          </SheetClose>
                          
                          {/* Mobile Dropdown */}
                          {link.hasDropdown && link.dropdown && (
                            <div className={cn(
                              "overflow-hidden transition-all duration-300 ease-in-out",
                              mobileOpenDropdown === link.href ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                            )}>
                              <div className="pl-4 pb-3 space-y-1">
                                {link.dropdown.columns.map((column, colIndex) => (
                                  <div key={colIndex} className="mb-3">
                                    {column.title && (
                                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">
                                        {column.title}
                                      </p>
                                    )}
                                    {column.items.map((item, itemIndex) => (
                                      <SheetClose asChild key={itemIndex}>
                                        <Link
                                          href={`${link.href}/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                          className="block text-sm text-ink/70 hover:text-terracotta py-2 px-4 rounded-md transition-colors"
                                        >
                                          {item}
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
        "hidden md:block transition-all duration-500 ease-out border-b border-border/20 relative",
        isScrolled 
          ? "bg-background/95 backdrop-blur-xl" 
          : "bg-background"
      )}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-center gap-4 xl:gap-6 2xl:gap-8 py-3">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => link.hasDropdown && handleMouseEnter(link.href)}
                onMouseLeave={link.hasDropdown ? handleMouseLeave : undefined}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative flex items-center gap-1 text-[13px] font-normal transition-colors tracking-wide whitespace-nowrap group",
                    activeDropdown === link.href ? "text-ink" : "text-ink/80 hover:text-ink"
                  )}
                >
                  <span className="uppercase">{link.label}</span>
                  {link.hasDropdown && (
                    <ChevronDown className={cn(
                      "w-3 h-3 transition-transform duration-200",
                      activeDropdown === link.href && "rotate-180"
                    )} />
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-terracotta transition-all duration-300 group-hover:w-full" />
                </Link>

                {/* Desktop Dropdown */}
                {link.hasDropdown && link.dropdown && (
                  <div className={cn(
                    "absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ease-out",
                    activeDropdown === link.href 
                      ? "opacity-100 visible translate-y-0" 
                      : "opacity-0 invisible -translate-y-2"
                  )}>
                    <div className={cn(
                      "bg-background border border-border/50 shadow-premium-lg rounded-lg overflow-hidden",
                      getDropdownWidth(link.dropdown.columns)
                    )}>
                      <div className={cn(
                        "grid p-6",
                        link.dropdown.columns.length >= 3 ? "grid-cols-3 gap-8" :
                        link.dropdown.columns.length === 2 ? "grid-cols-2 gap-8" : "grid-cols-1 gap-4"
                      )}>
                        {link.dropdown.columns.map((column, colIndex) => (
                          <div key={colIndex} className="min-w-0">
                            {column.title && (
                              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3 whitespace-nowrap">
                                {column.title}
                              </h3>
                            )}
                            <ul className="space-y-2">
                              {column.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <Link
                                    href={`${link.href}/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                    className="text-sm text-ink/70 hover:text-terracotta transition-colors block py-1 whitespace-nowrap"
                                  >
                                    {item}
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
          </div>
        </div>

        {/* Invisible bridge to prevent dropdown from closing */}
        {activeDropdown && (
          <div 
            className="absolute top-full left-0 right-0 h-3"
            onMouseEnter={() => {}}
            onMouseLeave={handleMouseLeave}
          />
        )}
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
