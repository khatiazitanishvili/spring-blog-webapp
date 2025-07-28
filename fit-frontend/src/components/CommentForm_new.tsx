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
 * It utilizes NextUI's Form, Textarea, Input, and Button components
 * to create a responsive and interactive comment submission form.
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
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Leave a Comment
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          Please <a href="/login" className="text-blue-600 hover:underline">log in</a> to leave a comment.
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
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Leave a Comment
      </h3>

      {/* Show logged-in user info */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Commenting as: <span className="font-semibold text-gray-900 dark:text-white">{user?.name}</span>
        </p>
      </div>

      {/* Submission message display */}
      {submissionMessage && (
        <div
          className={`p-3 rounded-md mb-4 text-sm font-medium ${
            isError
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          }`}
          role="alert"
        >
          {submissionMessage}
        </div>
      )}

      {/* NextUI Form component */}
      <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Comment Textarea */}
        <Textarea
          label="Your Comment"
          placeholder="Share your thoughts here..."
          name="comment"
          minRows={4}
          maxRows={10}
          value={commentText}
          onValueChange={setCommentText}
          variant="bordered"
          color="primary"
          radius="lg"
          size="lg"
          fullWidth
          isRequired // Make the comment field required
          errorMessage={
            commentText.length === 0 && !isSubmitting && submissionMessage && isError
              ? 'Comment cannot be empty.'
              : ''
          }
          className="mb-4"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          color="primary"
          variant="shadow"
          size="lg"
          radius="lg"
          fullWidth
          isLoading={isSubmitting} // Show loading spinner when submitting
          isDisabled={isSubmitting} // Disable button when submitting
          className="font-semibold py-3"
        >
          {isSubmitting ? 'Submitting...' : 'Post Comment'}
        </Button>
      </Form>
    </div>
  );
};

export default CommentForm;
