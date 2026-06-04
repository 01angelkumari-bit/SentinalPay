import { Navbar } from "@/components/navbar"
import { ParticleBackground } from "@/components/particle-background"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { SecuritySection } from "@/components/landing/security-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <SecuritySection />
      <CTASection />
      <Footer />
    </main>
  )
}
