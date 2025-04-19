import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Expense Tracker</h1>
          <p className="mt-2 text-sm text-gray-600">Track your expenses and manage your finances efficiently</p>
        </div>
        <div className="mt-8 space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">Login to your account</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/register">Create new account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

