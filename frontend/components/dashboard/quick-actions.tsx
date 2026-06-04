"use client"

import { motion } from "framer-motion"
import { Send, QrCode, CreditCard, ArrowLeftRight, Plus, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const actions = [
  { icon: Send, label: "Send", color: "cyan" },
  { icon: QrCode, label: "Receive", color: "magenta" },
  { icon: CreditCard, label: "Pay", color: "green" },
  { icon: ArrowLeftRight, label: "Swap", color: "cyan" },
  { icon: Plus, label: "Top Up", color: "magenta" },
  { icon: Shield, label: "Security", color: "green" },
]

export function QuickActions() {
  return (
    <Card glowColor="cyan" className="col-span-full">
      <CardHeader>
        <CardTitle className="text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 p-4 rounded-xl glass-card border border-border/50 hover:border-neon-cyan/50 transition-all group"
            >
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all
                ${action.color === "cyan" ? "bg-neon-cyan/10 group-hover:bg-neon-cyan/20 group-hover:glow-cyan" : ""}
                ${action.color === "magenta" ? "bg-neon-magenta/10 group-hover:bg-neon-magenta/20 group-hover:glow-magenta" : ""}
                ${action.color === "green" ? "bg-neon-green/10 group-hover:bg-neon-green/20 group-hover:glow-green" : ""}
              `}>
                <action.icon className={`
                  h-6 w-6 transition-colors
                  ${action.color === "cyan" ? "text-neon-cyan" : ""}
                  ${action.color === "magenta" ? "text-neon-magenta" : ""}
                  ${action.color === "green" ? "text-neon-green" : ""}
                `} />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {action.label}
              </span>
            </motion.button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
