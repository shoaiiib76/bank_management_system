"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Dashboard } from "@/components/dashboard"
import { AccountManagement } from "@/components/account-management"
import { Transactions } from "@/components/transactions"
import { Reports } from "@/components/reports"

export default function BankingApp() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveTab} />
      case "accounts":
        return <AccountManagement />
      case "transactions":
        return <Transactions />
      case "reports":
        return <Reports />
      default:
        return <Dashboard onNavigate={setActiveTab} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">{renderActiveComponent()}</main>
    </div>
  )
}
