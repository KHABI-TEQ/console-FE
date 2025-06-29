import { NextRequest, NextResponse } from "next/server";
import {
  InspectionListResponse,
  InspectionFilters,
  IInspectionBookingPopulated,
} from "@/lib/types/inspection";

// Mock data for demonstration
const mockUsers = [
  {
    _id: "user1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  {
    _id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1234567891",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
  },
  {
    _id: "user3",
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1234567892",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  },
];

const mockProperties = [
  {
    _id: "prop1",
    title: "Modern Downtown Apartment",
    address: "123 Main St, Downtown, NY 10001",
    price: 850000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&h=300&fit=crop",
    ],
    description: "Beautiful modern apartment with city views",
    propertyType: "Apartment",
  },
  {
    _id: "prop2",
    title: "Suburban Family Home",
    address: "456 Oak Ave, Suburbia, NY 10002",
    price: 1200000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2500,
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
    ],
    description: "Spacious family home with large backyard",
    propertyType: "House",
  },
  {
    _id: "prop3",
    title: "Luxury Penthouse",
    address: "789 Park Ave, Uptown, NY 10003",
    price: 2500000,
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2000,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    ],
    description: "Stunning penthouse with panoramic city views",
    propertyType: "Penthouse",
  },
];

const mockTransactions = [
  {
    _id: "trans1",
    amount: 500,
    status: "completed",
    paymentMethod: "Credit Card",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "trans2",
    amount: 750,
    status: "completed",
    paymentMethod: "Bank Transfer",
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    _id: "trans3",
    amount: 1000,
    status: "pending",
    paymentMethod: "Credit Card",
    createdAt: "2024-01-13T09:15:00Z",
  },
];

const mockInspections: IInspectionBookingPopulated[] = [
  {
    _id: "insp1",
    propertyId: mockProperties[0],
    bookedBy: "user1",
    bookedByModel: "Buyer",
    inspectionDate: "2024-01-20",
    inspectionTime: "10:00",
    status: "pending_inspection",
    slotId: "slot1",
    requestedBy: mockUsers[0],
    transaction: mockTransactions[0],
    isNegotiating: false,
    negotiationPrice: 0,
    letterOfIntention: "",
    owner: mockUsers[1],
    pendingResponseFrom: "seller",
    stage: "inspection",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "insp2",
    propertyId: mockProperties[1],
    bookedBy: "user2",
    bookedByModel: "Buyer",
    inspectionDate: "2024-01-22",
    inspectionTime: "14:00",
    status: "negotiation_countered",
    slotId: "slot2",
    requestedBy: mockUsers[1],
    transaction: mockTransactions[1],
    isNegotiating: true,
    negotiationPrice: 1150000,
    letterOfIntention: "I am very interested in this property for my family.",
    owner: mockUsers[2],
    sellerCounterOffer: 1180000,
    pendingResponseFrom: "buyer",
    stage: "negotiation",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-16T11:45:00Z",
  },
  {
    _id: "insp3",
    propertyId: mockProperties[2],
    bookedBy: "user3",
    bookedByModel: "Buyer",
    inspectionDate: "2024-01-25",
    inspectionTime: "16:00",
    status: "inspection_approved",
    slotId: "slot3",
    requestedBy: mockUsers[2],
    transaction: mockTransactions[2],
    isNegotiating: false,
    negotiationPrice: 0,
    letterOfIntention: "This penthouse is perfect for my business needs.",
    owner: mockUsers[0],
    pendingResponseFrom: "none",
    stage: "LOI",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-17T16:20:00Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Handle multiple status values
    const statusQuery = searchParams.getAll("status");
    let statusFilter: string | string[] | undefined;

    if (statusQuery.length > 1) {
      statusFilter = statusQuery;
    } else if (statusQuery.length === 1) {
      statusFilter = statusQuery[0];
    }

    const filters: InspectionFilters = {
      status: statusFilter as any,
      stage: searchParams.get("stage") as any,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      search: searchParams.get("search") || undefined,
      pendingResponseFrom: searchParams.get("pendingResponseFrom") as any,
    };

    let filteredInspections = [...mockInspections];

    // Apply filters
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        filteredInspections = filteredInspections.filter((inspection) =>
          filters.status!.includes(inspection.status),
        );
      } else {
        filteredInspections = filteredInspections.filter(
          (inspection) => inspection.status === filters.status,
        );
      }
    }

    if (filters.stage) {
      filteredInspections = filteredInspections.filter(
        (inspection) => inspection.stage === filters.stage,
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredInspections = filteredInspections.filter(
        (inspection) =>
          inspection.propertyId.title.toLowerCase().includes(searchLower) ||
          inspection.propertyId.address.toLowerCase().includes(searchLower) ||
          inspection.requestedBy.name.toLowerCase().includes(searchLower) ||
          inspection.owner.name.toLowerCase().includes(searchLower),
      );
    }

    if (filters.pendingResponseFrom && filters.pendingResponseFrom !== "none") {
      filteredInspections = filteredInspections.filter(
        (inspection) =>
          inspection.pendingResponseFrom === filters.pendingResponseFrom,
      );
    }

    // Apply pagination
    const total = filteredInspections.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInspections = filteredInspections.slice(
      startIndex,
      endIndex,
    );

    const response: InspectionListResponse = {
      inspections: paginatedInspections,
      total,
      page,
      limit,
      totalPages,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch inspections" },
      { status: 500 },
    );
  }
}
