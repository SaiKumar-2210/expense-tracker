import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { MongoClient } from "mongodb"

// MongoDB connection
const uri = "mongodb+srv://saikumar221005:saikumar1919@my-cluster.97n9j.mongodb.net/"
const client = new MongoClient(uri)
const database = client.db("test")
const usersCollection = database.collection("login")

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Connect to MongoDB
    await client.connect()

    // Find user by email and password
    const user = await usersCollection.findOne({ email, password })

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create session
    const sessionId = crypto.randomUUID()
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week

    // Store session in cookie
    cookies().set("session_id", sessionId, {
      httpOnly: true,
      expires,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    // Store user ID in cookie for easy access
    cookies().set("user_id", user._id.toString(), {
      httpOnly: true,
      expires,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })

    return NextResponse.json({ message: "Login successful" })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  } finally {
    // Close MongoDB connection
    await client.close()
  }
}

