"use client"

import { motion } from "framer-motion"
import { ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 glass-card" />
          <div className="absolute inset-0 holographic opacity-30" />
          
          {/* Border glow */}
          <div className="absolute inset-0 rounded-2xl border border-neon-cyan/30 neon-border-animated" />

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="w-20 h-20 mx-auto mb-8 rounded-full bg-neon-cyan/10 flex items-center justify-center glow-cyan"
            >
              <Shield className="h-10 w-10 text-neon-cyan" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-orbitron)]">
              <span className="text-foreground">Ready to </span>
              <span className="text-neon-cyan text-glow-cyan">Secure Your Future?</span>
            </h2>
            
            <p className="text-muted-foreground mt-6 max-w-2xl mx-auto text-lg">
              Join thousands of users who trust SentinalPay to protect their digital assets.
              Start your free trial today and experience next-generation financial security.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link href="/register">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground mt-6">
              No credit card required. 14-day free trial.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
