import axios from 'axios';

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

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  summary?: string; // Adding this for compatibility with BlogsManagement
  tags: string[];
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
  date: string;
}

export interface BlogsResponse {
  success: boolean;
  data: Blog[];
  message?: string;
}

export interface BlogResponse {
  success: boolean;
  data: Blog;
  message?: string;
}

interface BlogData {
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  tags: string[];
  image?: File;
  published?: boolean;
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

interface ProjectData {
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

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
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

export interface ContactsResponse {
  success: boolean;
  data: Contact[];
  message?: string;
}

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

export const authService = {
  register: async (userData: RegisterData) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },
  
  login: async (credentials: LoginData) => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }
};

export const blogService = {
  getBlogs: async (publishedOnly = true, page = 1, limit = 10) => {
    try {
      const queryParams = new URLSearchParams();
      if (publishedOnly) {
        queryParams.append('published', 'true');
      }
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      const response = await apiClient.get(`/blogs?${queryParams.toString()}`);
      
      // Return data structure compatible with the component
      return {
        data: response.data.blogs || [],
        pagination: {
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || 1,
          totalBlogs: response.data.totalBlogs || 0
        }
      };
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },
  
  getBlog: async (slug: string) => {
    try {
      const response = await apiClient.get(`/blogs/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog ${slug}:`, error);
      throw error;
    }
  },
  
  createBlog: async (blogData: BlogData) => {
    try {
      const formData = new FormData();
      
      Object.keys(blogData).forEach(key => {
        if (key !== 'image') {
          if (key === 'tags' && Array.isArray(blogData[key])) {
            formData.append(key, JSON.stringify(blogData[key]));
          } else {
            formData.append(key, blogData[key as keyof BlogData] as string);
          }
        }
      });
      
      if (blogData.image && blogData.image instanceof File) {
        formData.append('image', blogData.image);
      }
      
      const response = await apiClient.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },
  
  updateBlog: async (id: string, blogData: BlogData) => {
    try {
      const formData = new FormData();
      
      Object.keys(blogData).forEach(key => {
        if (key !== 'image') {
          if (key === 'tags' && Array.isArray(blogData[key])) {
            formData.append(key, JSON.stringify(blogData[key]));
          } else {
            formData.append(key, blogData[key as keyof BlogData] as string);
          }
        }
      });
      
      if (blogData.image && blogData.image instanceof File) {
        formData.append('image', blogData.image);
      }
      
      const response = await apiClient.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error updating blog ${id}:`, error);
      throw error;
    }
  },
  
  deleteBlog: async (id: string) => {
    try {
      const response = await apiClient.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting blog ${id}:`, error);
      throw error;
    }
  }
};

export const projectService = {
  getProjects: async (featuredOnly = false): Promise<ProjectsResponse> => {
    try {
      const response = await apiClient.get(`/projects${featuredOnly ? '?featured=true' : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  getProject: async (id: string): Promise<ProjectResponse> => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },
  
  createProject: async (projectData: ProjectData): Promise<ProjectResponse> => {
    try {
      const formData = new FormData();
      
      Object.entries(projectData).forEach(([key, value]) => {
        if (key === 'technologies' && Array.isArray(value)) {
          value.forEach(tech => formData.append('technologies[]', tech));
        } else if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      const response = await apiClient.post('/projects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },
  
  updateProject: async (id: string, projectData: ProjectData): Promise<ProjectResponse> => {
    try {
      const formData = new FormData();
      
      Object.entries(projectData).forEach(([key, value]) => {
        if (key === 'technologies' && Array.isArray(value)) {
          value.forEach(tech => formData.append('technologies[]', tech));
        } else if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      
      const response = await apiClient.put(`/projects/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error updating project ${id}:`, error);
      throw error;
    }
  },
  
  updateProjectProgress: async (id: string, progress: number): Promise<ProjectResponse> => {
    try {
      const response = await apiClient.patch(`/projects/${id}/progress`, { progress });
      return response.data;
    } catch (error) {
      console.error(`Error updating project progress ${id}:`, error);
      throw error;
    }
  },
  
  deleteProject: async (id: string): Promise<{ success: boolean, message: string }> => {
    try {
      const response = await apiClient.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
};

export const contactService = {
  submitContact: async (contactData: ContactData) => {
    try {
      const response = await apiClient.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
  
  getContacts: async () => {
    try {
      const response = await apiClient.get('/contact');
      return {
        data: Array.isArray(response.data) ? response.data : 
              response.data.contacts ? response.data.contacts : [],
      };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },
  
  markAsRead: async (id: string) => {
    try {
      const response = await apiClient.put(`/contact/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error marking contact ${id} as read:`, error);
      throw error;
    }
  },
  
  deleteContact: async (id: string) => {
    try {
      const response = await apiClient.delete(`/contact/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting contact ${id}:`, error);
      throw error;
    }
  }
};

export default {
  auth: authService,
  blog: blogService,
  project: projectService,
  contact: contactService
};