import { NextRequest, NextResponse } from "next/server";

const mockUsersData = {
  success: true,
  page: 1,
  limit: 20,
  total: 4,
  users: [
    {
      _id: "6860004265002a1daeca757b",
      email: "purplegeminivisuals@gmail.com",
      firstName: "Tosin",
      phoneNumber: "+2347047435826",
      isAccountInRecovery: false,
      isAccountVerified: false,
      isInActive: false,
      accountApproved: false,
      accountStatus: "active",
      isFlagged: false,
      createdAt: "2025-06-28T14:46:26.122Z",
      updatedAt: "2025-06-28T14:46:26.122Z",
      __v: 0,
      id: "6860004265002a1daeca757b",
      agentData: null,
    },
    {
      _id: "685fdd0365002a1daeca742d",
      email: "aebatamehi@gmail.com",
      firstName: "Ebatamehi",
      lastName: "Esosa",
      phoneNumber: "+2349112530548",
      isAccountInRecovery: false,
      isAccountVerified: false,
      isInActive: false,
      accountApproved: false,
      accountStatus: "active",
      isFlagged: false,
      createdAt: "2025-06-28T12:16:03.269Z",
      updatedAt: "2025-06-28T12:16:03.269Z",
      __v: 0,
      id: "685fdd0365002a1daeca742d",
      agentData: null,
    },
    {
      _id: "684fcc0365002a1daeca743e",
      email: "michael.brown@example.com",
      firstName: "Michael",
      lastName: "Brown",
      phoneNumber: "+2348055551111",
      isAccountInRecovery: false,
      isAccountVerified: true,
      isInActive: false,
      accountApproved: true,
      accountStatus: "active",
      isFlagged: false,
      createdAt: "2025-05-15T09:20:15.456Z",
      updatedAt: "2025-06-10T16:30:45.789Z",
      __v: 0,
      id: "684fcc0365002a1daeca743e",
      agentData: {
        tier: "Premium",
        sales: 45,
        commission: 125000,
        rating: 4.8,
        specialties: ["Luxury Properties", "Commercial Real Estate"],
      },
    },
    {
      _id: "683acc0365002a1daeca744f",
      email: "lisa.davis@example.com",
      firstName: "Lisa",
      lastName: "Davis",
      phoneNumber: "+2349088882222",
      isAccountInRecovery: false,
      isAccountVerified: true,
      isInActive: true,
      accountApproved: false,
      accountStatus: "inactive",
      isFlagged: true,
      createdAt: "2025-04-22T11:45:30.123Z",
      updatedAt: "2025-05-30T13:15:20.456Z",
      __v: 0,
      id: "683acc0365002a1daeca744f",
      agentData: {
        tier: "Standard",
        sales: 12,
        commission: 35000,
        rating: 3.9,
        specialties: ["Residential Properties"],
      },
    },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const email = searchParams.get("email");
  const status = searchParams.get("status");
  const role = searchParams.get("role");

  // Filter data based on parameters
  let filteredData = mockUsersData.users;

  if (role === "agent") {
    // For agents, we can include all users but highlight those with agentData
    filteredData = mockUsersData.users;
  }

  if (email) {
    filteredData = filteredData.filter((user) =>
      user.email.toLowerCase().includes(email.toLowerCase()),
    );
  }

  if (status) {
    filteredData = filteredData.filter((user) => user.accountStatus === status);
  }

  // Simulate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const response = {
    success: true,
    page,
    limit,
    total: filteredData.length,
    users: paginatedData,
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(response);
}
