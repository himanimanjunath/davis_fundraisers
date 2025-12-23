import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "http://localhost:4000"

// DELETE a fundraiser by ID
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    //get authorization header from request
    const authHeader = request.headers.get("authorization")
    
    // Build headers object - explicitly forward Authorization header
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    
    // Forward Authorization header explicitly from request to backend
    if (authHeader) {
      headers.Authorization = authHeader
    }

    const backendUrl = `${BACKEND_URL}/api/fundraisers/${id}`
    
    // Log request details for debugging
    console.log("Next.js API Route - DELETE Request:", {
      url: backendUrl,
      method: "DELETE",
      headers: {
        "Content-Type": headers["Content-Type"],
        Authorization: authHeader ? `${authHeader.substring(0, 20)}...` : "missing"
      }
    })

    const backendResponse = await fetch(backendUrl, {
      method: "DELETE",
      headers,
    })

    const data = await backendResponse.json()

    // Log backend response for debugging
    console.log("Next.js API Route - Backend Response:", {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      data: JSON.stringify(data)
    })

    // Forward backend status code and JSON response to frontend
    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error("Next.js API Route - Error deleting fundraiser:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
