import { useEffect, useState } from "react";
import { getGlobalFeedApi, toggleLikeApi } from "../services/post.service";
import CommentSection from "./CommentSection";
import { useSocket } from "../../../context/SocketContext";
import useAuth from "../../auth/hooks/useAuth";
export default function GlobalFeed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedComments, setExpandedComments] = useState({});
    const socket = useSocket();
    const { user } = useAuth();
    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const { data } = await getGlobalFeedApi();
                setPosts(data);
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError("Failed to load the feed.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);
    useEffect(() => {
        if (!socket) return;

        const handleLikeUpdate = ({ postId, likesCount }) => {
            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, likesCount };
                    }
                    return post;
                })
            );
        };

        socket.on("post_like_updated", handleLikeUpdate);

        return () => {
            socket.off("post_like_updated", handleLikeUpdate);
        };
    }, [socket]);


    useEffect(() => {
        if (!socket) return;

        const handlePostDeleted = (deletedPostId) => {
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== deletedPostId));
        };

        socket.on("post_deleted", handlePostDeleted);

        return () => {
            socket.off("post_deleted", handlePostDeleted);
        };
    }, [socket]);

    useEffect(() => {
        if (!socket || !user) return;

        const handleNewPost = (newPost) => {
            // Only push to the global feed if it belongs to someone else
            if (newPost.user_id !== user.id) {
                setPosts((prevPosts) => [newPost, ...prevPosts]); // Add to the very top
            }
        };

        socket.on("new_post", handleNewPost);

        return () => {
            socket.off("new_post", handleNewPost);
        };
    }, [socket, user]);

    const toggleComments = (postId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const handleLikeToggle = async (postId) => {
        // 1. Optimistically update the UI instantly
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.id === postId) {
                    const wasLiked = post.isLiked;
                    return {
                        ...post,
                        isLiked: !wasLiked,
                        likesCount: wasLiked ? post.likesCount - 1 : post.likesCount + 1,
                    };
                }
                return post;
            })
        );

        // 2. Perform the actual backend request
        try {
            await toggleLikeApi(postId);
        } catch (error) {
            console.error("Failed to toggle like", error);
            // If it fails, you would ideally revert the optimistic update here
        }
    };

    if (loading) return <div className="text-center p-4">Loading feed...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (posts.length === 0) return <div className="text-gray-500 p-4">No new posts from other users right now.</div>;

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Global Feed</h2>

            {posts.map((post) => (
                <div key={post.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">

                    <div className="flex items-center mb-4">
                        <img
                            src={post.author?.profileImage ? `http://localhost:5000/${post.author.profileImage}` : '/default-avatar.png'}
                            alt={post.author?.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-300 mr-3"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-800">{post.author?.name}</h3>
                            <p className="text-xs text-gray-500">
                                {new Date(post.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {post.description && <p className="text-gray-800 mb-4">{post.description}</p>}
                    <img
                        src={`http://localhost:5000/${post.image_url}`}
                        alt="Post content"
                        className="w-full max-h-96 object-contain bg-gray-50 rounded-md border border-gray-100"
                    />

                    <div className="mt-4 pt-3 border-t flex items-center gap-6 text-sm">
                        <button
                            onClick={() => handleLikeToggle(post.id)}
                            className={`font-medium transition flex items-center gap-1 ${post.isLiked ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                        >
                            <svg className="w-5 h-5" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}
                        </button>
                        <button
                            onClick={() => toggleComments(post.id)}
                            className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Comment
                        </button>
                    </div>
                    {expandedComments[post.id] && <CommentSection postId={post.id} />}
                </div>
            ))}
        </div>
    );
}