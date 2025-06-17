"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BarChart3, FileText, Download, RefreshCw, TrendingUp, Users, DollarSign, Calendar } from "lucide-react"
import { bankService } from "@/lib/bank-service"
import type { Account, BankStats } from "@/types/account"

export function Reports() {
  const [stats, setStats] = useState<BankStats>({
    totalAccounts: 0,
    totalBalance: 0,
    savingsAccounts: 0,
    checkingAccounts: 0,
    businessAccounts: 0,
  })
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    generateReports()
  }, [])

  const generateReports = () => {
    setIsLoading(true)
    setTimeout(() => {
      const bankStats = bankService.getStats()
      const allAccounts = bankService.getAllAccounts()
      setStats(bankStats)
      setAccounts(allAccounts)
      setIsLoading(false)
    }, 500)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Savings":
        return "bg-green-100 text-green-800"
      case "Checking":
        return "bg-blue-100 text-blue-800"
      case "Business":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const calculateAverageBalance = () => {
    return stats.totalAccounts > 0 ? stats.totalBalance / stats.totalAccounts : 0
  }

  const getAccountTypeBreakdown = () => {
    const breakdown = [
      { type: "Savings", count: stats.savingsAccounts, color: "#10b981" },
      { type: "Checking", count: stats.checkingAccounts, color: "#3b82f6" },
      { type: "Business", count: stats.businessAccounts, color: "#8b5cf6" },
    ]
    return breakdown.filter((item) => item.count > 0)
  }

  const getTopAccounts = () => {
    return accounts.sort((a, b) => b.balance - a.balance).slice(0, 5)
  }

  const getTotalTransactions = () => {
    return accounts.reduce((total, account) => total + account.transactionHistory.length, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bank Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive banking system overview</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={generateReports} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Bank Management System Report</CardTitle>
              <p className="text-blue-100">
                Generated on{" "}
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <FileText className="h-8 w-8" />
          </div>
        </CardHeader>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Accounts</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalAccounts}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Balance</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalBalance)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Balance</p>
                <p className="text-3xl font-bold text-purple-600">{formatCurrency(calculateAverageBalance())}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <p className="text-3xl font-bold text-orange-600">{getTotalTransactions()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Account Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAccountTypeBreakdown().map((item) => {
                const percentage = stats.totalAccounts > 0 ? ((item.count / stats.totalAccounts) * 100).toFixed(1) : 0
                return (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium">{item.type} Accounts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{percentage}%</span>
                        <Badge variant="outline">{item.count}</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
              {getAccountTypeBreakdown().length === 0 && (
                <p className="text-gray-500 text-center py-4">No account data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Accounts by Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Accounts by Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopAccounts().map((account, index) => (
                <div
                  key={account.accountNumber}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{account.accountHolder}</p>
                      <p className="text-sm text-gray-500">{account.accountNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(account.balance)}</p>
                    <Badge className={getAccountTypeColor(account.accountType)}>{account.accountType}</Badge>
                  </div>
                </div>
              ))}
              {getTopAccounts().length === 0 && <p className="text-gray-500 text-center py-4">No accounts available</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Account List */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.accountNumber}>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-semibold">{account.accountNumber}</p>
                      <p className="text-gray-600">{account.accountHolder}</p>
                    </div>
                    <Badge className={getAccountTypeColor(account.accountType)}>{account.accountType}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(account.balance)}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Created: {account.createdDate.toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500">{account.transactionHistory.length} transactions</p>
                  </div>
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">No accounts found in the system</p>
                <p className="text-sm text-gray-400">Use the Account Management section to create new accounts</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Footer */}
      <Card>
        <CardContent className="p-6 bg-gray-50">
          <div className="text-center">
            <Separator className="mb-4" />
            <p className="text-sm text-gray-500">End of Report - Bank Management System Analytics</p>
            <p className="text-xs text-gray-400 mt-1">
              This report provides a comprehensive overview of all banking activities and account statuses
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
