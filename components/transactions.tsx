"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, ArrowUpCircle, ArrowDownCircle, History, DollarSign, Calendar } from "lucide-react"
import { bankService } from "@/lib/bank-service"
import type { Account, Transaction } from "@/types/account"

export function Transactions() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [amount, setAmount] = useState("")
  const [currentBalance, setCurrentBalance] = useState(0)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [selectedAccountForHistory, setSelectedAccountForHistory] = useState<Account | null>(null)

  useEffect(() => {
    loadAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      const account = bankService.getAccount(selectedAccount)
      setCurrentBalance(account?.balance || 0)
    }
  }, [selectedAccount])

  const loadAccounts = () => {
    setAccounts(bankService.getAllAccounts())
  }

  const handleTransaction = (isDeposit: boolean) => {
    if (!selectedAccount) {
      showAlert("error", "Please select an account")
      return
    }

    const transactionAmount = Number.parseFloat(amount)
    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      showAlert("error", "Please enter a valid amount")
      return
    }

    let success = false
    if (isDeposit) {
      success = bankService.deposit(selectedAccount, transactionAmount)
      if (success) {
        showAlert("success", `Deposit of ${formatCurrency(transactionAmount)} successful!`)
      }
    } else {
      success = bankService.withdraw(selectedAccount, transactionAmount)
      if (success) {
        showAlert("success", `Withdrawal of ${formatCurrency(transactionAmount)} successful!`)
      } else {
        showAlert("error", "Insufficient funds!")
      }
    }

    if (success) {
      setAmount("")
      const updatedAccount = bankService.getAccount(selectedAccount)
      setCurrentBalance(updatedAccount?.balance || 0)
      loadAccounts()
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

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return <ArrowUpCircle className="h-4 w-4 text-green-600" />
      case "withdrawal":
        return <ArrowDownCircle className="h-4 w-4 text-red-600" />
      default:
        return <DollarSign className="h-4 w-4 text-blue-600" />
    }
  }

  const getTransactionColor = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return "text-green-600"
      case "withdrawal":
        return "text-red-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Account Transactions</h2>
          <p className="text-gray-600">Process deposits and withdrawals</p>
        </div>
        <CreditCard className="h-8 w-8 text-blue-600" />
      </div>

      {alert && (
        <Alert className={alert.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Process Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="account">Select Account</Label>
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map((account) => (
                      <SelectItem key={account.accountNumber} value={account.accountNumber}>
                        {account.accountNumber} - {account.accountHolder} ({account.accountType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAccount && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Current Balance</span>
                    <span className="text-2xl font-bold text-blue-900">{formatCurrency(currentBalance)}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter transaction amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  onClick={() => handleTransaction(true)}
                  disabled={!selectedAccount || !amount}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
                <Button
                  onClick={() => handleTransaction(false)}
                  disabled={!selectedAccount || !amount}
                  variant="destructive"
                  className="flex-1"
                >
                  <ArrowDownCircle className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.slice(0, 3).map((account) => (
                <div key={account.accountNumber} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{account.accountHolder}</span>
                    <Badge variant="outline">{account.accountType}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{account.accountNumber}</span>
                    <span className="font-semibold">{formatCurrency(account.balance)}</span>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setSelectedAccountForHistory(account)}
                      >
                        <History className="h-3 w-3 mr-1" />
                        View History
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Transaction History - {selectedAccountForHistory?.accountNumber}</DialogTitle>
                      </DialogHeader>
                      {selectedAccountForHistory && (
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Account Holder</p>
                                <p className="font-medium">{selectedAccountForHistory.accountHolder}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Current Balance</p>
                                <p className="font-bold text-green-600">
                                  {formatCurrency(selectedAccountForHistory.balance)}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="font-medium">Transaction History</h4>
                            {selectedAccountForHistory.transactionHistory.length === 0 ? (
                              <p className="text-gray-500 text-center py-8">No transactions found</p>
                            ) : (
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {selectedAccountForHistory.transactionHistory
                                  .slice()
                                  .reverse()
                                  .map((transaction) => (
                                    <div
                                      key={transaction.id}
                                      className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                      <div className="flex items-center space-x-3">
                                        {getTransactionIcon(transaction.type)}
                                        <div>
                                          <p className="font-medium text-sm">{transaction.description}</p>
                                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                                            <Calendar className="h-3 w-3" />
                                            <span>{transaction.timestamp.toLocaleString()}</span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                                          {transaction.type === "withdrawal" ? "-" : "+"}
                                          {formatCurrency(transaction.amount)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          Balance: {formatCurrency(transaction.balanceAfter)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ))}

              {accounts.length === 0 && <p className="text-gray-500 text-center py-4">No accounts available</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
