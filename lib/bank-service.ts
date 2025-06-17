import type { Account, Transaction, BankStats } from "@/types/account"

class BankService {
  private accounts: Map<string, Account> = new Map()

  constructor() {
    this.loadSampleData()
  }

  createAccount(
    accountNumber: string,
    accountHolder: string,
    initialBalance: number,
    accountType: Account["accountType"],
  ): boolean {
    if (this.accounts.has(accountNumber)) {
      return false
    }

    const account: Account = {
      accountNumber,
      accountHolder,
      balance: initialBalance,
      accountType,
      createdDate: new Date(),
      transactionHistory: [],
    }

    this.addTransaction(account, "created", initialBalance, `Account created with initial balance: $${initialBalance}`)
    this.accounts.set(accountNumber, account)
    return true
  }

  getAccount(accountNumber: string): Account | undefined {
    return this.accounts.get(accountNumber)
  }

  getAllAccounts(): Account[] {
    return Array.from(this.accounts.values())
  }

  deposit(accountNumber: string, amount: number): boolean {
    const account = this.accounts.get(accountNumber)
    if (!account || amount <= 0) return false

    account.balance += amount
    this.addTransaction(account, "deposit", amount, `Deposited: $${amount}`)
    return true
  }

  withdraw(accountNumber: string, amount: number): boolean {
    const account = this.accounts.get(accountNumber)
    if (!account || amount <= 0 || amount > account.balance) return false

    account.balance -= amount
    this.addTransaction(account, "withdrawal", amount, `Withdrawn: $${amount}`)
    return true
  }

  private addTransaction(account: Account, type: Transaction["type"], amount: number, description: string) {
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      amount,
      description,
      balanceAfter: account.balance,
    }
    account.transactionHistory.push(transaction)
  }

  getStats(): BankStats {
    const accounts = this.getAllAccounts()
    return {
      totalAccounts: accounts.length,
      totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
      savingsAccounts: accounts.filter((acc) => acc.accountType === "Savings").length,
      checkingAccounts: accounts.filter((acc) => acc.accountType === "Checking").length,
      businessAccounts: accounts.filter((acc) => acc.accountType === "Business").length,
    }
  }

  private loadSampleData() {
    // Sample accounts
    const sampleAccounts = [
      { number: "ACC001", holder: "John Smith", balance: 5000, type: "Savings" as const },
      { number: "ACC002", holder: "Jane Doe", balance: 3500, type: "Checking" as const },
      { number: "ACC003", holder: "Bob Johnson", balance: 10000, type: "Business" as const },
      { number: "ACC004", holder: "Alice Williams", balance: 2500, type: "Savings" as const },
    ]

    sampleAccounts.forEach((acc) => {
      this.createAccount(acc.number, acc.holder, acc.balance, acc.type)
    })

    // Add sample transactions
    this.deposit("ACC001", 500)
    this.withdraw("ACC001", 200)
    this.deposit("ACC002", 1000)
    this.withdraw("ACC003", 500)
  }
}

export const bankService = new BankService()
