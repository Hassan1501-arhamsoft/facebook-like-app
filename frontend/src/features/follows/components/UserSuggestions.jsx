import { useEffect, useState } from "react";
import { getSuggestionsApi, sendFollowRequestApi } from "../services/follow.service";

export default function UserSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await getSuggestionsApi(5);
        // Add a local state property to track request status
        const usersWithStatus = response.data.map(user => ({ ...user, requestSent: false }));
        setSuggestions(usersWithStatus);
        console.log("Fetched suggestions:", usersWithStatus);
      } catch (error) {
        console.error("Failed to load suggestions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFollow = async (userId) => {
    // Optimistic UI update
    setSuggestions(prev => prev.map(user => 
      user.id === userId ? { ...user, requestSent: !user.requestSent } : user
    ));

    try {
      await sendFollowRequestApi(userId);
    } catch (error) {
      console.error("Failed to send request", error);
      // Revert on failure
      setSuggestions(prev => prev.map(user => 
        user.id === userId ? { ...user, requestSent: !user.requestSent } : user
      ));
    }
  };

  if (loading) return <div className="p-4 text-gray-500 text-sm">Loading suggestions...</div>;
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="font-bold text-gray-900 mb-4">Suggested for you</h3>
      <div className="flex flex-col gap-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.profileImage ? `http://localhost:5000/${user.profileImage}` : '/default-avatar.png'}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-gray-900 truncate max-w-[120px]">{user.name}</span>
              </div>
            </div>
            
            <button
              onClick={() => handleFollow(user.id)}
              className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
                user.requestSent 
                  ? "bg-gray-100 text-gray-600 border border-gray-200"
                  : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
              }`}
            >
              {user.requestSent ? "Requested" : "Add Friend"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}