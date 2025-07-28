import React, { useEffect, useState } from 'react';
import { Card, CardBody, Avatar, Spinner, Button, Textarea } from '@nextui-org/react';
import { Calendar, Edit, Trash, Save, X } from 'lucide-react';
import { apiService, Comment } from '../services/apiService';
import { useAuth } from '../hooks/useAuth';

interface CommentListProps {
  postId: string;
  refreshTrigger?: number; // Optional prop to trigger refresh
}

const CommentList: React.FC<CommentListProps> = ({ postId, refreshTrigger }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedComments = await apiService.getCommentsByPost(postId);
        setComments(fetchedComments);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId, refreshTrigger]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEditClick = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleEditSave = async (commentId: string) => {
    if (!editContent.trim()) return;
    
    try {
      setIsUpdating(true);
      await apiService.updateComment(commentId, editContent);
      
      // Update the comment in the local state
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, content: editContent }
            : comment
        )
      );
      
      setEditingCommentId(null);
      setEditContent('');
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      setIsDeleting(commentId);
      await apiService.deleteComment(commentId);
      
      // Remove the comment from local state
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== commentId)
      );
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const canEditOrDelete = (comment: Comment) => {
    // Show edit/delete buttons if:
    // 1. User is logged in (user exists)
    // 2. User's email matches comment author's name (since name appears to be email prefix)
    
    if (!user || !comment.user) {
      return false;
    }
    
    // Extract email prefix from user's email for comparison
    const userEmailPrefix = user.email.split('@')[0];
    const commentAuthorName = comment.user.name;
    
    // Match by email prefix (e.g., "jane" from "jane@example.com" matches comment author "jane")
    return userEmailPrefix === commentAuthorName;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4 sm:py-6">
        <Spinner size="md" className="w-6 h-6 sm:w-8 sm:h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 sm:py-6">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-4 sm:py-6 max-w-3xl
                      bg-white/5 rounded-lg border border-white/10">
        <p className="text-gray-300 text-sm">
          No comments yet. Be the first to leave a comment!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-3">
      <h3 className="text-lg sm:text-xl font-semibold text-white 
                     mb-3 sm:mb-4">
        Comments ({comments.length})
      </h3>
      {comments.map((comment) => (
        <Card key={comment.id} 
              className="bg-white/5 max-w-lg border border-white/10
             shadow-md hover:shadow-lg transition-shadow duration-200
             rounded-lg">
          <CardBody className="p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <Avatar
          name={comment.user?.name || 'Anonymous'}
          size="sm"
          className="flex-shrink-0 mt-0.5 w-7 h-7 sm:w-8 sm:h-8"
              />
              <div className="flex-grow min-w-0">
          {/* Header with author info and buttons */}
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between 
              mb-2 sm:gap-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
              <h4 className="font-medium text-white 
                 text-sm truncate">
                {comment.user?.name || 'Anonymous'}
              </h4>
              <div className="flex items-center gap-1 
                  text-xs text-gray-300">
                <Calendar size={12} />
                <span className="truncate">{formatDate(comment.createdAt)}</span>
              </div>
            </div>
            
            {/* Edit and Delete buttons */}
            {canEditOrDelete(comment) && (
              <div className="flex items-center gap-1 self-start sm:self-auto">
                {editingCommentId !== comment.id && (
            <>
              <Button
                size="sm"
                variant="light"
                startContent={<Edit size={12} />}
                onClick={() => handleEditClick(comment)}
                className="min-w-0 px-2 py-1 
                     text-xs h-auto text-white
                     hover:bg-white/10 transition-colors"
              >
                <span className="hidden md:inline">Edit</span>
              </Button>
              <Button
                size="sm"
                variant="light"
                color="danger"
                startContent={<Trash size={12} />}
                onClick={() => handleDelete(comment.id)}
                isLoading={isDeleting === comment.id}
                className="min-w-0 px-2 py-1 
                     text-xs h-auto text-red-300
                     hover:bg-red-500/20 transition-colors"
              >
                <span className="hidden md:inline">Delete</span>
              </Button>
            </>
                )}
              </div>
            )}
          </div>
          
          {/* Comment content or edit form */}
          {editingCommentId === comment.id ? (
            <div className="space-y-2 sm:space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit your comment..."
                minRows={2}
                maxRows={4}
                className="w-full"
                classNames={{
            input: "text-sm text-white placeholder:text-white/70",
            inputWrapper: "min-h-[60px] bg-white/10 border-white/20",
            label: "text-sm text-white"
                }}
              />
              <div className="flex items-center gap-2 flex-wrap">
                <Button
            size="sm"
            color="primary"
            startContent={<Save size={12} />}
            onClick={() => handleEditSave(comment.id)}
            isLoading={isUpdating}
            isDisabled={!editContent.trim()}
            className="text-xs px-3 h-7 transition-all duration-200"
                >
            Save
                </Button>
                <Button
            size="sm"
            variant="light"
            startContent={<X size={12} />}
            onClick={handleEditCancel}
            className="text-xs px-3 h-7 transition-all duration-200"
                >
            Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-white leading-relaxed 
                text-sm break-words">
              {comment.content}
            </div>
          )}
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default CommentList;
