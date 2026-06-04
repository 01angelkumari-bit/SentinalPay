"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const securityMetrics = [
  { label: "Password Strength", value: 95, color: "cyan" },
  { label: "2FA Enabled", value: 100, color: "green" },
  { label: "Device Trust", value: 85, color: "cyan" },
  { label: "Activity Score", value: 90, color: "green" },
]

export function SecurityScore() {
  const overallScore = 92

  return (
    <Card glowColor="green" className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <div className="w-12 h-12 rounded-lg bg-neon-green/10 flex items-center justify-center">
          <Shield className="h-6 w-6 text-neon-green" />
        </div>
        <div>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Security Score
          </CardTitle>
          <p className="text-xs text-muted-foreground/60">Account protection level</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          {/* Circular progress */}
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              {/* Progress circle */}
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-neon-green"
                initial={{ strokeDasharray: "0 352" }}
                animate={{ strokeDasharray: `${(overallScore / 100) * 352} 352` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-neon-green text-glow-green font-[family-name:var(--font-orbitron)]"
              >
                {overallScore}
              </motion.span>
              <span className="text-xs text-muted-foreground">Excellent</span>
            </div>
          </div>

          {/* Metrics list */}
          <div className="flex-1 space-y-3">
            {securityMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">{metric.label}</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className={`h-3 w-3 ${
                      metric.color === "green" ? "text-neon-green" : "text-neon-cyan"
                    }`} />
                    <span className="text-sm font-medium text-foreground">{metric.value}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full rounded-full ${
                      metric.color === "green" ? "bg-neon-green" : "bg-neon-cyan"
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
