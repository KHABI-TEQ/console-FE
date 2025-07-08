"use client";
import React from "react";
import { ArrowLeft, Eye } from "lucide-react";
import { useParams } from "next/navigation";
import {
  useVerificationDocument,
  useConfirmVerificationPayment,
  useRejectVerificationPayment,
} from "@/hooks/useApiQuery";
import { useRouter } from "next/navigation";
import { useApp } from "@/contexts/AppContext";

interface VerificationDocument {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  amountPaid?: number;
  transactionReceipt?: string;
  documents?: Array<{
    _id: string;
    documentType: string;
    documentNumber: string;
    documentUrl?: string;
  }>;
  resultDocuments?: any[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

const DocumentVerificationPage = () => {
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";
  const { data: dataRaw, isLoading, error } = useVerificationDocument(id);
  const doc = dataRaw as VerificationDocument | undefined;

  const confirmMutation = useConfirmVerificationPayment();
  const rejectMutation = useRejectVerificationPayment();
  const router = useRouter();
  const { addNotification } = useApp();

  const handleConfirm = () => {
    if (doc?._id) {
      confirmMutation.mutate(doc._id, {
        onSuccess: () => {
          addNotification({
            type: "success",
            title: "Payment Confirmed",
            message: "Verification payment confirmed successfully.",
          });
          router.push("/verify_document");
        },
        onError: (error: any) => {
          addNotification({
            type: "error",
            title: "Error",
            message: error?.message || "Failed to confirm payment.",
          });
        },
      });
    }
  };

  const handleReject = () => {
    if (doc?._id) {
      rejectMutation.mutate(doc._id, {
        onSuccess: () => {
          addNotification({
            type: "success",
            title: "Payment Rejected",
            message: "Verification payment rejected successfully.",
          });
          router.push("/verify_document");
        },
        onError: (error: any) => {
          addNotification({
            type: "error",
            title: "Error",
            message: error?.message || "Failed to reject payment.",
          });
        },
      });
    }
  };

  // Debug logging
  console.log(
    "DEBUG: id",
    id,
    "dataRaw",
    dataRaw,
    "isLoading",
    isLoading,
    "error",
    error,
  );

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }
  if (error || !doc) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load document.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with back button */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => router.back()} />
          <span className="text-gray-600">Verify Document</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-900 font-medium">Submitted Document</span>
        </div>
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-purple-700 font-semibold">
                {doc.fullName
                  ?.split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {doc.fullName}
              </h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>E: {doc.email}</span>
                <span>• {doc.phoneNumber}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Ban contact
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              Flagged contact
            </button>
          </div>
        </div>
      </div>
      {/* Approve Payment Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Approve Payment
        </h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Full name</span>
            <span className="text-gray-900 font-medium">{doc.fullName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Fix Amount</span>
            <span className="text-gray-900 font-medium">
              ₦{doc.amountPaid?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Transaction Receipt:</span>
            {doc.transactionReceipt ? (
              <a
                href={doc.transactionReceipt}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">view</span>
              </a>
            ) : (
              <span className="text-gray-400">No receipt</span>
            )}
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <button
            className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-60"
            onClick={handleConfirm}
            disabled={confirmMutation.isPending || rejectMutation.isPending}
          >
            {confirmMutation.isPending ? "Confirming..." : "Confirm"}
          </button>
          <button
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
            onClick={handleReject}
            disabled={confirmMutation.isPending || rejectMutation.isPending}
          >
            {rejectMutation.isPending ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </div>
      {/* Submit Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Submit Information
        </h3>
        <div className="space-y-8">
          {/* Certificate of Occupancy */}
          {doc.documents?.map((d: any) => (
            <div key={d._id}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">
                  Uploaded {d.documentType}
                </span>
                <div className="flex items-center gap-2">
                  {d.documentUrl ? (
                    <>
                      <a
                        href={d.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View document"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="w-4 h-4" />
                        <span>view</span>
                      </a>
                      <a
                        href={d.documentUrl}
                        download
                        className="flex items-center gap-1 px-4 py-2 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        title="Download document"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          className="material-icons"
                          style={{ fontSize: 18 }}
                        >
                          download
                        </span>
                        <span>download</span>
                      </a>
                    </>
                  ) : (
                    <span className="text-gray-400">No file</span>
                  )}
                </div>
              </div>
              <div>
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor={`doc-number-${d._id}`}
                >
                  {d.documentType} number
                </label>
                <input
                  id={`doc-number-${d._id}`}
                  type="text"
                  value={d.documentNumber}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                  readOnly
                  placeholder={`Enter ${d.documentType} number`}
                  title={`${d.documentType} number`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentVerificationPage;
