import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Marquee } from "@/components/marquee"
import { TrustBar } from "@/components/trust-bar"
import { Categories } from "@/components/categories"
import { StudioBanner } from "@/components/studio-banner"
import { Bestsellers } from "@/components/bestsellers"
import { BrandStory } from "@/components/brand-story"
import { ArtisanProcess } from "@/components/artisan-process"
import { Reviews } from "@/components/reviews"
import { InstagramGallery } from "@/components/instagram-gallery"
import { Newsletter } from "@/components/newsletter"
import { Marketplaces } from "@/components/marketplaces"
import { Footer } from "@/components/footer"
import { ChatButton } from "@/components/chat-button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Marquee />
      <TrustBar />
      <Categories />
      <StudioBanner />
      <Bestsellers />
      <BrandStory />
      <ArtisanProcess />
      <Reviews />
        <InstagramGallery />
        <Newsletter />
        <Marketplaces />
        <Footer />
      <ChatButton />
    </main>
  )
}
