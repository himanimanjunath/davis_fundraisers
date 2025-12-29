//fetch and make fundraisers by forwarding requests to express api

import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

//GET all fundraisers
export async function GET() {
  try {
    const backendResponse = await fetch(`${BACKEND_URL}/api/fundraisers`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { message: "Failed to fetch fundraisers" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error fetching fundraisers:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

//POST new fundraiser
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    //Get authorization header from request
    const authHeader = request.headers.get("authorization")
    
    //Build headers object
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    
    //Forward authorization header if present
    if (authHeader) {
      headers.Authorization = authHeader
    }

    const backendResponse = await fetch(`${BACKEND_URL}/api/fundraisers`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { message: data.message || "Failed to create fundraiser" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
