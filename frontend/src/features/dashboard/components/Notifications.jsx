import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useSocket } from "../../../context/SocketContext";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/notifications");
        setNotifications(data.data);
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Listen for live targeted notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("new_notification", handleNewNotification);
    return () => socket.off("new_notification", handleNewNotification);
  }, [socket]);

  // Helper function to assign icons, colors, and text based on type
  const getNotificationDetails = (type) => {
    switch (type) {
      case 'like':
        return {
          text: 'liked your post.',
          icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
          colorClass: 'text-pink-600 bg-pink-50 border-pink-100'
        };
      case 'comment':
        return {
          text: 'commented on your post.',
          icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
          colorClass: 'text-blue-600 bg-blue-50 border-blue-100'
        };
      case 'follow_request':
        return {
          text: 'sent you a friend request.',
          icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />,
          colorClass: 'text-purple-600 bg-purple-50 border-purple-100'
        };
      case 'follow_accepted':
        return {
          text: 'accepted your friend request.',
          icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
          colorClass: 'text-green-600 bg-green-50 border-green-100'
        };
      default:
        return {
          text: 'interacted with your profile.',
          icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
          colorClass: 'text-gray-600 bg-gray-50 border-gray-100'
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        {!loading && unreadCount > 0 && (
          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100 shadow-sm animate-pulse">
            {unreadCount} New
          </span>
        )}
      </div>
      
      {loading ? (
        /* Skeleton Loaders */
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        /* Premium Empty State */
        <div className="text-gray-500 p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
          <div className="bg-blue-50 p-4 rounded-full mb-4 border border-blue-100 text-blue-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-800">No notifications yet</p>
          <p className="text-sm mt-1 text-center max-w-sm">When someone interacts with your posts or sends you a request, it will show up here.</p>
        </div>
      ) : (
        /* Notification List */
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => {
            const details = getNotificationDetails(notif.type);
            const notifDate = new Date(notif.created_at);
            
            return (
              <div 
                key={notif.id} 
                className={`p-4 rounded-2xl flex items-center gap-4 border transition-all hover:shadow-md cursor-pointer ${
                  notif.is_read 
                    ? 'bg-white border-gray-100 hover:border-gray-200' 
                    : 'bg-blue-50/50 border-blue-100 shadow-sm'
                }`}
              >
                {/* Avatar with relative icon overlay */}
                <div className="relative shrink-0">
                  <img
                    src={notif.actor?.profileImage ? `http://localhost:5000/${notif.actor.profileImage}` : '/default-avatar.png'}
                    alt={notif.actor?.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${details.colorClass}`}>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {details.icon}
                    </svg>
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <p className="text-gray-800 text-[15px] leading-snug">
                    <span className="font-bold hover:text-blue-600 transition-colors">{notif.actor?.name}</span> 
                    {' '}{details.text}
                  </p>
                  <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${notif.is_read ? 'text-gray-500' : 'text-blue-600'}`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {notifDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {notifDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Unread dot indicator */}
                {!notif.is_read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}