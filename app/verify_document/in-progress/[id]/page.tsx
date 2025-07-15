"use client"
import React, { useRef, useState } from 'react';
import { ArrowLeft, Eye, Paperclip, RotateCcw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useVerificationDocument } from '@/hooks/useApiQuery';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/services/apiService';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://khabiteq-realty.onrender.com/api/admin';

const InProgressPage: React.FC = () => {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const { data: dataRaw, isLoading, error } = useVerificationDocument(id);
  const doc = dataRaw as any;
  const { addNotification } = useApp();
  const router = useRouter();

  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!id || selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const res = await apiService.uploadVerificationResult(id, selectedFiles);
      if (res.success) {
        addNotification && addNotification({
          type: 'success',
          title: 'Upload Successful',
          message: res.data?.message || 'Result uploaded and sent to user.'
        });
        setSelectedFiles([]);
        router.push('/verify_document');
      } else {
        throw new Error(res?.data?.message || res?.error || 'Failed to upload result.');
      }
    } catch (err: any) {
      addNotification && addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: err.message || 'Failed to upload result.'
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }
  if (error || !doc) {
    return <div className="p-6 text-center text-red-500">Failed to load document.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header with back button */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <ArrowLeft className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => router.back()} />
          <span className="text-gray-600">Verify Document</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-900 font-medium">In Progress</span>
        </div>
        {/* User Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <span className="text-purple-700 font-semibold">{doc.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{doc.fullName}</h2>
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
      {/* Submitted Information Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">In Progress Information</h3>
        <div className="space-y-8">
          {/* Documents */}
          {doc.documents?.map((d: any) => (
            <div key={d._id}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-700 font-medium">Uploaded {d.documentType}</span>
                <div className="flex items-center gap-3">
                  {d.documentUrl ? (
                    <a
                      href={d.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                      title="View document"
                      onClick={e => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" />
                      <span>view image</span>
                    </a>
                  ) : (
                    <span className="text-gray-400">No file</span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">{d.documentType} number</label>
                <input
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
      {/* Upload Report Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload Report</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-3">Upload Report</label>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              title="Upload report files"
              placeholder="Select report files"
            />
            <button
              className="flex items-center gap-2 px-4 py-2 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              onClick={handleAttachClick}
              type="button"
              title="Attach report files"
              disabled={uploading}
            >
              <Paperclip className="w-4 h-4" />
              <span>{selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Attach Report'}</span>
            </button>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setSelectedFiles([])}
              disabled={uploading || selectedFiles.length === 0}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-8 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-60"
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
              type="button"
            >
              {uploading ? 'Uploading...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InProgressPage;