"use client"

import { motion } from "framer-motion"
import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface DashboardHeaderProps {
  onMenuClick?: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const [hasNotifications] = useState(true)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 glass border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-orbitron)]">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, Agent Chen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-9 w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-neon-magenta pulse-glow" />
            )}
          </button>

          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border border-neon-green/30">
            <div className="w-2 h-2 rounded-full bg-neon-green pulse-glow" />
            <span className="text-xs text-neon-green font-medium">System Secure</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
