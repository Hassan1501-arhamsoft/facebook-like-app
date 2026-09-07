import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { useSocket } from "../../../context/SocketContext";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/notifications");
        setNotifications(data.data);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        console.error("Failed to load notifications");
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

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Notifications</h2>
      
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        notifications.map((notif) => (
          <div key={notif.id} className={`p-4 rounded-lg flex items-center gap-4 border ${notif.is_read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
            <img
              src={notif.actor?.profileImage ? `http://localhost:5000/${notif.actor.profileImage}` : '/default-avatar.png'}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border border-gray-300"
            />
            <div>
              <p className="text-gray-800">
                <span className="font-semibold">{notif.actor?.name}</span> 
                {notif.type === 'like' ? ' liked your post.' : ' commented on your post.'}
              </p>
              <p className="text-xs text-gray-500">{new Date(notif.created_at).toLocaleString()}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}