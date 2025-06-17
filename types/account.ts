export interface Account {
  accountNumber: string
  accountHolder: string
  balance: number
  accountType: "Savings" | "Checking" | "Business"
  createdDate: Date
  transactionHistory: Transaction[]
}

export interface Transaction {
  id: string
  timestamp: Date
  type: "deposit" | "withdrawal" | "created"
  amount: number
  description: string
  balanceAfter: number
}

export interface BankStats {
  totalAccounts: number
  totalBalance: number
  savingsAccounts: number
  checkingAccounts: number
  businessAccounts: number
}
