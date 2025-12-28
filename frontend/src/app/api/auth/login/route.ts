//for logging in existing users
//accepts login credentials, forwards them to auth API, and returns response

import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({ email, password }),
    })

    //check content type header before parsing JSON
    const contentType = backendResponse.headers.get("content-type")
    const isJson = contentType && contentType.includes("application/json")

    let data
    if (isJson) {
      try {
        data = await backendResponse.json()
      } catch (jsonError) {
        //console.error(jsonError)
        return NextResponse.json(
          { message: "Invalid response from server" },
          { status: 500 }
        )
      }
    } else {
      // response isn't json, read as text and log
      const textResponse = await backendResponse.text()
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
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
