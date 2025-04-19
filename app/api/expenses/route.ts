import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { MongoClient } from "mongodb"

// MongoDB connection
const uri = "mongodb+srv://saikumar221005:saikumar1919@my-cluster.97n9j.mongodb.net/"
const client = new MongoClient(uri)
const database = client.db("test")
const expensesCollection = database.collection("expenses")

// Get all expenses for the logged-in user
export async function GET() {
  try {
    // Get user ID from cookie
    const userId = cookies().get("user_id")?.value

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Connect to MongoDB
    await client.connect()

    // Find expenses for this user
    const expenses = await expensesCollection.find({ userId }).sort({ date: -1 }).toArray()

    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  } finally {
    // Close MongoDB connection
    await client.close()
  }
}

// Create a new expense
export async function POST(request: Request) {
  try {
    // Get user ID from cookie
    const userId = cookies().get("user_id")?.value

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const { amount, category, description, date } = await request.json()

    // Connect to MongoDB
    await client.connect()

    // Create new expense
    const result = await expensesCollection.insertOne({
      userId,
      amount,
      category,
      description,
      date,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Expense added successfully", expenseId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error adding expense:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  } finally {
    // Close MongoDB connection
    await client.close()
  }
}

