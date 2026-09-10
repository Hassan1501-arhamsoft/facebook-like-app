import { useRef, useState } from 'react';
import useAuth from '../../auth/hooks/useAuth.js';
import { uploadProfileImage } from '../services/Profile.service.js';

// Accept setView and currentView from the parent Dashboard
export default function ProfileCard({ setView, currentView }) {
  const { user, logout, updateUser } = useAuth(); 
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const response = await uploadProfileImage(file);
      
      if (response.data) {
        updateUser(response.data);
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden sticky top-8 pb-4">
      
      {/* Decorative Cover Gradient */}
      <div className="h-28 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 absolute top-0 left-0 z-0"></div>

      {/* Profile Image Section */}
      <div className="relative z-10 flex flex-col items-center mt-12 px-6">
        <div className="relative mb-3 group">
          <div className="w-28 h-28 rounded-full p-1 bg-white border-4 border-white shadow-md group-hover:border-blue-50 transition-colors">
            <img
              src={user?.profileImage ? `http://localhost:5000/${user.profileImage}` : '/default-avatar.png'}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={isUploading}
            className="absolute bottom-1 right-1 bg-gray-900 text-white p-2 rounded-full hover:bg-blue-600 transition-colors ring-4 ring-white disabled:opacity-50 shadow-md"
            title="Upload new picture"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
        </div>

        {/* User Info */}
        <h2 className="text-xl font-bold text-gray-900 w-full text-center truncate">{user?.name}</h2>
        <p className="text-sm text-gray-500 w-full text-center truncate">{user?.email}</p>
        <span className="mt-2 bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
          Full Stack Developer
        </span>
      </div>

      {/* Navigation Menu */}
      <div className="w-full flex flex-col gap-1 px-4 mt-6">
        
        {/* Primary Action */}
        <button 
          onClick={() => setView('create-post')}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all mb-4 ${
            currentView === 'create-post' 
              ? 'bg-blue-800 text-white shadow-md' 
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
          Create New Post
        </button>

        {/* Discovery Group */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1 mt-2">Feeds</div>
        
        <button 
          onClick={() => setView('feed')}
          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all ${
            currentView === 'feed' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Global Feed
        </button>
        
        <button 
          onClick={() => setView('friends-feed')}
          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all ${
            currentView === 'friends-feed' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
          Friends Feed
        </button>

        {/* Personal Group */}
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-1 mt-4">Personal</div>

        <button 
          onClick={() => setView('my-posts')}
          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all ${
            currentView === 'my-posts' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          My Posts
        </button>

        <button 
          onClick={() => setView('MyNetwork')}
          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all ${
            currentView === 'MyNetwork' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
          My Network
        </button>
        
        <button 
          onClick={() => setView('requests')}
          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all ${
            currentView === 'requests' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
          Requests
        </button>

        <button 
          onClick={() => setView('notifications')}
          className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all ${
            currentView === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          Notifications
        </button>

        {/* Divider */}
        <div className="h-px bg-gray-100 my-2 mx-2"></div>
        
        <button 
          className="w-full flex items-center gap-3 py-2.5 px-3 rounded-lg font-medium transition-all text-red-500 hover:bg-red-50 hover:text-red-600" 
          onClick={handleLogout}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>

      </div>
    </div>
  );
}