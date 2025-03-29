import axios from 'axios';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
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

// Auth services
export const authService = {
  // Register user
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
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
  
  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
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
  
  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
  
  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Get user profile
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

// Blog services
export const blogService = {
  // Get all blogs (with optional filter for published only)
  getBlogs: async (publishedOnly = true) => {
    try {
      const response = await apiClient.get(`/blogs${publishedOnly ? '?published=true' : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },
  
  // Get single blog by slug
  getBlog: async (slug) => {
    try {
      const response = await apiClient.get(`/blogs/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog ${slug}:`, error);
      throw error;
    }
  },
  
  // Create new blog
  createBlog: async (blogData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(blogData).forEach(key => {
        if (key !== 'image') {
          if (key === 'tags' && Array.isArray(blogData[key])) {
            formData.append(key, JSON.stringify(blogData[key]));
          } else {
            formData.append(key, blogData[key]);
          }
        }
      });
      
      // Append image if exists
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
  
  // Update blog
  updateBlog: async (id, blogData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(blogData).forEach(key => {
        if (key !== 'image') {
          if (key === 'tags' && Array.isArray(blogData[key])) {
            formData.append(key, JSON.stringify(blogData[key]));
          } else {
            formData.append(key, blogData[key]);
          }
        }
      });
      
      // Append image if exists
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
  
  // Delete blog
  deleteBlog: async (id) => {
    try {
      const response = await apiClient.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting blog ${id}:`, error);
      throw error;
    }
  }
};

// Project services
export const projectService = {
  // Get all projects (with optional filter for featured only)
  getProjects: async (featuredOnly = false) => {
    try {
      const response = await apiClient.get(`/projects${featuredOnly ? '?featured=true' : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },
  
  // Get single project by id
  getProject: async (id) => {
    try {
      const response = await apiClient.get(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },
  
  // Create new project
  createProject: async (projectData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(projectData).forEach(key => {
        if (key !== 'image') {
          if (key === 'tags' && Array.isArray(projectData[key])) {
            formData.append(key, JSON.stringify(projectData[key]));
          } else {
            formData.append(key, projectData[key]);
          }
        }
      });
      
      // Append image if exists
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
  
  // Update project
  updateProject: async (id, projectData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(projectData).forEach(key => {
        if (key !== 'image') {
          if (key === 'tags' && Array.isArray(projectData[key])) {
            formData.append(key, JSON.stringify(projectData[key]));
          } else {
            formData.append(key, projectData[key]);
          }
        }
      });
      
      // Append image if exists
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
  
  // Update project progress
  updateProjectProgress: async (id, progress) => {
    try {
      const response = await apiClient.patch(`/projects/${id}/progress`, { progress });
      return response.data;
    } catch (error) {
      console.error(`Error updating project progress ${id}:`, error);
      throw error;
    }
  },
  
  // Delete project
  deleteProject: async (id) => {
    try {
      const response = await apiClient.delete(`/projects/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting project ${id}:`, error);
      throw error;
    }
  }
};

// Contact service
export const contactService = {
  // Submit contact form
  submitContact: async (contactData) => {
    try {
      const response = await apiClient.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
  
  // Get all contacts (admin only)
  getContacts: async () => {
    try {
      const response = await apiClient.get('/contact');
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },
  
  // Mark contact as read (admin only)
  markAsRead: async (id) => {
    try {
      const response = await apiClient.put(`/contact/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error marking contact ${id} as read:`, error);
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