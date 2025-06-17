"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/ui/stat-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, PiggyBank, Building2, TrendingUp, Activity } from "lucide-react"
import { bankService } from "@/lib/bank-service"
import type { BankStats, Account } from "@/types/account"

interface DashboardProps {
  onNavigate: (tab: string) => void
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<BankStats>({
    totalAccounts: 0,
    totalBalance: 0,
    savingsAccounts: 0,
    checkingAccounts: 0,
    businessAccounts: 0,
  })
  const [recentAccounts, setRecentAccounts] = useState<Account[]>([])

  useEffect(() => {
    const bankStats = bankService.getStats()
    setStats(bankStats)

    const accounts = bankService
      .getAllAccounts()
      .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
      .slice(0, 5)
    setRecentAccounts(accounts)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bank Management Dashboard</h1>
            <p className="text-blue-100">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span className="text-sm">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Accounts"
          value={stats.totalAccounts.toString()}
          icon={Users}
          color="#3b82f6"
          trend={{ value: "+12%", isPositive: true }}
        />
        <StatCard
          title="Total Balance"
          value={formatCurrency(stats.totalBalance)}
          icon={DollarSign}
          color="#10b981"
          trend={{ value: "+8.2%", isPositive: true }}
        />
        <StatCard title="Savings Accounts" value={stats.savingsAccounts.toString()} icon={PiggyBank} color="#8b5cf6" />
        <StatCard
          title="Business Accounts"
          value={stats.businessAccounts.toString()}
          icon={Building2}
          color="#f59e0b"
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => onNavigate("accounts")} className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Create New Account
            </Button>
            <Button onClick={() => onNavigate("transactions")} className="w-full justify-start" variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Process Transaction
            </Button>
            <Button onClick={() => onNavigate("reports")} className="w-full justify-start" variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
          </CardContent>
        </Card>

        {/* Recent Accounts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAccounts.map((account) => (
                <div
                  key={account.accountNumber}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{account.accountHolder}</p>
                    <p className="text-sm text-gray-500">
                      {account.accountNumber} • {account.accountType}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(account.balance)}</p>
                    <p className="text-xs text-gray-500">{account.createdDate.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {recentAccounts.length === 0 && <p className="text-gray-500 text-center py-4">No accounts found</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
