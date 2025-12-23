//proxy route between next and express 
//this is for logging in existing users

//this route accepts login credentials from the next.js app, forwards them to 
//express auth API, and returns reponse in frontend safe way

import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const backendResponse = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      return NextResponse.json({
        token: data.token,
        user: data.user,
      })
    } else {
      return NextResponse.json(
        { message: data.message || "Login failed" },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
