"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, Search, Eye, Calendar, DollarSign } from "lucide-react"
import { bankService } from "@/lib/bank-service"
import type { Account } from "@/types/account"

export function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    accountNumber: "",
    accountHolder: "",
    initialBalance: "",
    accountType: "" as Account["accountType"] | "",
  })

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = () => {
    setAccounts(bankService.getAllAccounts())
  }

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.accountNumber || !formData.accountHolder || !formData.initialBalance || !formData.accountType) {
      showAlert("error", "Please fill in all fields")
      return
    }

    const balance = Number.parseFloat(formData.initialBalance)
    if (isNaN(balance) || balance < 0) {
      showAlert("error", "Please enter a valid initial balance")
      return
    }

    const success = bankService.createAccount(
      formData.accountNumber,
      formData.accountHolder,
      balance,
      formData.accountType as Account["accountType"],
    )

    if (success) {
      showAlert("success", "Account created successfully!")
      setFormData({
        accountNumber: "",
        accountHolder: "",
        initialBalance: "",
        accountType: "",
      })
      loadAccounts()
    } else {
      showAlert("error", "Account number already exists!")
    }
  }

  const showAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 3000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountHolder.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
          <p className="text-gray-600">Create and manage bank accounts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">{accounts.length} Total Accounts</span>
        </div>
      </div>

      {alert && (
        <Alert className={alert.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Account Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create New Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountHolder">Account Holder</Label>
                <Input
                  id="accountHolder"
                  placeholder="Enter account holder name"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialBalance">Initial Balance</Label>
                <Input
                  id="initialBalance"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter initial balance"
                  value={formData.initialBalance}
                  onChange={(e) => setFormData({ ...formData, initialBalance: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountType">Account Type</Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(value) => setFormData({ ...formData, accountType: value as Account["accountType"] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Checking">Checking</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Account
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account List */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Accounts</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAccounts.map((account) => (
                <div
                  key={account.accountNumber}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedAccount?.accountNumber === account.accountNumber
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                  onClick={() => setSelectedAccount(account)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{account.accountHolder}</p>
                      <p className="text-sm text-gray-500">{account.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={getAccountTypeColor(account.accountType)}>{account.accountType}</Badge>
                      <p className="text-sm font-semibold mt-1">{formatCurrency(account.balance)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredAccounts.length === 0 && <p className="text-gray-500 text-center py-8">No accounts found</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Details */}
      {selectedAccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Account Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Account Number</Label>
                  <p className="text-lg font-semibold">{selectedAccount.accountNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Account Holder</Label>
                  <p className="text-lg">{selectedAccount.accountHolder}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Account Type</Label>
                  <Badge className={getAccountTypeColor(selectedAccount.accountType)}>
                    {selectedAccount.accountType}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Current Balance</Label>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedAccount.balance)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created Date</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p>{selectedAccount.createdDate.toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Total Transactions</Label>
                  <p className="text-lg">{selectedAccount.transactionHistory.length}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <Label className="text-sm font-medium text-gray-500 mb-3 block">Recent Transactions</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedAccount.transactionHistory
                  .slice(-5)
                  .reverse()
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{transaction.description}</span>
                      </div>
                      <span className="text-xs text-gray-500">{transaction.timestamp.toLocaleDateString()}</span>
                    </div>
                  ))}
                {selectedAccount.transactionHistory.length === 0 && (
                  <p className="text-gray-500 text-sm">No transactions yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
