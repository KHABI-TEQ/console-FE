import { NextRequest, NextResponse } from "next/server";
import {
  InspectionDetailResponse,
  InspectionActionResponse,
  IInspectionBookingPopulated,
} from "@/lib/types/inspection";

// Mock data for demonstration (same as in route.ts - in real app this would be in a shared data file)
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

let mockInspections: IInspectionBookingPopulated[] = [
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Return the exact sample response structure provided
    const mockResponse = {
      success: true,
      message: "Inspection details fetched successfully",
      data: {
        _id: params.id,
        propertyId: {
          location: {
            state: "Lagos",
            localGovernment: "Eti-Osa",
            area: " Ikota Villa GRA Estate Beside Mega Chicken Lekki.",
          },
          landSize: {
            measurementType: "",
            size: null,
          },
          additionalFeatures: {
            additionalFeatures: [],
            noOfBedrooms: 4,
          },
          _id: "683c8da8fd1239006afe131d",
          features: [
            "POP Ceilings",
            "Chandeliers",
            "Parking",
            "Spacious Compound ",
            "Security",
            "Water Heaters",
          ],
          tenantCriteria: [],
          areYouTheOwner: true,
          isAvailable: "yes",
          pictures: [
            "https://res.cloudinary.com/dkqjneask/image/upload/v1748798880/property-images/1748798879947-property-image.jpg",
            "https://res.cloudinary.com/dkqjneask/image/upload/v1748798881/property-images/1748798881263-property-image.jpg",
            "https://res.cloudinary.com/dkqjneask/image/upload/v1748798883/property-images/1748798882725-property-image.jpg",
            "https://res.cloudinary.com/dkqjneask/image/upload/v1748798884/property-images/1748798884027-property-image.jpg",
            "https://res.cloudinary.com/dkqjneask/image/upload/v1748798886/property-images/1748798885848-property-image.jpg",
            "https://res.cloudinary.com/dkqjneask/image/upload/v1748798887/property-images/1748798886875-property-image.jpg",
          ],
          isApproved: true,
          isRejected: false,
          isPreference: false,
          isPremium: true,
          propertyType: "Residential",
          propertyCondition: "",
          briefType: "Outright Sales",
          price: 250000000,
          docOnProperty: [
            {
              isProvided: true,
              _id: "683c8da8fd1239006afe131e",
              docName: "Governor Consent",
            },
          ],
          owner: "683c60e0b059886a7d01fdcb",
          createdAt: "2025-06-01T17:28:08.267Z",
          updatedAt: "2025-06-01T17:28:08.267Z",
          __v: 0,
        },
        inspectionDate: "2025-07-01T00:00:00.000Z",
        inspectionTime: "5:00 PM",
        status: "pending_transaction",
        requestedBy: {
          _id: "68606afa30888fde1a3f0cf3",
          fullName: "Ibiyeye Oladimeji",
          email: "oladimejiibiyeye@gmail.com",
          phoneNumber: "08165402158",
          createdAt: "2025-06-28T22:21:46.967Z",
          updatedAt: "2025-06-28T22:21:46.967Z",
          __v: 0,
        },
        transaction: {
          _id: "68606afb30888fde1a3f0cf9",
          buyerId: {
            _id: "68606afa30888fde1a3f0cf3",
            fullName: "Ibiyeye Oladimeji",
            email: "oladimejiibiyeye@gmail.com",
            phoneNumber: "08165402158",
            createdAt: "2025-06-28T22:21:46.967Z",
            updatedAt: "2025-06-28T22:21:46.967Z",
            __v: 0,
          },
          transactionReceipt:
            "https://res.cloudinary.com/dkqjneask/image/upload/v1751149302/property-images/1751149301005-property-image.png",
          propertyId: "683c8da8fd1239006afe131d",
          createdAt: "2025-06-28T22:21:47.533Z",
          updatedAt: "2025-06-28T22:21:47.533Z",
          __v: 0,
        },
        isNegotiating: true,
        negotiationPrice: 300000,
        letterOfIntention: "",
        owner: {
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
        sellerCounterOffer: 0,
        pendingResponseFrom: "seller",
        stage: "negotiation",
        createdAt: "2025-06-28T22:21:47.676Z",
        updatedAt: "2025-06-28T22:21:47.676Z",
        __v: 0,
      },
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch inspection",
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
