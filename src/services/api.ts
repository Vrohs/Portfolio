// Base API setup
import axios, { AxiosInstance } from 'axios';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  summary?: string;
  tags: string[];
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
  date: string;
}

export interface BlogData {
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  tags: string[];
  image?: File;
  published?: boolean;
}

export interface BlogsResponse {
  success: boolean;
  data: Blog[];
  message?: string;
  pagination?: {
    totalPages: number;
    currentPage: number;
    totalBlogs: number;
  };
}

export interface BlogResponse {
  success: boolean;
  data: Blog;
  message?: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  content?: string;
  technologies: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  title: string;
  description: string;
  content?: string;
  technologies: string[];
  image?: File;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  progress?: number;
}

export interface ProjectsResponse {
  success: boolean;
  data: Project[];
  message?: string;
}

export interface ProjectResponse {
  success: boolean;
  data: Project;
  message?: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  date: string;
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactsResponse {
  success: boolean;
  data: Contact[];
  message?: string;
}

// API client creator with interceptors
const createApiClient = (): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return apiClient;
};

// Service creator helper function
const createFormData = <T extends Record<string, any>>(data: T): FormData => {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'tags' || key === 'technologies') {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      }
    } else if (key === 'image' && value instanceof File) {
      formData.append('image', value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  return formData;
};

// Auth Service
class AuthService {
  private apiClient: AxiosInstance;
  
  constructor() {
    this.apiClient = createApiClient();
  }
  
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/auth/register', userData);
      if (response.data.success) {
        this.setAuthData(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }
  
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await this.apiClient.post<AuthResponse>('/auth/login', credentials);
      if (response.data.success) {
        this.setAuthData(response.data);
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
  
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }
  
  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  
  async getProfile() {
    try {
      const response = await this.apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
  
  private setAuthData(data: AuthResponse): void {
    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data));
  }
}

// Blog Service
class BlogService {
  private apiClient: AxiosInstance;
  
  constructor() {
    this.apiClient = createApiClient();
  }
  
  async getBlogs(publishedOnly = true, page = 1, limit = 10) {
    try {
      const queryParams = new URLSearchParams();
      if (publishedOnly) {
        queryParams.append('published', 'true');
      }
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      const response = await this.apiClient.get(`/blogs?${queryParams.toString()}`);
      
      return {
        data: response.data.data || [],
        pagination: {
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || 1,
          totalBlogs: response.data.totalCount || 0
        }
      };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }
  
  async getBlog(slug: string): Promise<BlogResponse> {
    try {
      const response = await this.apiClient.get(`/blogs/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog ${slug}:`, error);
      throw error;
    }
  }
  
  async createBlog(blogData: BlogData): Promise<BlogResponse> {
    try {
      const formData = createFormData(blogData);
      
      const response = await this.apiClient.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }
  
  async updateBlog(id: string, blogData: BlogData): Promise<BlogResponse> {
    try {
      const formData = createFormData(blogData);
      
      const response = await this.apiClient.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating blog ${id}:`, error);
      throw error;
    }
  }
  
  async deleteBlog(id: string) {
    try {
      const response = await this.apiClient.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting blog ${id}:`, error);
      throw error;
    }
  }
}

// Project Service
class ProjectService {
  private apiClient: AxiosInstance;
  
  constructor() {
    this.apiClient = createApiClient();
  }
  
  async getProjects(featuredOnly = false): Promise<ProjectsResponse> {
    try {
      const response = await this.apiClient.get(`/projects${featuredOnly ? '?featured=true' : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }
  
  async getProject(id: string): Promise<ProjectResponse> {
    try {
      const response = await this.apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  }
  
  async createProject(projectData: ProjectData): Promise<ProjectResponse> {
    try {
      const formData = createFormData(projectData);
      
      const response = await this.apiClient.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
  
  async updateProject(id: string, projectData: ProjectData): Promise<ProjectResponse> {
    try {
      const formData = createFormData(projectData);
      
      const response = await this.apiClient.put(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  }
  
  async updateProjectProgress(id: string, progress: number): Promise<ProjectResponse> {
    try {
      const response = await this.apiClient.patch(`/projects/${id}/progress`, { progress });
      return response.data;
    } catch (error) {
      console.error(`Error updating project progress ${id}:`, error);
      throw error;
    }
  }
  
  async deleteProject(id: string): Promise<{ success: boolean, message: string }> {
    try {
      const response = await this.apiClient.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
}

// Contact Service
class ContactService {
  private apiClient: AxiosInstance;
  
  constructor() {
    this.apiClient = createApiClient();
  }
  
  async submitContact(contactData: ContactData) {
    try {
      const response = await this.apiClient.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  }
  
  async getContacts() {
    try {
      const response = await this.apiClient.get('/contact');
      return {
        data: Array.isArray(response.data) ? response.data : 
              response.data.data ? response.data.data : [],
      };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  }
  
  async markAsRead(id: string) {
    try {
      const response = await this.apiClient.put(`/contact/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error marking contact ${id} as read:`, error);
      throw error;
    }
  }
  
  async deleteContact(id: string) {
    try {
      const response = await this.apiClient.delete(`/contact/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      throw error;
    }
  }
}

// Create service instances
const authService = new AuthService();
const blogService = new BlogService();
const projectService = new ProjectService();
const contactService = new ContactService();

// Export services
export {
  authService,
  blogService,
  projectService,
  contactService
};

// Export as default with all services
export default {
  auth: authService,
  blog: blogService,
  project: projectService,
  contact: contactService
};