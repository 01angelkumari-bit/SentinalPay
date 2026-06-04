"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Lock, Eye, Cpu, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "AI Threat Detection",
    description: "Real-time monitoring powered by neural networks identifies and neutralizes threats before they impact your assets.",
    color: "cyan" as const,
  },
  {
    icon: Lock,
    title: "Quantum Encryption",
    description: "Military-grade encryption protocols ensure your transactions remain secure against even the most advanced attacks.",
    color: "magenta" as const,
  },
  {
    icon: Zap,
    title: "Instant Transfers",
    description: "Lightning-fast transaction processing with sub-second confirmation times across all major networks.",
    color: "green" as const,
  },
  {
    icon: Eye,
    title: "Biometric Security",
    description: "Multi-factor authentication with facial recognition and fingerprint scanning for uncompromised access control.",
    color: "cyan" as const,
  },
  {
    icon: Cpu,
    title: "Smart Analytics",
    description: "Advanced machine learning algorithms analyze patterns to predict and prevent fraudulent activities.",
    color: "magenta" as const,
  },
  {
    icon: Wallet,
    title: "Multi-Currency",
    description: "Seamless support for traditional and digital currencies with automatic conversion and optimal exchange rates.",
    color: "green" as const,
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-neon-magenta text-sm font-semibold tracking-wider uppercase">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-4 font-[family-name:var(--font-orbitron)]">
            <span className="text-foreground">Advanced </span>
            <span className="text-neon-cyan text-glow-cyan">Security Suite</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Cutting-edge technology designed to protect your assets and streamline your financial operations.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card glowColor={feature.color} className="h-full">
                <CardHeader>
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center mb-4
                    ${feature.color === "cyan" ? "bg-neon-cyan/10 text-neon-cyan" : ""}
                    ${feature.color === "magenta" ? "bg-neon-magenta/10 text-neon-magenta" : ""}
                    ${feature.color === "green" ? "bg-neon-green/10 text-neon-green" : ""}
                  `}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className={`
                    ${feature.color === "cyan" ? "text-neon-cyan" : ""}
                    ${feature.color === "magenta" ? "text-neon-magenta" : ""}
                    ${feature.color === "green" ? "text-neon-green" : ""}
                  `}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
