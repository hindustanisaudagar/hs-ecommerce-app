'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const marketplaces = [
  {
    name: 'Pepperfry',
    logo: '/images/marketplaces/pepperfry.svg',
    url: 'https://www.pepperfry.com',
  },
  {
    name: 'JioMart',
    logo: '/images/marketplaces/jiomart.svg',
    url: 'https://www.jiomart.com',
  },
  {
    name: 'Myntra',
    logo: '/images/marketplaces/myntra.svg',
    url: 'https://www.myntra.com',
  },
  {
    name: 'Amazon',
    logo: '/images/marketplaces/amazon.svg',
    url: 'https://www.amazon.in',
  },
  {
    name: 'Flipkart',
    logo: '/images/marketplaces/flipkart.svg',
    url: 'https://www.flipkart.com',
  },
  {
    name: 'Wooden Street',
    logo: '/images/marketplaces/wooden-street.svg',
    url: 'https://www.woodenstreet.com',
  },
]

export function Marketplaces() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 3

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % marketplaces.length)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getVisibleItems = () => {
    const items = []
    for (let i = 0; i < itemsPerView; i++) {
      const index = (currentIndex + i) % marketplaces.length
      items.push(marketplaces[index])
    }
    return items
  }

  return (
    <section className="py-16 md:py-20 bg-cream/50">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Reveal>
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
              Available On
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-ink tracking-tight">
              Find Us On
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative overflow-hidden">
            <div className="flex items-center justify-center gap-8 md:gap-16 transition-all duration-500 ease-in-out">
              {getVisibleItems().map((marketplace, index) => (
                <a
                  key={`${marketplace.name}-${currentIndex}-${index}`}
                  href={marketplace.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-4 group min-w-[120px] md:min-w-[160px]"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-cream shadow-premium flex items-center justify-center p-6 group-hover:shadow-premium-lg group-hover:scale-105 transition-all duration-300">
                    <div className="relative w-full h-full">
                      <Image
                        src={marketplace.logo}
                        alt={marketplace.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground font-medium group-hover:text-terracotta transition-colors">
                    {marketplace.name}
                  </span>
                </a>
              ))}
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {marketplaces.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-terracotta w-6'
                      : 'bg-border/50 hover:bg-terracotta/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
