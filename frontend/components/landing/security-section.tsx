"use client"

import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"

export function SecuritySection() {
  return (
    <section id="security" className="relative py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-neon-green text-sm font-semibold tracking-wider uppercase">
              Security Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 font-[family-name:var(--font-orbitron)]">
              <span className="text-foreground">Real-Time </span>
              <span className="text-neon-green text-glow-green">Threat Analysis</span>
            </h2>
            <p className="text-muted-foreground mt-6 text-lg">
              Our advanced AI continuously monitors your account for suspicious activity,
              analyzing thousands of data points per second to ensure your assets remain protected.
            </p>

            {/* Security features list */}
            <div className="mt-8 space-y-4">
              <SecurityFeature 
                status="active" 
                title="Neural Network Monitoring" 
                description="24/7 AI surveillance" 
              />
              <SecurityFeature 
                status="active" 
                title="Anomaly Detection" 
                description="Behavioral pattern analysis" 
              />
              <SecurityFeature 
                status="warning" 
                title="Geo-Verification" 
                description="Location-based validation" 
              />
              <SecurityFeature 
                status="active" 
                title="Transaction Screening" 
                description="Real-time fraud prevention" 
              />
            </div>
          </motion.div>

          {/* Right side - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative"
          >
            <ThreatMonitor />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function SecurityFeature({ 
  status, 
  title, 
  description 
}: { 
  status: "active" | "warning" | "inactive"
  title: string
  description: string 
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg glass-card border border-border">
      <div className={`
        w-10 h-10 rounded-full flex items-center justify-center
        ${status === "active" ? "bg-neon-green/20" : ""}
        ${status === "warning" ? "bg-yellow-500/20" : ""}
        ${status === "inactive" ? "bg-red-500/20" : ""}
      `}>
        {status === "active" && <CheckCircle2 className="h-5 w-5 text-neon-green" />}
        {status === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
        {status === "inactive" && <XCircle className="h-5 w-5 text-red-500" />}
      </div>
      <div>
        <div className="font-medium text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div className={`
        ml-auto w-2 h-2 rounded-full pulse-glow
        ${status === "active" ? "bg-neon-green" : ""}
        ${status === "warning" ? "bg-yellow-500" : ""}
        ${status === "inactive" ? "bg-red-500" : ""}
      `} />
    </div>
  )
}

function ThreatMonitor() {
  return (
    <div className="relative aspect-square max-w-lg mx-auto">
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-neon-cyan/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Middle ring */}
      <motion.div
        className="absolute inset-8 rounded-full border-2 border-neon-magenta/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner ring */}
      <motion.div
        className="absolute inset-16 rounded-full border-2 border-neon-green/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Center shield */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-24 h-24 rounded-full bg-neon-cyan/10 flex items-center justify-center glow-cyan">
            <Shield className="h-12 w-12 text-neon-cyan" />
          </div>
        </motion.div>
      </div>

      {/* Scanning line */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left bg-gradient-to-r from-neon-cyan to-transparent" />
      </motion.div>

      {/* Threat indicators */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full bg-neon-green"
          style={{
            top: `${30 + Math.random() * 40}%`,
            left: `${30 + Math.random() * 40}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}
