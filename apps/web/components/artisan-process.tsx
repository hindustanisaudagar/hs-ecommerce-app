import { Reveal } from "@/components/reveal"

const steps = [
  {
    number: "01",
    title: "Source the clay",
    description: "We work with local clay sources across India, each region lending its unique texture and color to the final piece.",
  },
  {
    number: "02",
    title: "Throw the form",
    description: "Master potters shape each piece on traditional wheels, using techniques passed down through generations.",
  },
  {
    number: "03",
    title: "Glaze & fire",
    description: "Natural glazes and carefully controlled kiln temperatures transform raw clay into durable ceramics.",
  },
  {
    number: "04",
    title: "Hand-finish",
    description: "Every piece is inspected, refined, and finished by hand before earning the HS mark of quality.",
  },
]

export function ArtisanProcess() {
  return (
    <section className="py-24 md:py-32 bg-cream grain-texture">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <Reveal>
          <div className="text-center mb-20">
            <p className="text-[10px] uppercase tracking-[0.3em] text-terracotta mb-4 font-medium">
              The Process
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink tracking-tight">
              From <span className="italic">earth</span> to your{" "}
              <span className="italic">home</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 100}>
              <div className="relative group">
                {/* Connector line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-[1px] bg-gradient-to-r from-border to-transparent -translate-x-4" />
                )}
                
                <div className="text-center lg:text-left">
                  {/* Number with circle */}
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-warm-beige/50 border border-border/50 mb-6 group-hover:bg-warm-beige group-hover:border-terracotta/20 transition-all duration-500">
                    <p className="text-4xl font-serif font-light text-terracotta">
                      {step.number}
                    </p>
                  </div>
                  
                  <h3 className="font-serif text-xl md:text-2xl text-ink mb-4 group-hover:text-terracotta transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-muted-foreground font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
