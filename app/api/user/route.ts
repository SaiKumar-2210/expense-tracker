import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { MongoClient, ObjectId } from "mongodb"

// MongoDB connection
const uri = "mongodb+srv://saikumar221005:saikumar1919@my-cluster.97n9j.mongodb.net/"
const client = new MongoClient(uri)
const database = client.db("test")
const usersCollection = database.collection("login")

export async function GET() {
  try {
    // Get user ID from cookie
    const userId = cookies().get("user_id")?.value

    if (!userId) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
    }

    // Connect to MongoDB
    await client.connect()

    // Find user by ID
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Return user data without password
    const { password, ...userData } = user

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  } finally {
    // Close MongoDB connection
    await client.close()
  }
}

