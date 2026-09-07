import { useState, useEffect } from 'react';
import ProfileCard from '../../profile/components/ProfileCard';
import MyPosts from '../../posts/components/MyPosts';
import CreatePostForm from '../../posts/components/CreatePostForm';
import GlobalFeed from '../../posts/components/GlobalFeed';
import Notifications from '../components/Notifications';
import { useSocket } from '../../../context/SocketContext';

export default function DashboardPage() {
  const [view, setView] = useState('feed'); 
  const [liveAlert, setLiveAlert] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleLiveAlert = (notification) => {
      setLiveAlert({
        message: `${notification.actor?.name} ${notification.type === 'like' ? 'liked' : 'commented on'} your post!`,
        avatar: notification.actor?.profileImage
      });

      setTimeout(() => {
        setLiveAlert(null);
      }, 4000);
    };

    socket.on("new_notification", handleLiveAlert);

    return () => {
      socket.off("new_notification", handleLiveAlert);
    };
  }, [socket]);

  const renderRightColumn = () => {
    switch (view) {
      case 'create-post':
        return (
          <>
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Create a New Post</h2>
            <CreatePostForm onPostCreated={() => setView('my-posts')} />
          </>
        );
      case 'my-posts':
        return <MyPosts />;
      case 'notifications':
        return <Notifications />;
      case 'feed':
      default:
        return <GlobalFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-12 px-4 sm:px-6 lg:px-8 relative">
      
      {liveAlert && (
        <div className="fixed bottom-6 right-6 bg-white border-l-4 border-blue-600 shadow-xl rounded-r-lg p-4 flex items-center gap-3 z-50 transition-all transform duration-300 ease-in-out">
          <img
            src={liveAlert.avatar ? `http://localhost:5000/${liveAlert.avatar}` : '/default-avatar.png'}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
          <div>
            <p className="text-sm text-blue-600 font-bold mb-0.5">New Notification</p>
            <p className="text-gray-800 text-sm font-medium">{liveAlert.message}</p>
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto ">
        {/* CHANGED TO 12-COLUMN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PROFILE CARD: Takes up 4 out of 12 columns (~33%) */}
          <div className="lg:col-span-4 sticky top-8 h-fit">
            <ProfileCard setView={setView} currentView={view} />
          </div>

          {/* RIGHT COLUMN: Takes up 8 out of 12 columns (~67%) */}
          <div className="lg:col-span-8">
            {renderRightColumn()}
          </div>
        </div>
      </div>
    </div>
  );
}