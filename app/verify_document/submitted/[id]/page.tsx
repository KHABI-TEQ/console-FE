"use client"
import React, { useState } from 'react';
import { ArrowLeft, Paperclip, Mail, X, Download } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useVerificationDocument, useSendToProvider } from '@/hooks/useApiQuery';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';

interface FormData {
  certificateNumber: string;
  deedNumber: string;
  thirdPartyEmail: string;
}

type ImageType = 'certificate' | 'deed' | null;

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
  thirdPartyEmail?: string;
  [key: string]: any;
}

const SubmittedDocumentPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { data: dataRaw, isLoading, error } = useVerificationDocument(id);
  const doc = dataRaw as VerificationDocument | undefined;

  const [formData, setFormData] = useState<FormData>({
    certificateNumber: '',
    deedNumber: '',
    thirdPartyEmail: ''
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<ImageType>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleViewImage = (imageType: ImageType) => {
    setCurrentImage(imageType);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentImage(null);
  };

  const handleDownload = () => {
    // Handle download logic here
    if (currentImage && doc && doc.documents) {
      const found = doc.documents.find((d: any) =>
        (currentImage === 'certificate' && d.documentType.toLowerCase().includes('certificate')) ||
        (currentImage === 'deed' && d.documentType.toLowerCase().includes('deed'))
      );
      if (found && found.documentUrl) {
        window.open(found.documentUrl, '_blank');
      }
    }
  };

  const handleCancel = () => {
    // Handle cancel action
    // ...
  };

  const sendToProviderMutation = useSendToProvider();
  const { addNotification } = useApp ? useApp() : { addNotification: () => {} };
  const router = useRouter();

  const handleSend = () => {
    if (!formData.thirdPartyEmail || !id) return;
    sendToProviderMutation.mutate(
      { documentId: id, email: formData.thirdPartyEmail },
      {
        onSuccess: (data: any) => {
          addNotification && addNotification({
            type: 'success',
            title: 'Sent',
            message: data?.data?.message || 'Verification documents sent to provider.'
          });
          router.push('/verify_document');
        },
        onError: (error: any) => {
          addNotification && addNotification({
            type: 'error',
            title: 'Error',
            message: error?.message || 'Failed to send to provider.'
          });
        }
      }
    );
  };

  React.useEffect(() => {
    if (doc) {
      setFormData({
        certificateNumber: doc.documents?.find((d: any) => d.documentType.toLowerCase().includes('certificate'))?.documentNumber || '',
        deedNumber: doc.documents?.find((d: any) => d.documentType.toLowerCase().includes('deed'))?.documentNumber || '',
        thirdPartyEmail: doc.thirdPartyEmail || ''
      });
    }
  }, [doc]);

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }
  if (error || !doc) {
    return <div className="p-6 text-center text-red-500">Failed to load document.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button className="mr-4 p-2 hover:bg-gray-100 rounded-full" title="Go back" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Verify Document • <span className="font-bold">Submitted Document</span>
          </h1>
        </div>
      </div>
      {/* User Info Section */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-4">
          <span className="text-purple-700 font-semibold text-sm">{doc.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{doc.fullName}</h2>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-1">E:</span>
            <span className="mr-4">{doc.email}</span>
            <span>•</span>
            <span className="ml-2">{doc.phoneNumber}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
            Ban contact
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">
            Flagged contact
          </button>
        </div>
      </div>
      {/* Submit Information Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Submit Information</h3>
        <div className="space-y-8">
          {/* Certificate of Occupancy Section */}
          {doc.documents?.map((d: any) => (
            <div key={d._id}>
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Uploaded {d.documentType}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Paperclip className="w-5 h-5 text-blue-500 mr-2" />
                <button 
                    onClick={() => handleViewImage(d.documentType.toLowerCase().includes('certificate') ? 'certificate' : 'deed')}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                >
                  view Image
                </button>
              </div>
            </div>
              <label className="block text-sm font-medium text-gray-700 mb-3 mt-4">
                {d.documentType} number
            </label>
            <input
              type="text"
                value={d.documentNumber}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${d.documentType} number`}
                readOnly
              />
            </div>
          ))}
          {/* Third Party Email */}
          {doc.status !== 'successful' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Third party email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formData.thirdPartyEmail}
                  onChange={(e) => handleInputChange('thirdPartyEmail', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter third party email"
                  disabled={sendToProviderMutation.isPending}
                />
                <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>
        {/* Action Buttons */}
        {doc.status !== 'successful' && (
          <>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium disabled:opacity-60"
                disabled={sendToProviderMutation.isPending || !formData.thirdPartyEmail}
              >
                {sendToProviderMutation.isPending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
      {/* Image Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {currentImage === 'certificate' ? 'Certificate of Occupancy' : 'Deed of Lease'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-4">
              <div className="relative">
                {doc.documents && currentImage && doc.documents.find((d: any) =>
                  (currentImage === 'certificate' && d.documentType.toLowerCase().includes('certificate')) ||
                  (currentImage === 'deed' && d.documentType.toLowerCase().includes('deed'))
                ) ? (
                  <img
                    src={doc.documents.find((d: any) =>
                      (currentImage === 'certificate' && d.documentType.toLowerCase().includes('certificate')) ||
                      (currentImage === 'deed' && d.documentType.toLowerCase().includes('deed'))
                    )?.documentUrl}
                    alt={currentImage === 'certificate' ? 'Certificate of Occupancy' : 'Deed of Lease'}
                  className="w-full h-auto rounded-lg"
                />
                ) : (
                  <div className="text-center text-gray-400">No image available</div>
                )}
              </div>
              {/* Download Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedDocumentPage;