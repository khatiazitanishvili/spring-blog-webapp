import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody,
  Tabs, 
  Tab,
  Divider,
  Pagination
} from '@nextui-org/react';
import { apiService, Post, Category, Tag } from '../services/apiService';
import PostList from '../components/PostList';

const HomePage: React.FC = () => {
  const [allPosts, setAllPosts] = useState<Post[] | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt,desc");
  const [selectedCategory, setSelectedCategory] = useState<string|undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);

  const POSTS_PER_PAGE = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get featured post (first post)
        const featuredResponse = await apiService.getPosts({});

        // Get all posts (without pagination parameters)
        const postsResponse = await apiService.getPosts({      
          categoryId: selectedCategory != undefined ? selectedCategory : undefined,
          tagId: selectedTag || undefined,
          sort: sortBy
        });

        const [categoriesResponse, tagsResponse] = await Promise.all([
          apiService.getCategories(),
          apiService.getTags()
        ]);

        setFeaturedPost(featuredResponse[0] || null);
        setAllPosts(postsResponse);
        setTotalPosts(postsResponse.length || 0);
        setCategories(categoriesResponse);
        setTags(tagsResponse);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sortBy, selectedCategory, selectedTag]);

  // Client-side pagination
  useEffect(() => {
    if (allPosts) {
      const startIndex = (page - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const currentPagePosts = allPosts.slice(startIndex, endIndex);
      
      console.log(`Page ${page}: Showing posts ${startIndex + 1} to ${endIndex} of ${allPosts.length}`);
      console.log('Current page posts:', currentPagePosts);
      
      setPosts(currentPagePosts);
      setTotalPages(Math.ceil(allPosts.length / POSTS_PER_PAGE));
    }
  }, [allPosts, page]);

  const handleCategoryChange = (categoryId: string|undefined) => {
    if("all" === categoryId){
      setSelectedCategory(undefined)
    } else {
      setSelectedCategory(categoryId);
    }
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12">
      <Card className="mb-6 px-2 bg-transparent shadow-none">
        <CardBody>
          <div className="flex flex-col items-center gap-y-4 text-white">
            
            {/* Categories Line - Centered */}
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                key="all"
                onClick={() => handleCategoryChange("all")}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === undefined
                    ? 'bg-white text-blue-600 border border-white'
                    : 'bg-transparent text-white border border-white/50'
                }`}
              >
                All Posts
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category.id
                      ? 'bg-white text-blue-600 border border-white'
                      : 'bg-transparent text-white'
                  }`}
                >
                  {category.name} ({category.postCount})
                </button>
              ))}
            </div>

            {/* Tags Line */}
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap justify-center">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag.id ? undefined : tag.id);
                      setPage(1);
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTag === tag.id
                        ? 'bg-white text-blue-600 border border-white'
                        : 'bg-transparent text-white border border-white/50'
                    }`}
                  >
                    {tag.name} ({tag.postCount})
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      <Divider className="my-12 bg-white" />  

      <PostList
        posts={posts}
        featuredPost={featuredPost}
        loading={loading}
        error={error}
        page={page}
        sortBy={sortBy}
        onPageChange={setPage}
        onSortChange={setSortBy}
      />

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            page={page}
            onChange={handlePageChange}
            showControls
            color="primary"
            classNames={{
              wrapper: "gap-2",
              item: "w-8 h-8 text-small",
              cursor: "bg-orange-500 text-white font-bold",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;