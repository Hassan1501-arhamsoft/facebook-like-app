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
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">My Posts</h2>
            {posts.map((post, index) => {
                const isLast = posts.length === index + 1;
                
                return (
                    <div 
                        ref={isLast ? lastPostElementRef : null} 
                        key={post.id} 
                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-sm text-gray-500">
                                {new Date(post.created_at).toLocaleString()}
                            </div>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-sm transition"
                            >
                                Delete
                            </button>
                        </div>
                        {post.description && <p className="text-gray-800 mb-4">{post.description}</p>}
                        <img
                            src={`http://localhost:5000/${post.image_url}`}
                            alt="Post content"
                            className="w-full max-h-96 object-cover rounded-md"
                        />
                        <div className="mt-4 pt-3 border-t flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-1 text-gray-700 font-medium">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                {post.likesCount} {post.likesCount === 1 ? 'Like' : 'Likes'}
                            </div>

                            <button
                                onClick={() => toggleComments(post.id)}
                                className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                {expandedComments[post.id] ? "Hide Comments" : "View Comments"}
                            </button>
                        </div>

                        {expandedComments[post.id] && <CommentSection postId={post.id} />}
                    </div>
                );
            })}
            
            {loadingMore && <div className="text-center py-4 text-gray-500 text-sm">Loading more posts...</div>}
        </div>
    );
}