import { useState } from "react";
import { submitReportApi } from "../services/report.service";

export default function ReportModal({ reportedUserId, reportedUserName, onClose }) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const reportReasons = [
    "Spam or misleading",
    "Harassment or bullying",
    "Inappropriate content",
    "Fake account",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    try {
      setIsSubmitting(true);
      await submitReportApi(reportedUserId, reason, description);
      setSuccess(true);
      
      // Auto-close after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit report", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-gray-100">
        
        {/* Header */}
        <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="font-bold text-lg">Report User</h3>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">Report Submitted</h4>
              <p className="text-sm text-gray-500">Thank you for helping keep our community safe.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                You are reporting <span className="font-bold text-gray-900">{reportedUserName}</span>. This report is anonymous.
              </p>

              {/* Reason Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Reason for reporting <span className="text-red-500">*</span></label>
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-400/20 transition-all appearance-none"
                >
                  <option value="" disabled>Select a reason...</option>
                  {reportReasons.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Description Textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Additional details (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any extra context to help our team investigate..."
                  rows="3"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[14px] text-gray-900 focus:outline-none focus:border-red-400 focus:bg-white focus:ring-2 focus:ring-red-400/20 transition-all resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={!reason || isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : "Submit Report"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}