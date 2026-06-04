"use client"

import { WalletBalance } from "@/components/dashboard/wallet-balance"
import { ThreatDetection } from "@/components/dashboard/threat-detection"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { SecurityScore } from "@/components/dashboard/security-score"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActions />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Wallet Balance */}
        <WalletBalance />

        {/* Security Score */}
        <SecurityScore />

        {/* Threat Detection */}
        <ThreatDetection />

        {/* Recent Transactions */}
        <RecentTransactions />
      </div>
    </div>
  )
}
