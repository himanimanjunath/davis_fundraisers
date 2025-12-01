import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    const backendResponse = await fetch("http://localhost:4000/api/auth/register", {
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
