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
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ email, password }),
    })

    // Check Content-Type header before parsing JSON
    const contentType = backendResponse.headers.get("content-type")
    const isJson = contentType && contentType.includes("application/json")

    let data
    if (isJson) {
      try {
        data = await backendResponse.json()
      } catch (jsonError) {
        console.error("Caught error parsing JSON:", jsonError)
        return NextResponse.json(
          { message: "Invalid response from server" },
          { status: 500 }
        )
      }
    } else {
      // Response is not JSON, read as text and log
      const textResponse = await backendResponse.text()
      console.error("Backend returned non-JSON response:", {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        contentType: contentType || "unknown",
        body: textResponse
      })
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      )
    }

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
