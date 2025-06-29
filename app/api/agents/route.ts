import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") || "10";
    const page = searchParams.get("page") || "1";
    const search = searchParams.get("search") || "";
    const email = searchParams.get("email") || "";

    // Build query parameters
    const params = new URLSearchParams({
      limit,
      page,
      ...(search && { search }),
      ...(email && { email }),
    });

    // Make request to external API
    const response = await fetch(
      `${process.env.API_BASE_URL || "http://localhost:8081/api"}/agents?${params}`,
      {
        headers: {
          "Content-Type": "application/json",
          // Add any auth headers if needed
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch agents",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
