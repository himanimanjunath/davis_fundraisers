import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

//delete fundraiser by ID
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    //get authorization header from request
    const authHeader = request.headers.get("authorization")
    
    //build headers object 
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }
    
    //forward Authorization header explicitly from request to backend
    if (authHeader) {
      headers.Authorization = authHeader
    }

    const backendUrl = `${BACKEND_URL}/api/fundraisers/${id}`

    const backendResponse = await fetch(backendUrl, {
      method: "DELETE",
      headers,
    })

    const data = await backendResponse.json()

    //forward backend status code and json response to frontend
    return NextResponse.json(data, { status: backendResponse.status })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
