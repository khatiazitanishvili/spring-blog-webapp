import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Image, Divider } from '@nextui-org/react';
import { Post } from '../services/apiService';
import { Heart, Send, ArrowUpRight } from 'lucide-react';
import DOMPurify from 'dompurify';

interface PostListProps {
  posts: Post[] | null;
  featuredPost: Post | null;
  loading: boolean;
  error: string | null;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  featuredPost,
  loading,
  error,
}) => {

  const navigate = useNavigate();
  const rest = posts || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const createExcerpt = (content: string) => {
    // First sanitize the HTML
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
      ALLOWED_ATTR: []
    });

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedContent;

    // Get the text content and limit it
    let textContent = tempDiv.textContent || tempDiv.innerText || '';
    textContent = textContent.trim();

    // Limit to roughly 200 characters, ending at the last complete word
    if (textContent.length > 200) {
      textContent = textContent.substring(0, 200).split(' ').slice(0, -1).join(' ') + '...';
    }
    // Split into sentences (handle multiple sentence endings)
    const sentences = textContent.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);


    // Take only the first 2 sentences
    if (sentences.length >= 2) {
      return sentences.slice(0, 2).join('. ') + '.';
    } else if (sentences.length === 1) {
      return sentences[0] + '.';
    }

    return textContent;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Featured Post Skeleton */}
        <Card className="bg-blue-600/50 rounded-xl sm:rounded-2xl lg:rounded-3xl 
                         p-4 sm:p-6 md:p-8 lg:p-12 w-full animate-pulse 
                         mb-6 sm:mb-8 lg:mb-12 border border-white/10">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center">
            <div className="w-full lg:w-7/12">
              <div className="bg-white/20 rounded-lg sm:rounded-xl lg:rounded-2xl 
                              aspect-square sm:aspect-[4/3] lg:aspect-square w-full"></div>
            </div>
            <div className="flex flex-col w-full lg:w-7/12 space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="h-6 sm:h-8 lg:h-10 bg-white/20 rounded w-3/4"></div>
              <div className="space-y-2 sm:space-y-3">
                <div className="h-3 sm:h-4 lg:h-5 bg-white/20 rounded w-full"></div>
                <div className="h-3 sm:h-4 lg:h-5 bg-white/20 rounded w-5/6"></div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 lg:gap-6">
                <div className="h-3 sm:h-4 bg-white/20 rounded w-20 sm:w-24"></div>
                <div className="h-3 sm:h-4 bg-white/20 rounded w-20 sm:w-24"></div>
                <div className="h-3 sm:h-4 bg-white/20 rounded w-20 sm:w-24"></div>
              </div>
            </div>
          </div>
        </Card>
        
        <Divider className="my-6 sm:my-8 lg:my-12 bg-white/20 h-px" />
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="bg-blue-600/50 rounded-lg sm:rounded-xl lg:rounded-2xl 
                                        animate-pulse border border-white/10">
              <div className="bg-white/20 h-32 xs:h-40 sm:h-48 lg:h-56 xl:h-64 w-full"></div>
              <div className="p-3 sm:p-4 lg:p-6 space-y-2 sm:space-y-3 lg:space-y-4">
                <div className="h-4 sm:h-5 lg:h-6 bg-white/20 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-white/20 rounded w-1/2"></div>
                <div className="pt-3 sm:pt-4 lg:pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-1 sm:space-x-2">
                      <div className="h-6 sm:h-7 lg:h-8 w-12 sm:w-14 bg-white/20 rounded-full"></div>
                      <div className="h-6 sm:h-7 lg:h-8 w-12 sm:w-14 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="h-6 sm:h-7 lg:h-8 w-20 sm:w-24 lg:w-28 bg-white/20 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="p-4 sm:p-6 lg:p-8 text-red-500 bg-red-50 dark:bg-red-900/20 
                        rounded-lg sm:rounded-xl lg:rounded-2xl border border-red-200 
                        dark:border-red-800 text-center">
          <p className="text-sm sm:text-base lg:text-lg font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const navToPostPage = (post: Post) => {
    navigate(`/posts/${post.id}`)
  }

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

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">

      {/* Featured */}
      {featuredPost && (
        <Card className="bg-blue-600 rounded-xl sm:rounded-2xl lg:rounded-3xl 
                         p-4 sm:p-6 md:p-8 lg:p-12 w-full font-sans shadow-none border-none 
                         mb-6 sm:mb-8 lg:mb-12">
          {/* Flex container for the two-column layout */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-center">

            {/* Left Side: Image */}
            <div className="w-full lg:w-7/12">
              <Image
                src={getPostPhotoUrl(featuredPost)}
                alt={featuredPost.title}
                width={500}
                height={500}
                className="rounded-lg sm:rounded-xl lg:rounded-2xl object-cover 
                           aspect-square sm:aspect-[4/3] lg:aspect-square w-full
                           shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
            </div>

            {/* Right Side: Content */}
            <div className="flex flex-col w-full lg:w-7/12 text-white">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 
                             font-bold text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-white/80 mb-4 sm:mb-6 lg:mb-8 leading-relaxed 
                            text-sm sm:text-base lg:text-lg">
                {createExcerpt(featuredPost.content)}
              </p>

              {/* Metadata Section */}
              <div className="flex flex-col sm:flex-row gap-x-4 sm:gap-x-6 lg:gap-x-8 
                              gap-y-2 sm:gap-y-3 lg:gap-y-4 mb-4 sm:mb-6 lg:mb-8">
                <div>
                  <p className="text-xs sm:text-sm text-white/70">Category</p>
                  <p className="font-semibold text-sm sm:text-base lg:text-lg">{featuredPost.category.name}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-white/70">Publication Date</p>
                  <p className="font-semibold text-sm sm:text-base lg:text-lg">{formatDate(featuredPost.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-white/70">Author</p>
                  <p className="font-semibold text-sm sm:text-base lg:text-lg">{featuredPost.author?.name || 'N/A'}</p>
                </div>
              </div>

              {/* Interaction & Read More in same row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center 
                              justify-between gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
                {/* Icons - moved to top on mobile */}
                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 order-2 sm:order-1">
                  <span className="flex items-center gap-1 sm:gap-2 border border-white 
                                   rounded-full px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 
                                   text-xs sm:text-sm lg:text-base transition-colors 
                                   hover:bg-white/10 cursor-pointer">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>29</span>
                  </span>
                  <span className="flex items-center gap-1 sm:gap-2 border border-white 
                                   rounded-full px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 
                                   text-xs sm:text-sm lg:text-base transition-colors 
                                   hover:bg-white/10 cursor-pointer">
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>20</span>
                  </span>
                </div>
                
                {/* Read More Button */}
                <button
                  onClick={() => navToPostPage(featuredPost)}
                  className="bg-orange-500 text-white font-bold 
                             py-2 sm:py-3 lg:py-4 px-6 sm:px-8 lg:px-12 
                             rounded-lg hover:bg-orange-600 focus:outline-none 
                             focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75 
                             transition-all duration-200 flex items-center gap-2 
                             text-sm sm:text-base lg:text-lg order-1 sm:order-2
                             w-full sm:w-auto justify-center"
                >
                  Read More
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </button>
              </div>

            </div>
          </div>
        </Card>
      )}
      <Divider className="my-6 sm:my-8 lg:my-12 bg-white h-px" />  
      
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 bg-blue-600">
        {rest.map((post) => (
          <Card key={post.id} className="bg-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl 
                                        overflow-hidden shadow-lg hover:shadow-xl 
                                        transition-all duration-300 hover:scale-105 
                                        border border-white/10 hover:border-white/20 
                                        flex flex-col h-full">
            <Image
              removeWrapper
              isBlurred
              src={getPostPhotoUrl(post)}
              alt={post.title}
              className="w-full object-cover h-32 xs:h-40 sm:h-48 lg:h-56 xl:h-64"
            />
            <div className="p-3 sm:p-4 lg:p-6 flex flex-col flex-grow text-white">
              <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold 
                             mb-1 sm:mb-2 leading-tight">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-white/70 
                            mb-3 sm:mb-4 lg:mb-6">
                {post.category.name}
              </p>

              {/* This div pushes the footer to the bottom */}
              <div className="mt-auto pt-3 sm:pt-4 lg:pt-6 border-t border-white/10">

                {/* Responsive flex container */}
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-3">

                  {/* Left side: Icon Pills */}
                  <div className="flex items-center space-x-1 sm:space-x-2 order-2 xs:order-1">
                    <span className="flex items-center gap-1 border border-white rounded-full 
                                     px-2 sm:px-3 py-1 text-xs sm:text-sm hover:bg-white/10 
                                     transition-colors cursor-pointer">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>2</span>
                    </span>
                    <span className="flex items-center gap-1 border border-white rounded-full 
                                     px-2 sm:px-3 py-1 text-xs sm:text-sm hover:bg-white/10 
                                     transition-colors cursor-pointer">
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>2</span>
                    </span>
                  </div>

                  {/* Right side: Read More Button */}
                  <button
                    onClick={() => navToPostPage(post)}
                    className="flex items-center justify-center gap-1 sm:gap-2 
                               bg-orange-500 hover:bg-orange-600 font-semibold 
                               py-1.5 sm:py-2 lg:py-2.5 px-3 sm:px-4 lg:px-6 
                               rounded-lg transition-all duration-200 
                               text-xs sm:text-sm lg:text-base 
                               w-full xs:w-auto min-w-0 xs:min-w-[100px] sm:min-w-[120px]
                               order-1 xs:order-2"
                  >
                    <span className="truncate">Read More</span>
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

    </div>

  );
};

export default PostList;