import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { subscribeComments, addComment } from "../../services/commentService";
import { HiOutlineChatAlt2, HiOutlineX, HiChevronDown, HiChevronUp } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function IssueDetailsModal({ issue, onClose }) {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showRepliesMap, setShowRepliesMap] = useState({});
  const commentsEndRef = useRef(null);

  useEffect(() => {
    if (!issue?.id) return;
    const unsubscribe = subscribeComments(issue.id, (data) => {
      setComments(data);
    });
    return unsubscribe;
  }, [issue?.id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment(issue.id, newCommentText.trim(), null, profile);
      setNewCommentText("");
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add comment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (e, parentId) => {
    e.preventDefault();
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment(issue.id, replyText.trim(), parentId, profile);
      setReplyText("");
      setActiveReplyId(null);
      setShowRepliesMap(prev => ({ ...prev, [parentId]: true }));
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to add reply.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReplies = (commentId) => {
    setShowRepliesMap(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const isVideo = issue.evidenceType === "video" || (issue.evidenceUrl && issue.evidenceUrl.includes("video"));

  const rootComments = comments.filter(c => !c.parentId);
  const getRepliesFor = (commentId) => comments.filter(c => c.parentId === commentId);

  const formatTime = (dateInput) => {
    if (!dateInput) return "";
    const date = dateInput.toDate ? dateInput.toDate() : new Date(dateInput);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden border border-slate-100 z-10 animate-in zoom-in duration-200">
        
        {/* Left Side: Issue details */}
        <div className="flex-1 flex flex-col bg-slate-50/50 h-1/2 md:h-full overflow-y-auto">
          {/* Header for mobile */}
          <div className="flex items-center justify-between p-4 md:hidden bg-white border-b border-slate-100 sticky top-0 z-20">
            <span className="font-bold text-slate-800 line-clamp-1">{issue.title}</span>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>

          <div className="w-full bg-slate-950 flex items-center justify-center relative select-none">
            {issue.evidenceUrl ? (
              isVideo ? (
                <video 
                  src={issue.evidenceUrl} 
                  controls 
                  playsInline
                  className="w-full max-h-[40vh] md:max-h-[50vh] object-contain" 
                  preload="metadata"
                />
              ) : (
                <img 
                  src={issue.evidenceUrl} 
                  alt={issue.title} 
                  className="w-full max-h-[40vh] md:max-h-[50vh] object-contain" 
                />
              )
            ) : (
              <div className="w-full h-48 md:h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-900">
                <svg className="w-12 h-12 opacity-35 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">No visual evidence attached</p>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
                Ward {issue.ward}
              </span>
              <span className={`rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider border ${
                issue.status === 'resolved' ? 'bg-green-50 border-green-200 text-green-700' :
                issue.status === 'inprogress' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                {issue.status}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900 leading-tight mb-3">{issue.title}</h2>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                <span>Category: {issue.category}</span>
                <span>•</span>
                <span>
                  {issue.createdAt 
                    ? (issue.createdAt.toDate ? issue.createdAt.toDate().toLocaleString() : new Date(issue.createdAt).toLocaleString())
                    : "No Date"}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">{issue.description}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Comments panel */}
        <div className="w-full md:w-[450px] flex flex-col bg-white h-1/2 md:h-full border-t md:border-t-0 md:border-l border-slate-100">
          <div className="hidden md:flex items-center justify-between p-6 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2">
              <HiOutlineChatAlt2 className="w-6 h-6 text-slate-700" />
              <h2 className="text-lg font-black text-slate-800">Discussion</h2>
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {comments.length}
              </span>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer">
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {rootComments.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <HiOutlineChatAlt2 className="w-12 h-12 opacity-25 mb-2" />
                <p className="text-sm font-semibold">No comments yet</p>
                <p className="text-xs">Be the first to share your thoughts!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {rootComments.map((comment) => {
                  const replies = getRepliesFor(comment.id);
                  const showReplies = !!showRepliesMap[comment.id];

                  return (
                    <div key={comment.id} className="space-y-4">
                      <div className="flex gap-3">
                        {comment.userPhotoURL ? (
                          <img src={comment.userPhotoURL} alt={comment.userName} className="w-9 h-9 rounded-full object-cover border border-slate-100" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center uppercase">
                            {comment.userName.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-black text-slate-800">{comment.userName}</span>
                            <span className="text-[10px] font-semibold text-slate-400">{formatTime(comment.createdAt)}</span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{comment.text}</p>
                          
                          {profile && (
                            <button 
                              onClick={() => {
                                setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                                setReplyText("");
                              }}
                              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors mt-1 block cursor-pointer"
                            >
                              Reply
                            </button>
                          )}
                        </div>
                      </div>

                      {replies.length > 0 && (
                        <div className="pl-12 space-y-4">
                          <button 
                            onClick={() => toggleReplies(comment.id)}
                            className="flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                          >
                            {showReplies ? (
                              <>
                                <HiChevronUp className="w-4 h-4" />
                                <span>Hide {replies.length} replies</span>
                              </>
                            ) : (
                              <>
                                <HiChevronDown className="w-4 h-4" />
                                <span>View {replies.length} replies</span>
                              </>
                            )}
                          </button>

                          {showReplies && (
                            <div className="space-y-4 pt-2 border-l-2 border-slate-100 pl-4">
                              {replies.map((reply) => (
                                <div key={reply.id} className="flex gap-2">
                                  {reply.userPhotoURL ? (
                                    <img src={reply.userPhotoURL} alt={reply.userName} className="w-7 h-7 rounded-full object-cover border border-slate-100" />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] flex items-center justify-center uppercase">
                                      {reply.userName.charAt(0)}
                                    </div>
                                  )}
                                  <div className="flex-1 space-y-0.5">
                                    <div className="flex items-baseline gap-2">
                                      <span className="text-xs font-black text-slate-800">{reply.userName}</span>
                                      <span className="text-[10px] font-semibold text-slate-400">{formatTime(reply.createdAt)}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 leading-relaxed">{reply.text}</p>
                                    
                                    {profile && (
                                      <button 
                                        onClick={() => {
                                          setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                                          setReplyText("");
                                        }}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors mt-0.5 block cursor-pointer"
                                      >
                                        Reply
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {activeReplyId === comment.id && profile && (
                        <form onSubmit={(e) => handleAddReply(e, comment.id)} className="pl-12 flex gap-3 animate-in slide-in-from-top-2 duration-200">
                          {profile.photoURL ? (
                            <img src={profile.photoURL} alt={profile.name} className="w-7 h-7 rounded-full object-cover border border-slate-100" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center uppercase">
                              {profile.name?.charAt(0) || "C"}
                            </div>
                          )}
                          <div className="flex-1 space-y-2">
                            <input 
                              type="text" 
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply to ${comment.userName}...`}
                              className="w-full text-sm border-b border-slate-200 focus:border-blue-600 focus:outline-none py-1 transition-colors"
                              disabled={submitting}
                              autoFocus
                            />
                            <div className="flex justify-end gap-2 text-xs">
                              <button 
                                type="button" 
                                onClick={() => setActiveReplyId(null)}
                                className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                                disabled={submitting}
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit" 
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                                disabled={!replyText.trim() || submitting}
                              >
                                {submitting ? "Replying..." : "Reply"}
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  );
                })}
                <div ref={commentsEndRef} />
              </div>
            )}
          </div>

          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            {profile ? (
              <form onSubmit={handleAddComment} className="flex gap-3">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt={profile.name} className="w-9 h-9 rounded-full object-cover border border-slate-100" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center uppercase">
                    {profile.name?.charAt(0) || "C"}
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <textarea 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Add a public comment..."
                    rows={1}
                    className="w-full text-sm border border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none p-2 bg-white transition-colors resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAddComment(e);
                      }
                    }}
                    disabled={submitting}
                  />
                  {newCommentText.trim() && (
                    <div className="flex justify-end gap-2 text-xs">
                      <button 
                        type="button" 
                        onClick={() => setNewCommentText("")}
                        className="px-3.5 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                        disabled={submitting}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                        disabled={!newCommentText.trim() || submitting}
                      >
                        {submitting ? "Commenting..." : "Comment"}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            ) : (
              <div className="text-center py-2 space-y-2">
                <p className="text-xs font-semibold text-slate-500">Sign in to share your thoughts and join discussions on ward issues.</p>
                <button 
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
                >
                  Sign In with Email or Google
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
