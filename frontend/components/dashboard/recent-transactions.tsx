"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const transactions = [
  { id: 1, type: "received", name: "Alex Chen", amount: 2450.00, time: "Today, 2:34 PM", status: "completed" },
  { id: 2, type: "sent", name: "Cloud Services", amount: -189.99, time: "Today, 11:20 AM", status: "completed" },
  { id: 3, type: "received", name: "Freelance Payment", amount: 5200.00, time: "Yesterday", status: "completed" },
  { id: 4, type: "sent", name: "Security Upgrade", amount: -499.00, time: "Yesterday", status: "pending" },
  { id: 5, type: "received", name: "Investment Return", amount: 1850.00, time: "2 days ago", status: "completed" },
]

export function RecentTransactions() {
  return (
    <Card glowColor="cyan" className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Recent Transactions</CardTitle>
        <button className="text-muted-foreground hover:text-neon-cyan transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${tx.type === "received" ? "bg-neon-green/10" : "bg-neon-magenta/10"}
                `}>
                  {tx.type === "received" ? (
                    <ArrowDownLeft className="h-5 w-5 text-neon-green" />
                  ) : (
                    <ArrowUpRight className="h-5 w-5 text-neon-magenta" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{tx.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold font-[family-name:var(--font-orbitron)] ${
                  tx.amount > 0 ? "text-neon-green" : "text-foreground"
                }`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                </p>
                <p className={`text-xs ${tx.status === "completed" ? "text-neon-green" : "text-yellow-500"}`}>
                  {tx.status}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
