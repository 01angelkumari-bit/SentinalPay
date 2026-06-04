"use client"

import { motion } from "framer-motion"
import { Wallet, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export function WalletBalance() {
  const [isHidden, setIsHidden] = useState(false)
  const balance = 124589.47
  const change = 12.5

  return (
    <Card glowColor="cyan" className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-neon-cyan/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-neon-cyan" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
            <p className="text-xs text-muted-foreground/60">All wallets combined</p>
          </div>
        </div>
        <button
          onClick={() => setIsHidden(!isHidden)}
          className="text-muted-foreground hover:text-neon-cyan transition-colors"
        >
          {isHidden ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <motion.div
              key={isHidden ? "hidden" : "visible"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-neon-cyan text-glow-cyan font-[family-name:var(--font-orbitron)]"
            >
              {isHidden ? "••••••••" : `$${balance.toLocaleString()}`}
            </motion.div>
            <div className="flex items-center gap-2 mt-2">
              <div className={`flex items-center gap-1 text-sm ${change >= 0 ? "text-neon-green" : "text-destructive"}`}>
                {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{change >= 0 ? "+" : ""}{change}%</span>
              </div>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>

          {/* Mini chart visualization */}
          <div className="flex items-end gap-1 h-16">
            {[40, 65, 45, 70, 55, 80, 75, 90, 85, 95].map((height, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="w-2 bg-gradient-to-t from-neon-cyan/50 to-neon-cyan rounded-t"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
