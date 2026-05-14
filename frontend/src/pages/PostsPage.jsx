import { useState, useEffect, useRef } from 'react';
import AppNavbar from '../components/common/AppNavbar';
import API from '../services/api';
import {
  Image,
  Video,
  Mic,
  Send,
  Trash2,
  X,
  Loader2,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import './PostsPage.css';

const REACTIONS = [
  { type: 'LIKE',  emoji: '👍', label: 'Like' },
  { type: 'LOVE',  emoji: '❤️', label: 'Love' },
  { type: 'HAHA',  emoji: '😂', label: 'Haha' },
  { type: 'WOW',   emoji: '😮', label: 'Wow' },
  { type: 'SAD',   emoji: '😢', label: 'Sad' },
  { type: 'ANGRY', emoji: '😡', label: 'Angry' },
];

/* ─── Helper: time ago ───────────────────────────────────────── */
const timeAgo = (instant) => {
  if (!instant) return '';
  const diff = Date.now() - new Date(instant).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(instant).toLocaleDateString();
};

/* ─── Avatar helper ──────────────────────────────────────────── */
const avatarUrl = (profileImage, name) =>
  profileImage ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&background=6366f1&color=fff&size=80`;

/* ═══════════════════════════════════════════════════════════════
   CREATE POST CARD
   ═══════════════════════════════════════════════════════════════ */
const CreatePostCard = ({ currentUser, onPostCreated }) => {
  const [caption, setCaption] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaKind, setMediaKind] = useState(null);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video');
    const isAud = file.type.startsWith('audio');
    setMediaKind(isVid ? 'video' : isAud ? 'audio' : 'image');
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setMediaFile(null);
    setMediaPreview(null);
    setMediaKind(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!caption.trim() && !mediaFile) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('caption', caption);
      if (mediaFile) formData.append('media', mediaFile);

      const res = await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCaption('');
      removeMedia();
      onPostCreated(res.data);
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="flex gap-3">
        <img
          src={avatarUrl(currentUser?.profileImage, currentUser?.fullName)}
          alt="You"
          className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-neutral-700 flex-shrink-0"
        />
        <textarea
          className="post-textarea"
          rows={3}
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
      </div>

      {mediaPreview && (
        <div className="media-preview-container">
          {mediaKind === 'video' ? (
            <video src={mediaPreview} controls className="w-full" />
          ) : mediaKind === 'audio' ? (
            <audio src={mediaPreview} controls className="w-full" />
          ) : (
            <img src={mediaPreview} alt="Preview" />
          )}
          <button className="media-preview-remove" onClick={removeMedia}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <button
            className="attach-btn"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = 'image/*';
                fileInputRef.current.click();
              }
            }}
          >
            <Image size={16} /> Photo
          </button>
          <button
            className="attach-btn"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = 'video/*';
                fileInputRef.current.click();
              }
            }}
          >
            <Video size={16} /> Video
          </button>
          <button
            className="attach-btn"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = 'audio/*';
                fileInputRef.current.click();
              }
            }}
          >
            <Mic size={16} /> Audio
          </button>
        </div>
        <button
          className="post-submit-btn"
          disabled={posting || (!caption.trim() && !mediaFile)}
          onClick={handleSubmit}
        >
          {posting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Posting...
            </>
          ) : (
            <>
              <Send size={14} /> Post
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SINGLE POST CARD
   ═══════════════════════════════════════════════════════════════ */
const PostCard = ({ post, currentUserId, onUpdatePost, onDeletePost }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isAuthor = post.authorId === currentUserId;

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const res = await API.get(`/posts/${post.id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) loadComments();
  };

  const handleReaction = async (type) => {
    try {
      const res = await API.post(`/posts/${post.id}/reactions`, { type });
      onUpdatePost(res.data);
    } catch (err) {
      console.error('Failed to react:', err);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setSendingComment(true);
    try {
      const res = await API.post(`/posts/${post.id}/comments`, { content: commentText });
      setComments((prev) => [...prev, res.data]);
      setCommentText('');
      onUpdatePost({ ...post, commentCount: (post.commentCount || 0) + 1 });
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSendingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/posts/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      onUpdatePost({ ...post, commentCount: Math.max(0, (post.commentCount || 0) - 1) });
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await API.delete(`/posts/${post.id}`);
      onDeletePost(post.id);
    } catch (err) {
      console.error('Failed to delete post:', err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="post-card post-animate-in">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl(post.authorProfileImage, post.authorFullName)}
            alt={post.authorFullName}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-neutral-700"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
              {post.authorFullName || post.authorUsername}
            </p>
            <p className="text-xs text-gray-400">
              @{post.authorUsername} · {timeAgo(post.createdAt)}
            </p>
          </div>
        </div>
        {isAuthor && (
          <button
            className="delete-post-btn"
            onClick={handleDeletePost}
            disabled={deleting}
            title="Delete post"
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        )}
      </div>

      {post.caption && (
        <p className="px-4 pb-2 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
          {post.caption}
        </p>
      )}

      {/* Replaced mediaData with mediaUrl */}
      {post.mediaType === 'IMAGE' && post.mediaUrl && (
        <img src={post.mediaUrl} alt="Post" className="post-media" />
      )}
      {post.mediaType === 'VIDEO' && post.mediaUrl && (
        <video src={post.mediaUrl} controls className="post-media" />
      )}
      {post.mediaType === 'AUDIO' && post.mediaUrl && (
        <div className="px-4 pb-2">
          <audio src={post.mediaUrl} controls className="w-full" />
        </div>
      )}

      <div className="px-4 py-3 flex items-center justify-between">
        <div className="reaction-bar">
          {REACTIONS.map(({ type, emoji }) => {
            const count = post.reactionCounts?.[type] || 0;
            const isActive = post.currentUserReaction === type;
            return (
              <button
                key={type}
                className={`reaction-btn ${isActive ? 'active' : ''}`}
                onClick={() => handleReaction(type)}
                title={type}
              >
                <span className="reaction-emoji">{emoji}</span>
                {count > 0 && <span>{count}</span>}
              </button>
            );
          })}
        </div>
        <button className="toggle-comments-btn flex items-center gap-1" onClick={toggleComments}>
          <MessageCircle size={15} />
          <span>{post.commentCount || 0}</span>
          {showComments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {loadingComments ? (
            <div className="flex items-center justify-center py-3">
              <Loader2 size={18} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              {comments.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">No comments yet. Be the first!</p>
              )}
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <img
                    src={avatarUrl(comment.authorProfileImage, comment.authorFullName)}
                    alt={comment.authorFullName}
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
                  />
                  <div className="comment-bubble">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {comment.authorFullName || comment.authorUsername}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{timeAgo(comment.createdAt)}</span>
                        {comment.authorId === currentUserId && (
                          <button
                            className="delete-post-btn"
                            onClick={() => handleDeleteComment(comment.id)}
                            title="Delete comment"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">{comment.content}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          <div className="comment-input-row">
            <input
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
            />
            <button
              className="comment-send-btn"
              onClick={handleAddComment}
              disabled={!commentText.trim() || sendingComment}
            >
              {sendingComment ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   SKELETON LOADER
   ═══════════════════════════════════════════════════════════════ */
const PostSkeleton = () => (
  <div className="post-card p-4">
    <div className="flex items-center gap-3 mb-3">
      <div className="skeleton w-10 h-10 rounded-full" />
      <div className="flex-1">
        <div className="skeleton h-3 w-28 mb-2" />
        <div className="skeleton h-2 w-20" />
      </div>
    </div>
    <div className="skeleton h-3 w-full mb-2" />
    <div className="skeleton h-3 w-3/4 mb-3" />
    <div className="skeleton h-48 w-full rounded-lg" />
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   POSTS PAGE
   ═══════════════════════════════════════════════════════════════ */
const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await API.get('/auth/me');
      setCurrentUser(res.data);
      return res.data;
    } catch {
      return null;
    }
  };

  const fetchPosts = async (pageNumber = 0) => {
    try {
      const res = await API.get(`/posts?page=${pageNumber}&size=10`);
      // Since backend now returns a Page<PostDto>, we use res.data.content
      const newPosts = res.data.content || [];
      if (pageNumber === 0) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      setHasMore(!res.data.last);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      if (pageNumber === 0) {
        setLoading(false);
      }
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    void Promise.allSettled([fetchCurrentUser(), fetchPosts(0)]);
  }, []);

  // Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        hasMore &&
        !loading &&
        !loadingMore
      ) {
        setLoadingMore(true);
        // Using length-based pagination heuristic or just ref
        fetchPosts(Math.ceil(posts.length / 10));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading, loadingMore]);

  // Local state updaters
  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handleDeletePost = (postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const currentUserId = currentUser?.id || currentUser?._id;

  return (
    <div className="app-page">
      <AppNavbar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {currentUser && (
          <CreatePostCard currentUser={currentUser} onPostCreated={handlePostCreated} />
        )}

        {loading ? (
          <div className="space-y-4">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-600 text-sm">
              No posts yet. Be the first to share something!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={currentUserId}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
              />
            ))}
            {loadingMore && (
              <div className="flex justify-center py-4">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            )}
            {!hasMore && posts.length > 0 && (
              <div className="text-center py-6 text-sm text-gray-400">
                You have reached the end of the feed.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
