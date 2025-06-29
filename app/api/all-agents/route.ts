import { NextRequest, NextResponse } from "next/server";

const mockAgentsData = {
  success: true,
  agents: {
    data: [
      {
        _id: "683c60e0b059886a7d01fdcb",
        isAccountInRecovery: false,
        isAccountVerified: true,
        role: "Agent",
        email: "info@khabiteqrealty.com",
        firstName: "Khabi",
        lastName: "Tek",
        password:
          "$2a$10$Mp5XYeK/.yTJ2zxTEXO97unfpcx6FNw3Po26ciBn7Wm6MM8QU7PDC",
        createdAt: "2025-06-01T13:39:07.618Z",
        updatedAt: "2025-06-01T13:39:07.618Z",
        __v: 0,
        accountApproved: false,
        accountStatus: "active",
        isFlagged: false,
        isInActive: false,
        id: "683c60e0b059886a7d01fdcb",
      },
      {
        _id: "683cd1d3fd1239006afe1648",
        isAccountInRecovery: false,
        isAccountVerified: true,
        isInActive: false,
        accountApproved: true,
        accountStatus: "active",
        isFlagged: false,
        email: "ajaydy2k6@gmail.com",
        password:
          "$2a$10$NLyb899UsLzlUXdU5nf.mOp89f1rzECtVJJvIsA/EBV1kjGLOf0/.",
        lastName: "AYOWOLE",
        firstName: "AJAYI",
        phoneNumber: "7068312969",
        userType: "Agent",
        accountId: "KT_t58rfi",
        createdAt: "2025-06-01T22:18:59.753Z",
        updatedAt: "2025-06-19T15:17:12.774Z",
        __v: 0,
        id: "683cd1d3fd1239006afe1648",
      },
      {
        _id: "684cd2d4fd1239006afe1749",
        isAccountInRecovery: false,
        isAccountVerified: false,
        isInActive: true,
        accountApproved: false,
        accountStatus: "inactive",
        isFlagged: true,
        email: "james.wilson@example.com",
        lastName: "Wilson",
        firstName: "James",
        phoneNumber: "8055551234",
        userType: "Landowners",
        accountId: "KT_j92kf1",
        createdAt: "2025-05-15T10:30:22.123Z",
        updatedAt: "2025-05-20T14:22:33.456Z",
        __v: 0,
        id: "684cd2d4fd1239006afe1749",
      },
      {
        _id: "685dd3e5fd1239006afe1850",
        isAccountInRecovery: false,
        isAccountVerified: true,
        isInActive: false,
        accountApproved: true,
        accountStatus: "active",
        isFlagged: false,
        email: "sarah.johnson@example.com",
        lastName: "Johnson",
        firstName: "Sarah",
        phoneNumber: "9045556789",
        userType: "Landowners",
        accountId: "KT_s33mq2",
        createdAt: "2025-04-12T08:15:45.789Z",
        updatedAt: "2025-06-10T11:40:20.123Z",
        __v: 0,
        id: "685dd3e5fd1239006afe1850",
      },
    ],
    totalActiveAgents: 2,
    totalInactiveAgents: 1,
    totalFlaggedAgents: 1,
    totalAgents: 4,
    currentPage: 1,
  },
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const type = searchParams.get("type") || "all"; // active, inactive, flagged, all, onboarding
  const userType = searchParams.get("userType"); // Landowners or Agent (optional)

  // Filter data based on parameters
  let filteredData = mockAgentsData.agents.data;

  if (userType) {
    filteredData = filteredData.filter((agent) => agent.userType === userType);
  }

  if (type !== "all") {
    switch (type) {
      case "active":
        filteredData = filteredData.filter(
          (agent) => agent.accountStatus === "active" && !agent.isInActive,
        );
        break;
      case "inactive":
        filteredData = filteredData.filter(
          (agent) => agent.accountStatus === "inactive" || agent.isInActive,
        );
        break;
      case "flagged":
        filteredData = filteredData.filter((agent) => agent.isFlagged);
        break;
      case "onboarding":
        filteredData = filteredData.filter((agent) => !agent.accountApproved);
        break;
    }
  }

  // Calculate stats based on filtered data
  const totalActiveAgents = filteredData.filter(
    (agent) => agent.accountStatus === "active" && !agent.isInActive,
  ).length;
  const totalInactiveAgents = filteredData.filter(
    (agent) => agent.accountStatus === "inactive" || agent.isInActive,
  ).length;
  const totalFlaggedAgents = filteredData.filter(
    (agent) => agent.isFlagged,
  ).length;

  const response = {
    success: true,
    agents: {
      data: filteredData,
      totalActiveAgents,
      totalInactiveAgents,
      totalFlaggedAgents,
      totalAgents: filteredData.length,
      currentPage: parseInt(page),
    },
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(response);
}
