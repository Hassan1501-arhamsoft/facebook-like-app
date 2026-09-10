import { useEffect, useState } from "react";
import { getFriendsApi, removeFriendApi } from "../services/follow.service"; // Updated import

export default function MyNetwork() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const res = await getFriendsApi();
        setFriends(res.data);
      } catch (error) {
        console.error("Failed to load friends", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFriends();
  }, []);

  // NEW: Handle unfriending
  const handleUnfriend = async (friendId) => {
    // Instantly remove from UI
    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));
    
    try {
      await removeFriendApi(friendId);
    } catch (error) {
      console.error("Failed to unfriend", error);
      // Optional: if it fails, you could fetch friends again to restore the UI state
    }
  };

  return (
<div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">My Friends</h2>
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 shadow-sm">
          {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'}
        </span>
      </div>

      {/* States */}
      {loading ? (
        // Skeleton Loaders for a premium feel
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-56 border border-gray-100 shadow-sm animate-pulse flex flex-col">
              <div className="h-16 w-full bg-gray-200 rounded-t-2xl"></div>
              <div className="px-5 pb-5 flex flex-col items-center -mt-8">
                <div className="w-20 h-20 rounded-full bg-gray-300 border-4 border-white mb-3"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="w-full flex gap-2">
                  <div className="h-9 flex-1 bg-gray-200 rounded-lg"></div>
                  <div className="h-9 flex-1 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : friends.length === 0 ? (
        // Empty State
        <div className="text-gray-500 p-12 flex flex-col items-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">No friends yet</p>
          <p className="text-sm mt-1">Accept requests or send them from the suggestions panel!</p>
        </div>
      ) : (
        // Friend Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {friends.map((friend) => (
            <div key={friend.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
              
              {/* Mini Banner Cover */}
              <div className="h-16 w-full bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 absolute top-0 left-0 z-0"></div>

              {/* Card Content */}
              <div className="px-5 pb-5 flex flex-col items-center mt-6 relative z-10">
                <img
                  src={friend.profileImage ? `http://localhost:5000/${friend.profileImage}` : '/default-avatar.png'}
                  alt={friend.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm mb-3 group-hover:scale-105 transition-transform"
                />
                <h3 className="font-bold text-gray-900 truncate w-full text-center">{friend.name}</h3>
                <p className="text-xs text-gray-500 mb-4 truncate w-full text-center">{friend.email}</p>
                
                {/* Actions */}
                <div className="w-full flex gap-2">
                  <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold py-2 rounded-xl transition-colors border border-gray-200 shadow-sm flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Profile
                  </button>
                  <button 
                    onClick={() => handleUnfriend(friend.id)}
                    className="flex-1 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 text-sm font-semibold py-2 rounded-xl transition-colors border border-gray-200 hover:border-red-200 shadow-sm flex items-center justify-center gap-1.5"
                    title="Unfriend this user"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>
                    Unfriend
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}