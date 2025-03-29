import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
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

interface BlogData {
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  tags: string[];
  image?: File;
  published?: boolean;
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
  getBlogs: async (publishedOnly = true) => {
    try {
      const response = await apiClient.get(`/blogs${publishedOnly ? '?published=true' : ''}`);
      return response.data;
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
  getProjects: async (featuredOnly = false) => {
    try {
      const response = await apiClient.get(`/projects${featuredOnly ? '?featured=true' : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  getProject: async (id: string) => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },
  
  createProject: async (projectData: ProjectData) => {
    try {
      const formData = new FormData();
      
      Object.keys(projectData).forEach(key => {
        if (key !== 'image') {
          if (key === 'technologies' && Array.isArray(projectData[key])) {
            formData.append(key, JSON.stringify(projectData[key]));
          } else {
            formData.append(key, projectData[key as keyof ProjectData] as string);
          }
        }
      });
      
      if (projectData.image && projectData.image instanceof File) {
        formData.append('image', projectData.image);
      }
      
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
  
  updateProject: async (id: string, projectData: ProjectData) => {
    try {
      const formData = new FormData();
      
      Object.keys(projectData).forEach(key => {
        if (key !== 'image') {
          if (key === 'technologies' && Array.isArray(projectData[key])) {
            formData.append(key, JSON.stringify(projectData[key]));
          } else {
            formData.append(key, projectData[key as keyof ProjectData] as string);
          }
        }
      });
      
      if (projectData.image && projectData.image instanceof File) {
        formData.append('image', projectData.image);
      }
      
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
  
  updateProjectProgress: async (id: string, progress: number) => {
    try {
      const response = await apiClient.patch(`/projects/${id}/progress`, { progress });
      return response.data;
    } catch (error) {
      console.error(`Error updating project progress ${id}:`, error);
      throw error;
    }
  },
  
  deleteProject: async (id: string) => {
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
      return response.data;
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