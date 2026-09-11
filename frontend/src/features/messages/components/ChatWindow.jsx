import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../../context/SocketContext";
import useAuth from "../../auth/hooks/useAuth";
import { getChatHistoryApi } from "../services/message.service";

export default function ChatWindow({ friend, onClose }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await getChatHistoryApi(friend.id);
        setMessages(response.data || []);
      } catch (error) {
        console.error("Failed to load chat history", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (friend?.id) fetchHistory();
  }, [friend?.id]);

  // Listen for incoming messages
useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (newMessage) => {
      // Strictly check if the message belongs to this specific 1-on-1 conversation
      const isThisConversation = 
        (newMessage.sender_id === friend.id && newMessage.receiver_id === user.id) ||
        (newMessage.sender_id === user.id && newMessage.receiver_id === friend.id);

      if (isThisConversation) {
        setMessages((prev) => {
          // Prevent duplicates by checking if the message ID already exists
          if (prev.find(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, friend.id, user.id]);


  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket) return;

    const messageData = {
      sender_id: user.id,
      receiver_id: friend.id,
      content: inputText.trim(),
    };

    socket.emit("send_message", messageData);
    setInputText(""); 
  };
  if (!friend) return null;

  return (
    <div className="fixed bottom-0 right-4 sm:right-6 lg:right-12 w-[340px] bg-white rounded-t-2xl shadow-2xl border border-gray-200 z-[100] flex flex-col overflow-hidden transition-transform animate-slide-up">
      
      {/* Header */}
      <div className="bg-indigo-600 px-4 py-3 flex items-center justify-between cursor-pointer" onClick={onClose}>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img
              src={friend.profileImage ? `http://localhost:5000/${friend.profileImage}` : '/default-avatar.png'}
              alt={friend.name}
              className="w-8 h-8 rounded-full object-cover border border-indigo-400"
            />
            {/* Online indicator dot (Optional UI) */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-indigo-600 rounded-full"></div>
          </div>
          <span className="text-white font-semibold text-[15px]">{friend.name}</span>
        </div>
        <button className="text-indigo-200 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Message Area */}
      <div className="h-[320px] bg-gray-50/50 p-4 overflow-y-auto flex flex-col gap-3">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Loading chat...</div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm text-center">
            <span className="text-2xl mb-2">👋</span>
            Say hi to {friend.name.split(' ')[0]}!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === user.id;
            return (
              <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-[14px] leading-snug shadow-sm ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-[14px] focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
        />
        <button 
          type="submit" 
          disabled={!inputText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
        >
          <svg className="w-4 h-4 translate-x-[1px] translate-y-[-1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </form>
    </div>
  );
}