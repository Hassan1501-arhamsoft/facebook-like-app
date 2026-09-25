import { useEffect, useState } from "react";
import { getFriendsApi, removeFriendApi } from "../services/follow.service"; 

export default function MyNetwork({ setActiveChatFriend }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); 

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

  const handleUnfriend = async (friendId) => {
    setFriends((prev) => prev.filter((friend) => friend.id !== friendId));

    try {
      await removeFriendApi(friendId);
    } catch (error) {
      console.error("Failed to unfriend", error);
    }
  };


  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header with Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">My Friends</h2>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 shadow-sm">
            {friends.length} {friends.length === 1 ? 'Friend' : 'Friends'}
          </span>
        </div>

        {/* Premium Search Bar */}
        <div className="relative w-full sm:w-80 group">
  <input
    type="text"
    placeholder="Search friends..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-11 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-900 shadow-[0_2px_10px_rgba(0,0,0,0.02)] outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-gray-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:shadow-md"
  />
  
  {/* Search Icon (Changes color on focus) */}
  <svg 
    className="w-[18px] h-[18px] text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 group-focus-within:text-indigo-500" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
  
  {/* Premium Clear Button with circular hover effect */}
  {searchQuery && (
    <button 
      onClick={() => setSearchQuery("")}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-transparent hover:bg-gray-100 p-1.5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
      aria-label="Clear search"
    >
      <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  )}
</div>
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
        // Empty State (No friends at all)
        <div className="text-gray-500 p-12 flex flex-col items-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">No friends yet</p>
          <p className="text-sm mt-1">Accept requests or send them from the suggestions panel!</p>
        </div>
      ) : filteredFriends.length === 0 ? (
        // Empty State (Search found no matches)
        <div className="text-gray-500 p-12 flex flex-col items-center bg-white rounded-2xl border border-gray-100 shadow-sm">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg font-semibold text-gray-700">No matching friends found</p>
          <p className="text-sm mt-1">Try searching for a different name.</p>
        </div>
      ) : (
        // Friend Cards Grid (Mapped over filteredFriends)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFriends.map((friend) => (
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
                  <button
                    onClick={() => setActiveChatFriend(friend)}
                    className="flex-1 bg-white hover:bg-indigo-50 text-indigo-600 text-sm font-semibold py-2 rounded-xl transition-colors border border-indigo-200 hover:border-indigo-300 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Message
                  </button>
                  <button
                    onClick={() => handleUnfriend(friend.id)}
                    className="flex-1 bg-white hover:bg-red-50 text-red-600 hover:text-red-600 text-sm font-semibold py-2 rounded-xl transition-colors border border-gray-200 hover:border-red-200 shadow-sm flex items-center justify-center gap-1.5"
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