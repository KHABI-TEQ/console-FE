import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Make request to external API
    const response = await fetch(
      `${process.env.API_BASE_URL || "http://localhost:8081/api"}/logout`,
      {
        method: "POST",
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

    // Clear any cookies or session data
    const res = NextResponse.json(data);
    res.cookies.delete("auth-token");

    return res;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to logout",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
