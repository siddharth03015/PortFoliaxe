import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data: { username: string; email: string; password: string; name: string }) =>
  api.post('/auth/register', data);
export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });
export const getMe = () => api.get('/auth/me');

// Profile
export const getPublicProfile = (username: string) => api.get(`/profile/${username}`);
export const updateProfile = (data: any) => api.put('/profile', data);
export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/profile/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Projects
export const getProjects = (category?: string, userId?: string) =>
  api.get('/projects', { params: { ...(category && category !== 'all' ? { category } : {}), ...(userId ? { userId } : {}) } });
export const createProject = (data: any) => api.post('/projects', data);
export const updateProject = (id: string, data: any) => api.put(`/projects/${id}`, data);
export const deleteProject = (id: string) => api.delete(`/projects/${id}`);

// Blog
export const getBlogPosts = (params?: any) => api.get('/blog', { params });
export const getAllBlogPosts = () => api.get('/blog/all');
export const getBlogPost = (slug: string, userId?: string) =>
  api.get(`/blog/${slug}`, { params: userId ? { userId } : {} });
export const createBlogPost = (data: any) => api.post('/blog', data);
export const updateBlogPost = (id: string, data: any) => api.put(`/blog/${id}`, data);
export const deleteBlogPost = (id: string) => api.delete(`/blog/${id}`);

// Contact
export const sendContact = (data: any) => api.post('/contact', data);
export const getContacts = () => api.get('/contact');

export default api;
