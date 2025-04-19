import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

// MongoDB connection
const uri = "mongodb+srv://saikumar221005:saikumar1919@my-cluster.97n9j.mongodb.net/"
const client = new MongoClient(uri)
const database = client.db("test")
const usersCollection = database.collection("login")

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json()

    // Connect to MongoDB
    await client.connect()

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })

    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 400 })
    }

    // Create new user
    const result = await usersCollection.insertOne({
      username,
      email,
      password, // Note: In a real app, you should hash the password
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "User registered successfully", userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  } finally {
    // Close MongoDB connection
    await client.close()
  }
}

