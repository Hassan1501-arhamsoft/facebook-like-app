import { useState, useEffect } from 'react';
import ProfileCard from '../../profile/components/ProfileCard';
import MyPosts from '../../posts/components/MyPosts';
import CreatePostForm from '../../posts/components/CreatePostForm';
import GlobalFeed from '../../posts/components/GlobalFeed';
import Notifications from '../components/Notifications';
import { useSocket } from '../../../context/SocketContext';
import PendingRequests from '../../follows/components/PendingRequests';
import useAuth from '../../auth/hooks/useAuth';
import MyNetwork from '../../follows/components/MyNetwork';
import FriendsFeed from '../../posts/components/FriendsFeed';

export default function DashboardPage() {
  const [view, setView] = useState('feed');
  const [liveAlert, setLiveAlert] = useState(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  
  const socket = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !user) return;

    const handleLiveAlert = (notification) => {
      if (notification.userId !== user.id) return;
      
      // eslint-disable-next-line no-useless-assignment
      let actionText = "";
      // eslint-disable-next-line no-useless-assignment
      let accentColor = "";
      
      switch (notification.type) {
        case 'like':
          actionText = "liked your post";
          accentColor = "bg-pink-500";
          break;
        case 'comment':
          actionText = "commented on your post";
          accentColor = "bg-blue-500";
          break;
        case 'follow_request':
          actionText = "sent you a friend request";
          accentColor = "bg-purple-500";
          break;
        case 'follow_accepted':
          actionText = "accepted your friend request";
          accentColor = "bg-green-500";
          break;
        default:
          actionText = "interacted with your profile";
          accentColor = "bg-gray-500";
      }

      setIsAnimatingOut(false);
      setLiveAlert({
        message: actionText,
        actorName: notification.actor?.name,
        avatar: notification.actor?.profileImage,
        accentColor
      });

      // Start animate out
      setTimeout(() => {
        setIsAnimatingOut(true);
      }, 3700);

      // Clear completely
      setTimeout(() => {
        setLiveAlert(null);
        setIsAnimatingOut(false);
      }, 4000);
    };

    socket.on("new_notification", handleLiveAlert);

    return () => {
      socket.off("new_notification", handleLiveAlert);
    };
  }, [socket, user]);

  const renderRightColumn = () => {
    switch (view) {
      case 'create-post':
        return (
          <div className="animate-fade-in">
            <CreatePostForm onPostCreated={() => setView('my-posts')} />
          </div>
        );
      case 'my-posts':
        return <div className="animate-fade-in"><MyPosts /></div>;
      case 'notifications':
        return <div className="animate-fade-in"><Notifications /></div>;
      case 'requests': 
        return <div className="animate-fade-in"><PendingRequests /></div>;
      case 'MyNetwork': 
        return <div className="animate-fade-in"><MyNetwork/></div>;
      case 'friends-feed': 
        return <div className="animate-fade-in"><FriendsFeed /></div>;
      case 'feed':
      default:
        return <div className="animate-fade-in"><GlobalFeed /></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pt-8 pb-12 px-4 sm:px-6 lg:px-8 relative selection:bg-blue-100 selection:text-blue-900">

      {/* Premium Glassmorphism Toast Notification */}
      {liveAlert && (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 p-3 pr-6 bg-white/90 backdrop-blur-md border border-gray-100 shadow-2xl rounded-full transition-all duration-300 transform ${isAnimatingOut ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="relative">
            <img
              src={liveAlert.avatar ? `http://localhost:5000/${liveAlert.avatar}` : '/default-avatar.png'}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${liveAlert.accentColor}`}></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-900 leading-none mb-1">
              {liveAlert.actorName}
            </span>
            <span className="text-[13px] text-gray-500 leading-none">
              {liveAlert.message}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto">
        {/* CHANGED TO 3/9 PROPORTION FOR BETTER WIDE-SCREEN SPACING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* PROFILE CARD: Sidebar Navigation (3 columns) */}
          <div className="lg:col-span-3 sticky top-8 h-fit z-10">
            <ProfileCard setView={setView} currentView={view} />
          </div>

          {/* MAIN CONTENT AREA: Feeds & Pages (9 columns) */}
          <div className="lg:col-span-9 min-h-[80vh]">
            {renderRightColumn()}
          </div>
          
        </div>
      </div>

      {/* Optional: Add this to your global index.css if you want the fade-in utility:
          @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
      */}
    </div>
  );
}