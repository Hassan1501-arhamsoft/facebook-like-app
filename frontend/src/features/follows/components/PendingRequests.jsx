import { useEffect, useState } from "react";
import { getPendingRequestsApi, respondToRequestApi } from "../services/follow.service";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getPendingRequestsApi();
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to load requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleResponse = async (requestId, action) => {
    // Optimistically remove the request from the list
    setRequests(prev => prev.filter(req => req.id !== requestId));
    
    try {
      await respondToRequestApi(requestId, action);
    } catch (error) {
      console.error(`Failed to ${action} request`, error);
    }
  };

  if (loading) return <div className="text-center p-4">Loading requests...</div>;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Follow Requests</h2>
        {!loading && requests.length > 0 && (
          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100 shadow-sm animate-pulse">
            {requests.length} New {requests.length === 1 ? 'Request' : 'Requests'}
          </span>
        )}
      </div>
      
      {loading ? (
        /* Skeleton Loaders */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        /* Premium Empty State */
        <div className="text-gray-500 p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
          <div className="bg-green-50 p-4 rounded-full mb-4 border border-green-100 text-green-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-800">You're all caught up!</p>
          <p className="text-sm mt-1 text-center max-w-sm">You don't have any pending friend requests right now.</p>
        </div>
      ) : (
        /* Requests Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {requests.map((request) => (
            <div 
              key={request.id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all group relative overflow-hidden"
            >
              {/* Decorative Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* User Info */}
              <div className="flex items-center gap-3">
                <img
                  src={request.FollowerData?.profileImage ? `http://localhost:5000/${request.FollowerData.profileImage}` : '/default-avatar.png'}
                  alt={request.FollowerData?.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors cursor-pointer">
                    {request.FollowerData?.name}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">Wants to be friends</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-1">
                <button
                  onClick={() => handleResponse(request.id, 'accept')}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-sm hover:shadow flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm
                </button>
                <button
                  onClick={() => handleResponse(request.id, 'reject')}
                  className="flex-1 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-bold py-2.5 rounded-xl transition-colors border border-transparent hover:border-red-100 flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}