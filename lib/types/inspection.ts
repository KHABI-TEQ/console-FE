/**
 * Shared types for Inspection Booking functionality
 */

export type InspectionStatus =
  | "pending_transaction"
  | "transaction_failed"
  | "pending_inspection"
  | "inspection_approved"
  | "inspection_rescheduled"
  | "inspection_rejected_by_seller"
  | "inspection_rejected_by_buyer"
  | "negotiation_countered"
  | "negotiation_accepted"
  | "negotiation_rejected"
  | "negotiation_cancelled"
  | "completed"
  | "cancelled";

export type InspectionStage = "inspection" | "negotiation" | "LOI";

export type PendingResponseFrom = "buyer" | "seller" | "none";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface IProperty {
  _id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  description: string;
  propertyType: string;
}

export interface ITransaction {
  _id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface IInspectionBooking {
  _id: string;
  propertyId: string | IProperty;
  bookedBy: string;
  bookedByModel: string;
  inspectionDate: string;
  inspectionTime: string;
  status: InspectionStatus;
  slotId: string;
  requestedBy: string | IUser;
  transaction: string | ITransaction;
  isNegotiating: boolean;
  negotiationPrice: number;
  letterOfIntention: string;
  owner: string | IUser;
  sellerCounterOffer?: number;
  pendingResponseFrom?: PendingResponseFrom;
  stage: InspectionStage;
  createdAt: string;
  updatedAt: string;
}

export interface IInspectionBookingPopulated
  extends Omit<
    IInspectionBooking,
    "propertyId" | "requestedBy" | "owner" | "transaction"
  > {
  propertyId: IProperty;
  requestedBy: IUser;
  owner: IUser;
  transaction: ITransaction;
}

export interface InspectionFilters {
  status?: InspectionStatus | InspectionStatus[];
  stage?: InspectionStage;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  pendingResponseFrom?: PendingResponseFrom;
}

export interface InspectionListResponse {
  inspections: IInspectionBookingPopulated[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InspectionDetailResponse {
  inspection: IInspectionBookingPopulated;
}

export interface InspectionActionResponse {
  success: boolean;
  message: string;
  inspection: IInspectionBookingPopulated;
}
