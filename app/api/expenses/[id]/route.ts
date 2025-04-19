import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { MongoClient, ObjectId } from "mongodb"

// MongoDB connection
const uri = "mongodb+srv://saikumar221005:saikumar1919@my-cluster.97n9j.mongodb.net/"
const client = new MongoClient(uri)
const database = client.db("test")
const expensesCollection = database.collection("expenses")

// Delete an expense
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Get user ID from cookie
    const userId = cookies().get("user_id")?.value

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    const id = params.id

    // Connect to MongoDB
    await client.connect()

    // Delete expense (only if it belongs to the current user)
    const result = await expensesCollection.deleteOne({
      _id: new ObjectId(id),
      userId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Expense not found or not authorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  } finally {
    // Close MongoDB connection
    await client.close()
  }
}

