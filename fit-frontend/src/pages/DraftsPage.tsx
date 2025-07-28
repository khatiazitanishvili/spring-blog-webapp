import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardHeader,
  CardBody,
  Button,
  Image,
} from '@nextui-org/react';
import { Plus, Heart, Send, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService, Post } from '../services/apiService';
import placeholderImage from '../assets/placeholder.png';

const DraftsPage: React.FC = () => {
  const [drafts, setDrafts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("updatedAt,desc");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDrafts({
          page: page - 1,
          size: 10,
          sort: sortBy,
        });
        setDrafts(response);
        setError(null);
      } catch (err) {
        setError('Failed to load drafts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrafts();
  }, [page, sortBy]);

  const navToPostPage = (post: Post) => {
    navigate(`/posts/${post.id}/edit`);
  };


  const formatCount = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardBody>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-default-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-default-200 rounded-lg h-64"></div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card className="bg-blue-600 shadow-none border-none">
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">My Drafts</h1>
          <Button
            as={Link}
            to="/posts/new"
            startContent={<Plus size={16} />}
            className="text-white bg-orange-500 font-semibold"
          >
            New Post
          </Button>
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          {/* Custom Draft Cards - Matching PostList Design */}
          {drafts && drafts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 bg-blue-600">
              {drafts.map((post) => (
                <Card key={post.id} className="bg-blue-600 rounded-lg sm:rounded-xl lg:rounded-2xl 
                                          overflow-hidden shadow-lg hover:shadow-xl 
                                          transition-all duration-300 hover:scale-105 
                                          border border-white/10 hover:border-white/20 
                                          flex flex-col h-full">
                  <Image
                    removeWrapper
                    isBlurred
                    src={post.photo || placeholderImage}
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
                            <span>{formatCount(2200)}</span>
                          </span>
                          <span className="flex items-center gap-1 border border-white rounded-full 
                                           px-2 sm:px-3 py-1 text-xs sm:text-sm hover:bg-white/10 
                                           transition-colors cursor-pointer">
                            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{formatCount(60)}</span>
                          </span>
                        </div>

                        {/* Right side: Edit Draft Button */}
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
                          <span className="truncate">Edit Draft</span>
                          <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white">
              <p className="text-lg mb-4">You don't have any draft posts yet.</p>
              <Button
                as={Link}
                to="/posts/new"
                color="primary"
                variant="flat"
                className="mt-4 bg-orange-500 text-white"
              >
                Create Your First Post
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DraftsPage;