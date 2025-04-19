"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

interface Expense {
  _id: string
  amount: number
  category: string
  description: string
  date: string
  createdAt: string
}

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/expenses")

      if (!response.ok) {
        throw new Error("Failed to fetch expenses")
      }

      const data = await response.json()
      setExpenses(data)
    } catch (err) {
      setError("Failed to load expenses")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete expense")
      }

      // Remove the deleted expense from the list
      setExpenses(expenses.filter((expense) => expense._id !== id))
    } catch (err) {
      console.error("Error deleting expense:", err)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading expenses...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>
  }

  if (expenses.length === 0) {
    return <div className="text-center py-4">No expenses found. Add some expenses to get started!</div>
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <Card key={expense._id} className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold">${expense.amount.toFixed(2)}</span>
                <span className="text-sm capitalize text-gray-600">{expense.category}</span>
              </div>
              <p className="text-gray-700">{expense.description}</p>
              <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(expense._id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}

