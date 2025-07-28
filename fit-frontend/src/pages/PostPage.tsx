import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Divider,
  Avatar,
} from '@nextui-org/react';
import {
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash,
  ArrowLeft,
  Share
} from 'lucide-react';
import { apiService, Post } from '../services/apiService';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import { useAuth } from '../hooks/useAuth';

interface PostPageProps {
  isAuthenticated?: boolean;
  currentUserId?: string;
}

const PostPage: React.FC<PostPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentsRefreshTrigger, setCommentsRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!id) {
          console.error('Post ID is missing');
          throw new Error('Post ID is required');
        }
        const fetchedPost = await apiService.getPost(id);
        setPost(fetchedPost);
        setError(null);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!post || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await apiService.deletePost(post.id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete the post. Please try again later.');
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.content.substring(0, 100) + '...',
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

const createSanitizedHTML = (content: string) => {
  return {
    __html: DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'strong', 'em', 'br', 'ul', 'ol', 'li', 'a', 'blockquote',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'img'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel']
    }),
  };
};


  const placeholderImage = 'photo_1.png'; // Backend placeholder image filename
  
  const getPostPhotoUrl = (post: Post) => {
    if (!post.photo) {
      return `https://localhost:8443/post-photos/${placeholderImage}`;
    }
    
    // If post.photo already contains the full path, use it directly
    if (post.photo.startsWith('/post-photos/') || post.photo.startsWith('post-photos/')) {
      return `https://localhost:8443${post.photo.startsWith('/') ? '' : '/'}${post.photo}`;
    }
    
    // If it's just a filename, construct the full path
    return `https://localhost:8443/post-photos/${post.photo}`;
  };

  const canEditOrDeletePost = (post: Post) => {
    // Show edit/delete buttons if:
    // 1. User is logged in (user exists)
    // 2. User's email prefix matches post author's name
    
    if (!user || !post.author) {
      return false;
    }
    
    // Extract email prefix from user's email for comparison
    const userEmailPrefix = user.email.split('@')[0];
    const postAuthorName = post.author.name;
    
    // Match by email prefix (e.g., "jane" from "jane@example.com" matches post author "jane")
    return userEmailPrefix === postAuthorName;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 bg-blue-600 min-h-screen py-4 sm:py-6 lg:py-8">
        <Card className="w-full animate-pulse bg-blue-600/50 border border-white/20">
          <CardBody className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="h-6 sm:h-8 lg:h-10 bg-white/20 rounded w-3/4 mb-4 sm:mb-6 lg:mb-8"></div>
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="h-3 sm:h-4 lg:h-5 bg-white/20 rounded w-full"></div>
              <div className="h-3 sm:h-4 lg:h-5 bg-white/20 rounded w-full"></div>
              <div className="h-3 sm:h-4 lg:h-5 bg-white/20 rounded w-2/3"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 bg-blue-600 min-h-screen py-4 sm:py-6 lg:py-8">
        <Card className="bg-white/10 border border-white/20">
          <CardBody className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 text-center">
            <p className="text-red-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 lg:mb-8">
              {error || 'Post not found'}
            </p>
            <Button
              as={Link}
              to="/"
              color="primary"
              variant="flat"
              startContent={<ArrowLeft size={16} className="sm:size-5 lg:size-6" />}
              size="sm"
              className="text-white bg-orange-500 hover:bg-orange-600 font-semibold 
                         text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 
                         h-10 sm:h-12 lg:h-14 transition-all duration-200"
            >
              Back to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 bg-blue-600 min-h-screen py-4 sm:py-6 lg:py-8">
      {/* Navigation and Action Buttons - Always at top */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between w-full sm:gap-0 mb-4 sm:mb-6">
        <Button
          as={Link}
          to="/"
          variant="flat"
          startContent={<ArrowLeft size={16} className="sm:size-4 lg:size-5" />}
          size="sm"
          className="text-white bg-orange-500 hover:bg-orange-600 font-semibold 
                     text-sm sm:text-base lg:text-lg px-3 sm:px-4 lg:px-6 
                     h-9 sm:h-10 lg:h-11 self-start transition-all duration-200
                     min-w-fit"
        >
          <span className="hidden sm:inline">Back to Posts</span>
          <span className="sm:hidden">Back</span>
        </Button>
        
        <div className="flex gap-1 sm:gap-2 lg:gap-3 flex-wrap justify-start sm:justify-end">
          {canEditOrDeletePost(post) && (
            <>
              <Button
                as={Link}
                to={`/posts/${post.id}/edit`}
                color="primary"
                variant="flat"
                startContent={<Edit size={16} className="sm:size-4 lg:size-5" />}
                size="sm"
                className="text-white bg-orange-500 hover:bg-orange-600 font-semibold 
                           text-sm sm:text-base lg:text-lg px-2 sm:px-3 lg:px-4 
                           h-9 sm:h-10 lg:h-11 transition-all duration-200
                           min-w-fit"
              >
                <span className="hidden md:inline">Edit</span>
              </Button>
              <Button
                color="danger"
                variant="flat"
                startContent={<Trash size={16} className="sm:size-4 lg:size-5" />}
                onClick={handleDelete}
                isLoading={isDeleting}
                size="sm"
                className="text-white bg-red-500 hover:bg-red-600 font-semibold 
                           text-sm sm:text-base lg:text-lg px-2 sm:px-3 lg:px-4 
                           h-9 sm:h-10 lg:h-11 transition-all duration-200
                           min-w-fit"
              >
                <span className="hidden md:inline">Delete</span>
              </Button>
            </>
          )}
          <Button
            variant="flat"
            startContent={<Share size={16} className="sm:size-4 lg:size-5" />}
            onClick={handleShare}
            size="sm"
            className="text-white bg-blue-500 hover:bg-blue-600 font-semibold 
                       text-sm sm:text-base lg:text-lg px-2 sm:px-3 lg:px-4 
                       h-9 sm:h-10 lg:h-11 transition-all duration-200
                       min-w-fit"
          >
            <span className="hidden md:inline">Share</span>
          </Button>
        </div>
      </div>

      <Card className="w-full bg-blue-600 shadow-none border-none">
        <CardHeader className="px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          {/* Desktop: Single Line Layout */}
          <div className="hidden xl:block w-full space-y-4">
            {/* Post Image - full width */}
            <div className="post-photo-container w-full">
              <img
                src={getPostPhotoUrl(post)}
                alt={post.title}
                className="w-full h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 xl:h-96 
                           object-cover rounded-lg sm:rounded-xl shadow-lg"
              />
            </div>

            {/* Title and Metadata in one line */}
            <div className="flex items-start justify-between w-full gap-6">
              {/* Post Title */}
              <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white leading-tight 
                             flex-1 break-words">
                {post.title}
              </h1>

              {/* Post Metadata */}
              <div className="flex items-center gap-6 flex-shrink-0">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <Avatar
                    name={post.author?.name}
                    size="md"
                    className="flex-shrink-0"
                  />
                  <span className="text-white text-base font-medium truncate">
                    {post.author?.name}
                  </span>
                </div>

                {/* Date and Reading Time */}
                <div className="flex items-center gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="flex-shrink-0" />
                    <span className="text-sm whitespace-nowrap">{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="flex-shrink-0" />
                    <span className="text-sm whitespace-nowrap">{post.readingTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Stacked Layout */}
          <div className="xl:hidden space-y-3">
            {/* Post Image */}
            <div className="post-photo-container w-full">
              <img
                src={getPostPhotoUrl(post)}
                alt={post.title}
                className="w-full h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 
                           object-cover rounded-lg sm:rounded-xl shadow-lg"
              />
            </div>

            {/* Post Title */}
            <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl 
                           font-bold text-white leading-tight break-words">
              {post.title}
            </h1>

            {/* Post Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 lg:gap-6 w-full">
              {/* Author Info */}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <Avatar
                  name={post.author?.name}
                  size="sm"
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                />
                <span className="text-white text-sm sm:text-base lg:text-lg font-medium truncate">
                  {post.author?.name}
                </span>
              </div>

              {/* Date and Reading Time */}
              <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3 sm:gap-4 lg:gap-6 text-white/90">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Calendar size={16} className="sm:size-5 lg:size-6 flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base truncate">{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock size={16} className="sm:size-5 lg:size-6 flex-shrink-0" />
                  <span className="text-xs sm:text-sm lg:text-base">{post.readingTime} min read</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <Divider className='bg-white/20'/>

        <CardBody className="px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div
            className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl max-w-none 
                       text-white prose-headings:text-white prose-p:text-white/90 
                       prose-strong:text-white prose-em:text-white/80
                       leading-relaxed sm:leading-loose"
            dangerouslySetInnerHTML={createSanitizedHTML(post.content)}
          />
        </CardBody>

        <CardFooter className="flex flex-col items-start gap-3 sm:gap-4 lg:gap-6 px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <Divider className='bg-white/20'/>
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4">
            <Chip 
              variant='bordered'
              size="sm"
              className="text-white border-white/50 hover:border-white text-xs sm:text-sm lg:text-base
                         px-2 sm:px-3 py-1 sm:py-2 transition-all duration-200"
            >
              {post.category.name}
            </Chip>
            {post.tags.map((tag) => (
              <Chip
                variant='bordered'
                size="sm"
                key={tag.id}
                startContent={<Tag size={14} className="sm:size-4 lg:size-5" />}
                className="text-white border-white/50 hover:border-white text-xs sm:text-sm lg:text-base
                           px-2 sm:px-3 py-1 sm:py-2 transition-all duration-200"
              >
                {tag.name}
              </Chip>
            ))}
          </div>
        </CardFooter>
      </Card>
      
      {/* Comments Section */}
      <div className="mt-6 sm:mt-8 lg:mt-12 space-y-6 sm:space-y-8 lg:space-y-12">
        {/* Existing Comments */}
        <CommentList 
          postId={post.id} 
          refreshTrigger={commentsRefreshTrigger}
        />
        
        {/* Comment Form */}
        <CommentForm 
          postId={post.id} 
          onCommentSubmitted={() => {
            console.log('Comment submitted for post:', post.id);
            // Trigger comments refresh
            setCommentsRefreshTrigger(prev => prev + 1);
          }}
        />
      </div>
    </div>
  );
};

export default PostPage;