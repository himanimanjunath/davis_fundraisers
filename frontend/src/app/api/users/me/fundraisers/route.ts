//returns fundraisers created by the authenticated user

import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function GET(request: NextRequest) {
  try {
    //get authorization header from request
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      )
    }

    //forward request to backend with authorization header
    const backendResponse = await fetch(`${BACKEND_URL}/api/users/me/fundraisers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { message: data.message || "Failed to fetch fundraisers" },
        { status: backendResponse.status }
      )
    }
  } catch (error) {
    console.error("Error fetching user fundraisers:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}










