export function Marquee() {
  const items = [
    "Hand-thrown",
    "Kiln-fired", 
    "Studio-finished",
    "Made in India",
    "Artisan Crafted",
    "Sustainable",
    "One-of-a-kind",
    "Heritage Techniques"
  ]

  return (
    <div className="bg-ink py-5 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(2)].map((_, setIndex) => (
          <div key={setIndex} className="flex items-center">
            {items.map((item, index) => (
              <div key={`${setIndex}-${index}`} className="flex items-center">
                <span className="text-[13px] font-light tracking-[0.2em] text-cream/80 uppercase">
                  {item}
                </span>
                <span className="mx-8 text-terracotta-light text-lg">✦</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
