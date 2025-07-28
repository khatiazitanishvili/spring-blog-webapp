import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  postCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  postCount?: number;
}

export interface Comment {
  id: string;
  content: string;
  user?: {
    id: string;
    name: string;
  };
  postId: string;
  createdAt: string;
  updatedAt: string;
  likes?: number;
}


export interface Post {
  id: string;
  title: string;
  content: string;
  author?: {
    id: string;
    name: string;
  };
  category: Category;
  tags: Tag[];
  readingTime?: number;
  createdAt: string;
  updatedAt: string;
  status?: PostStatus;
  photo?: string; // New attribute for post photo
}

export interface CreatePostRequest {
  title: string;
  content: string;
  categoryId: string;
  tagIds: string[];
  status?: PostStatus;
  photo?: string; // New attribute for post photo
}

export interface UpdatePostRequest extends CreatePostRequest {
  id: string;
  photo?: string; // New attribute for post photo
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}



class ApiService {
  private api: AxiosInstance;
  private static instance: ApiService;

  private constructor() {
    this.api = axios.create({
      baseURL: '/api/v1', // so Vite proxy kicks in
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response?.data) {
      return error.response.data as ApiError;
    }
    return {
      status: 500,
      message: 'An unexpected error occurred'
    };
  }

  // Auth endpoints
  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  }


  

  public logout(): void {
    localStorage.removeItem('token');
  }


  public async register(data: RegisterRequest): Promise<RegisterResponse> {
  const response: AxiosResponse<RegisterResponse> = await this.api.post('/auth/register', data);
  return response.data;
}

  // Posts endpoints
  public async getPosts(params: {
    categoryId?: string;
    tagId?: string;
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts', { params });
    return response.data;
  }

  public async getPost(id: string): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.get(`/posts/${id}`);
    return response.data;
  }

  public async createPost(post: CreatePostRequest): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.post('/posts', post);
    return response.data;
  }

  public async updatePost(id: string, post: UpdatePostRequest): Promise<Post> {
    const response: AxiosResponse<Post> = await this.api.put(`/posts/${id}`, post);
    return response.data;
  }

  public async deletePost(id: string): Promise<void> {
    await this.api.delete(`/posts/${id}`);
  }

  public async getDrafts(params: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<Post[]> {
    const response: AxiosResponse<Post[]> = await this.api.get('/posts/drafts', { params });
    return response.data;
  }

  // Categories endpoints
  public async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<Category[]> = await this.api.get('/categories');
    return response.data;
  }

  public async createCategory(name: string): Promise<Category> {
    const response: AxiosResponse<Category> = await this.api.post('/categories', { name });
    return response.data;
  }

  public async updateCategory(id: string, name: string): Promise<Category> {
    const response: AxiosResponse<Category> = await this.api.put(`/categories/${id}`, { id, name });
    return response.data;
  }

  public async deleteCategory(id: string): Promise<void> {
    await this.api.delete(`/categories/${id}`);
  }

  // Tags endpoints
  public async getTags(): Promise<Tag[]> {
    const response: AxiosResponse<Tag[]> = await this.api.get('/tags');
    return response.data;
  }

  public async createTag(name: string): Promise<Tag> {
    const response: AxiosResponse<Tag> = await this.api.post('/tags', { name });
    return response.data;
  }

  public async createTags(names: string[]): Promise<Tag[]> {
    // If backend expects individual objects, map names to objects
    const tags = names.map(name => ({ name }));
    const response: AxiosResponse<Tag[]> = await this.api.post('/tags/bulk', tags);
    return response.data;
  }

  public async updateTag(id: string, name: string): Promise<Tag> {
    const response: AxiosResponse<Tag> = await this.api.put(`/tags/${id}`, { id, name });
    return response.data;
  }

  public async deleteTag(id: string): Promise<void> {
    await this.api.delete(`/tags/${id}`);
  }

  // Comments endpoints
  public async getComments(): Promise<Comment[]> {
    const response: AxiosResponse<Comment[]> = await this.api.get('/comments');
    return response.data;
  }

  public async getCommentsByPost(postId: string): Promise<Comment[]> {
    const response: AxiosResponse<Comment[]> = await this.api.get(`/comments/post/${postId}`);
    return response.data;
  }

  public async getCommentsByUser(userId: string): Promise<Comment[]> {
    const response: AxiosResponse<Comment[]> = await this.api.get(`/comments/user/${userId}`);
    return response.data;
  }

  public async getComment(commentId: string): Promise<Comment> {
    const response: AxiosResponse<Comment> = await this.api.get(`/comments/${commentId}`);
    return response.data;
  }

  public async getCommentCount(postId: string): Promise<number> {
    const response: AxiosResponse<{ count: number }> = await this.api.get(`/comments/post/${postId}/count`);
    return response.data.count;
  }

  public async createComment(postId: string, content: string): Promise<Comment> {
    const request = { content };
    const response: AxiosResponse<Comment> = await this.api.post(`/comments/post/${postId}`, request);
    return response.data;
  }

  public async updateComment(commentId: string, content: string): Promise<Comment> {
    const request = { content };
    const response: AxiosResponse<Comment> = await this.api.put(`/comments/${commentId}`, request);
    return response.data;
  }

  public async deleteComment(commentId: string): Promise<void> {
    await this.api.delete(`/comments/${commentId}`);
  }

  public async likeComment(commentId: string): Promise<Comment> {
    const response: AxiosResponse<Comment> = await this.api.post(`/comments/${commentId}/like`);
    return response.data;
  }

  public async unlikeComment(commentId: string): Promise<Comment> {
    const response: AxiosResponse<Comment> = await this.api.post(`/comments/${commentId}/unlike`);
    return response.data;
  }
  

  
}

// Export a singleton instance
export const apiService = ApiService.getInstance();