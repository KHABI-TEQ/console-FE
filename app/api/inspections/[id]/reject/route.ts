import { NextRequest, NextResponse } from "next/server";
import { InspectionActionResponse } from "@/lib/types/inspection";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { reason } = body;

    // In a real app, you'd update the inspection in your database
    // For now, we'll just return a success response

    const response: InspectionActionResponse = {
      success: true,
      message: `Inspection rejected: ${reason || "No reason provided"}`,
      inspection: {} as any, // Would be the updated inspection
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reject inspection" },
      { status: 500 },
    );
  }
}
