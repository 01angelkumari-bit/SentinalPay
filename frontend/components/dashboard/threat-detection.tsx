"use client"

import { motion } from "framer-motion"
import { Shield, AlertTriangle, CheckCircle2, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const threats = [
  { id: 1, type: "Blocked", message: "Suspicious login attempt from Unknown Location", time: "2 min ago", severity: "high" },
  { id: 2, type: "Warning", message: "Unusual transaction pattern detected", time: "15 min ago", severity: "medium" },
  { id: 3, type: "Resolved", message: "IP verification completed", time: "1 hour ago", severity: "low" },
]

export function ThreatDetection() {
  return (
    <Card glowColor="magenta" className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-neon-magenta/10 flex items-center justify-center relative">
            <Shield className="h-6 w-6 text-neon-magenta" />
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-neon-magenta/50"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Threat Detection
            </CardTitle>
            <p className="text-xs text-muted-foreground/60">Real-time monitoring active</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-neon-green" />
          <span className="text-xs text-neon-green">LIVE</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {threats.map((threat, index) => (
            <motion.div
              key={threat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-card/50 border border-border/50"
            >
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center shrink-0
                ${threat.severity === "high" ? "bg-destructive/20" : ""}
                ${threat.severity === "medium" ? "bg-yellow-500/20" : ""}
                ${threat.severity === "low" ? "bg-neon-green/20" : ""}
              `}>
                {threat.severity === "high" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                {threat.severity === "medium" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                {threat.severity === "low" && <CheckCircle2 className="h-4 w-4 text-neon-green" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`
                    text-xs font-medium px-2 py-0.5 rounded
                    ${threat.severity === "high" ? "bg-destructive/20 text-destructive" : ""}
                    ${threat.severity === "medium" ? "bg-yellow-500/20 text-yellow-500" : ""}
                    ${threat.severity === "low" ? "bg-neon-green/20 text-neon-green" : ""}
                  `}>
                    {threat.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{threat.time}</span>
                </div>
                <p className="text-sm text-foreground mt-1 truncate">{threat.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
