import { useEffect, useState, useRef, useCallback } from "react";
import { getMyPostsApi, deletePostApi } from "../services/post.service";
import CommentSection from "./CommentSection";
import { useSocket } from "../../../context/SocketContext";

export default function MyPosts() {
    const [posts, setPosts] = useState([]);
    
    // Pagination States
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedComments, setExpandedComments] = useState({});
    
    const socket = useSocket();
    const observer = useRef();

    //* fetch initial posts from db
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await getMyPostsApi(1, 5); // Page 1
                setPosts(response.data);
                setHasMore(response.currentPage < response.totalPages);
            // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError("Failed to load your posts.");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    //* load more posts function
    const loadMorePosts = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const response = await getMyPostsApi(nextPage, 5);
            setPosts((prev) => [...prev, ...response.data]);
            setPage(nextPage);
            setHasMore(response.currentPage < response.totalPages);
        } catch (err) {
            console.error("Failed to load more posts", err);
        } finally {
            setLoadingMore(false);
        }
    }, [page, hasMore, loadingMore]);

    //* Intersection Observer for scrolling
    const lastPostElementRef = useCallback((node) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadMorePosts();
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore, loadMorePosts]);

    //* update like count in real-time
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

    //* post deletion
    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;
        try {
            await deletePostApi(postId);
            setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete post.");
        }
    };

    //* comment section toggle
    const toggleComments = (postId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    if (loading) return <div className="text-center p-4">Loading posts...</div>;
    if (error) return <div className="text-red-500 p-4">{error}</div>;
    if (posts.length === 0) return <div className="text-gray-500 p-4">You haven't created any posts yet.</div>;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900">My Posts</h2>
                {posts.length > 0 && (
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 shadow-sm">
                        {posts.length} {posts.length === 1 ? 'Post' : 'Posts'} Loaded
                    </span>
                )}
            </div>

            {posts.length === 0 ? (
                /* Premium Empty State */
                <div className="text-gray-500 p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[300px]">
                    <div className="bg-gray-50 p-4 rounded-full mb-4 border border-gray-100">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <p className="text-lg font-bold text-gray-800">No posts yet</p>
                    <p className="text-sm mt-1 text-center max-w-sm">When you share your thoughts or photos, they will appear here on your personal timeline.</p>
                </div>
            ) : (
                posts.map((post, index) => {
                    const isLast = posts.length === index + 1;
                    const postDate = new Date(post.created_at);
                    
                    return (
                        <div 
                            ref={isLast ? lastPostElementRef : null} 
                            key={post.id} 
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                        >
                            {/* Post Header */}
                            <div className="px-5 py-4 flex justify-between items-center border-b border-gray-50 bg-gray-50/50">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {postDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {postDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <button
                                    onClick={() => handleDelete(post.id)}
                                    className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors"
                                    title="Delete Post"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete
                                </button>
                            </div>

                            {/* Post Body */}
                            {post.description && (
                                <div className="px-5 py-4">
                                    <p className="text-gray-800 text-[15px] leading-relaxed">{post.description}</p>
                                </div>
                            )}

                            {/* Post Image */}
                            {post.image_url && (
                                <div className="w-full bg-gray-50 flex justify-center border-y border-gray-50">
                                    <img
                                        src={`http://localhost:5000/${post.image_url}`}
                                        alt="Post content"
                                        className="w-full max-h-[500px] object-contain"
                                    />
                                </div>
                            )}

                            {/* Post Footer / Actions */}
                            <div className="px-5 py-3 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-1.5 text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                    {post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}
                                </div>

                                <button
                                    onClick={() => toggleComments(post.id)}
                                    className={`font-semibold transition flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                                        expandedComments[post.id] 
                                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:text-blue-600'
                                    }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {expandedComments[post.id] ? "Hide Comments" : "Comments"}
                                </button>
                            </div>

                            {/* Comments Dropdown */}
                            {expandedComments[post.id] && (
                                <div className="border-t border-gray-100 bg-gray-50/30">
                                    <CommentSection postId={post.id} />
                                </div>
                            )}
                        </div>
                    );
                })
            )}
            
            {loadingMore && (
                <div className="flex justify-center items-center py-4 gap-2 text-gray-500 text-sm font-medium">
                    <svg className="animate-spin h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading older posts...
                </div>
            )}
        </div>
    );
}