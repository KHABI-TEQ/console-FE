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
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  accountApproved?: boolean;
  accountStatus?: string;
  isFlagged?: boolean;
  isInActive?: boolean;
  isAccountVerified?: boolean;
  isAccountInRecovery?: boolean;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  id?: string;
}

export interface IPropertyLocation {
  state: string;
  localGovernment: string;
  area: string;
}

export interface ILandSize {
  measurementType: string;
  size: number | null;
}

export interface IAdditionalFeatures {
  additionalFeatures: string[];
  noOfBedrooms?: number;
  noOfBathrooms?: number;
  noOfToilets?: number;
  noOfCarParks?: number;
}

export interface IDocOnProperty {
  isProvided: boolean;
  _id: string;
  docName: string;
}

export interface IProperty {
  location: IPropertyLocation;
  landSize: ILandSize;
  additionalFeatures: IAdditionalFeatures;
  _id: string;
  features: string[];
  tenantCriteria: string[];
  areYouTheOwner: boolean;
  isAvailable: string;
  pictures: string[];
  isApproved: boolean;
  isRejected: boolean;
  isPreference: boolean;
  isPremium: boolean;
  propertyType: string;
  propertyCondition: string;
  briefType: string;
  price: number;
  docOnProperty: IDocOnProperty[];
  owner: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ITransaction {
  _id: string;
  buyerId: string | IUser;
  transactionReceipt: string;
  propertyId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  success: boolean;
  message: string;
  data: IInspectionBookingPopulated[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface InspectionDetailResponse {
  success: boolean;
  message: string;
  data: IInspectionBookingPopulated;
}

export interface InspectionActionResponse {
  success: boolean;
  message: string;
  inspection?: any;
}
}