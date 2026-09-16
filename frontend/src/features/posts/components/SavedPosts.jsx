import { useEffect, useState, useRef, useCallback } from "react";
import { getSavedPostsApi, toggleSavePostApi, toggleLikeApi } from "../services/post.service";
import CommentSection from "./CommentSection";
import { useSocket } from "../../../context/SocketContext";
// import useAuth from "../../auth/hooks/useAuth";

export default function SavedPosts() {
    const [posts, setPosts] = useState([]);
    
    // Pagination States
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedComments, setExpandedComments] = useState({});
    
    const socket = useSocket();
    // const { user } = useAuth();
    const observer = useRef();

    // Fetch initial saved posts
    useEffect(() => {
        const fetchFeed = async () => {
            try {
                setLoading(true);
                const response = await getSavedPostsApi(1, 5); 
                setPosts(response.data);
                setHasMore(response.currentPage < response.totalPages);
            } catch (err) {
                console.error(err);
                setError("Failed to load saved posts.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    // Load more posts
    const loadMorePosts = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const response = await getSavedPostsApi(nextPage, 5);
            setPosts((prev) => [...prev, ...response.data]);
            setPage(nextPage);
            setHasMore(response.currentPage < response.totalPages);
        } catch (err) {
            console.error("Failed to load more posts", err);
        } finally {
            setLoadingMore(false);
        }
    }, [page, hasMore, loadingMore]);

    // Intersection Observer for infinite scrolling
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

    // Socket: Like updates
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

    // Socket: Post deletion update (removes it from saved if the original author deletes it)
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

    const toggleComments = (postId) => {
        setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    const handleLikeToggle = async (postId) => {
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
        try {
            await toggleLikeApi(postId);
        } catch (error) {
            console.error("Failed to toggle like", error);
        }
    };

    const handleSaveToggle = async (postId) => {
        // Optimistically remove or visually unsave the post
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post.id === postId) {
                    return { ...post, isSaved: !post.isSaved };
                }
                return post;
            })
        );
        try {
            await toggleSavePostApi(postId);
        } catch (error) {
            console.error("Failed to toggle save", error);
            // Revert on failure
            setPosts((prevPosts) =>
                prevPosts.map((post) => {
                    if (post.id === postId) {
                        return { ...post, isSaved: !post.isSaved };
                    }
                    return post;
                })
            );
        }
    };

    if (loading) return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">Saved Posts</h2>
            {[1, 2, 3].map(n => (
                <div key={n} className="bg-white rounded-2xl h-72 border border-gray-100 shadow-sm animate-pulse"></div>
            ))}
        </div>
    );
    
    if (error) return <div className="text-red-500 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>;

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Saved Collection
                </h2>
                {posts.length > 0 && (
                    <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-100 shadow-sm">
                        {posts.filter(p => p.isSaved).length} Items
                    </span>
                )}
            </div>
            
            {posts.filter(p => p.isSaved).length === 0 ? (
                /* Premium Empty State */
                <div className="text-gray-500 p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
                    <div className="bg-yellow-50 p-5 rounded-full mb-5 border border-yellow-100 text-yellow-500 shadow-sm">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <p className="text-xl font-bold text-gray-800">Your collection is empty</p>
                    <p className="text-sm mt-2 text-center max-w-sm text-gray-500">
                        Save interesting posts from your feeds to read them later. They will appear right here!
                    </p>
                </div>
            ) : (
                posts.map((post, index) => {
                    // Hide posts that have been immediately "unsaved" from this view to keep it clean
                    if (!post.isSaved) return null;

                    const isLast = posts.length === index + 1;
                    const postDate = new Date(post.created_at);
                    
                    return (
                        <div 
                            ref={isLast ? lastPostElementRef : null} 
                            key={post.id} 
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
                        >
                            {/* Post Header */}
                            <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.author?.profileImage ? `http://localhost:5000/${post.author.profileImage}` : '/default-avatar.png'}
                                        alt={post.author?.name}
                                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                                            {post.author?.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {postDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
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
                            <div className="px-5 py-3 flex items-center justify-between text-sm border-t border-gray-50">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleLikeToggle(post.id)}
                                        className={`font-semibold transition flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                                            post.isLiked 
                                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:text-blue-600'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill={post.isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        {post.likesCount}
                                    </button>

                                    <button
                                        onClick={() => toggleComments(post.id)}
                                        className={`font-semibold transition flex items-center gap-2 px-4 py-1.5 rounded-full border ${
                                            expandedComments[post.id] 
                                                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200 hover:text-blue-600'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        Comments
                                    </button>
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={() => handleSaveToggle(post.id)}
                                    className={`font-semibold transition flex items-center gap-2 p-2 rounded-full border ${
                                        post.isSaved 
                                            ? 'bg-yellow-50 text-yellow-600 border-yellow-200' 
                                            : 'bg-white text-gray-500 hover:bg-gray-50 border-transparent hover:border-gray-200 hover:text-yellow-500'
                                    }`}
                                    title="Unsave Post"
                                >
                                    <svg className="w-5 h-5" fill={post.isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
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
                    <svg className="animate-spin h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading older saved posts...
                </div>
            )}
        </div>
    );
}