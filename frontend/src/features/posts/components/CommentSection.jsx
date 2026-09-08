import { useState, useEffect } from "react";
import { getPostCommentsApi, addCommentApi } from "../services/comment.service";
import { useSocket } from "../../../context/SocketContext"; // ADD THIS IMPORT

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const socket = useSocket(); // GET SOCKET INSTANCE

  //* Fetch initial comments from DB
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await getPostCommentsApi(postId);
        setComments(data);
        console.log(data)
        console.log(`Fetched comments for post ${postId}:`, data);
      } catch (error) {
        console.error("Failed to load comments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  //* Listen for live comments via Socket.IO
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (comment) => {
      if (comment.post_id === postId) {
        setComments((prev) => {
          if (prev.find((c) => c.id === comment.id)) return prev;
          return [...prev, comment];
        });
      }
    };

    socket.on("new_comment", handleNewComment);

    return () => {
      socket.off("new_comment", handleNewComment);
    };
  }, [socket, postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const { data } = await addCommentApi(postId, newComment);
  
      setComments((prev) => {
        if (prev.find((c) => c.id === data.id)) return prev;
        return [...prev, data];
      });
      
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-400 mt-4">Loading comments...</div>;

  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex flex-col gap-3 mb-4 max-h-48 overflow-y-auto pr-2">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <img
              src={comment.author?.profileImage ? `http://localhost:5000/${comment.author.profileImage}` : '/default-avatar.png'}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm w-full">
              <span className="font-semibold text-gray-800 mr-2">{comment.author?.name}</span>
              <span className="text-gray-700">{comment.text}</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Post
        </button>
      </form>
    </div>
  );
}