import React, { useState } from 'react';
import { Form, Textarea, Button } from "@nextui-org/react";
import { apiService } from '../services/apiService';
import { useAuth } from './AuthContext';

interface CommentFormProps {
  postId: string; // Make postId required since we need it for the API call
  onCommentSubmitted?: () => void;
}

/**
 * CommentForm component for submitting user comments.
 * It utilizes NextUI's Form, Textarea, and Button components
 * to create a responsive and interactive comment submission form.
 * Now integrated with authentication to use logged-in user's information.
 */
const CommentForm: React.FC<CommentFormProps> = ({ postId, onCommentSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  // State variables to hold the values of the form fields
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // If user is not authenticated, show login message
  if (!isAuthenticated) {
    return (
      <div className="max-w-lg bg-white/5 rounded-lg shadow-md border border-white/10 
              p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold 
               text-white mb-3 sm:mb-4">
        Leave a Comment
      </h3>
      <p className="text-gray-300 text-center py-4 sm:py-6
              text-sm">
        Please <a href="/login" className="text-orange-500 hover:underline font-medium">log in</a> to leave a comment.
      </p>
      </div>
    );
  }

  /**
   * Handles the form submission.
   * Prevents default form submission, calls the API to create a comment,
   * and resets the form fields upon successful submission.
   * Includes basic validation for the comment text.
   * @param e - The form event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser form submission

    // Basic client-side validation
    if (!commentText.trim()) {
      setIsError(true);
      setSubmissionMessage('Comment cannot be empty.');
      return;
    }

    setIsSubmitting(true); // Set loading state
    setSubmissionMessage(null); // Clear previous messages
    setIsError(false); // Clear previous error state

    try {
      // Use the actual API endpoint to create a comment
      await apiService.createComment(postId, commentText.trim());

      // Assuming successful submission
      setSubmissionMessage('Comment submitted successfully!');
      // Clear the form fields after successful submission
      setCommentText('');
      
      // Call the callback if provided
      if (onCommentSubmitted) {
        onCommentSubmitted();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setIsError(true);
      setSubmissionMessage('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-lg bg-white/5 rounded-lg shadow-md border border-white/10 
                    p-3 sm:p-4">
      <h3 className="text-base sm:text-lg font-semibold 
                     text-white mb-3 sm:mb-4">
        Leave a Comment
      </h3>

      {/* Show logged-in user info */}
      <div className="mb-3 p-2 sm:p-3 
                      bg-white/10 rounded-md">
        <p className="text-xs sm:text-sm text-gray-300">
          Commenting as: <span className="font-medium text-white">{user?.name}</span>
        </p>
      </div>

      {/* Submission message display */}
      {submissionMessage && (
        <div
          className={`p-2 rounded-md mb-3 
                      text-xs sm:text-sm font-medium ${
            isError
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}
          role="alert"
        >
          {submissionMessage}
        </div>
      )}

      {/* NextUI Form component */}
      <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Comment Textarea */}
        <Textarea
          label="Your Comment"
          placeholder="Share your thoughts here..."
          name="comment"
          minRows={2}
          maxRows={5}
          value={commentText}
          onValueChange={setCommentText}
          variant="bordered"
          color="primary"
          radius="md"
          size="md"
          fullWidth
          isRequired // Make the comment field required
          errorMessage={
            commentText.length === 0 && !isSubmitting && submissionMessage && isError
              ? 'Comment cannot be empty.'
              : ''
          }
          className="mb-2"
          classNames={{
            label: "text-sm text-white",
            input: "text-sm text-white placeholder:text-white/70",
            inputWrapper: "min-h-[80px]"
          }}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          color="primary"
          size="md"
          fullWidth
          isLoading={isSubmitting} // Show loading spinner when submitting
          isDisabled={isSubmitting} // Disable button when submitting
        
            className="py-2 text-sm h-9 transition-all duration-200 text-white bg-orange-500 hover:bg-orange-600 font-medium rounded-md"
          >
          {isSubmitting ? 'Submitting...' : 'Post Comment'}
        </Button>
      </Form>
    </div>
  );
};

export default CommentForm;
