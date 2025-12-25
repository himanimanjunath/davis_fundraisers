//proxy route between next and express 
//this is for registering new users

//accepts registration data from the next.js app, forwards it to express auth, and returns clearn response to frontend

import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      return NextResponse.json({
        message: "Registration successful",
        user: data.user,
      })
    } else {
      return NextResponse.json(
        { message: data.message || "Registration failed" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
