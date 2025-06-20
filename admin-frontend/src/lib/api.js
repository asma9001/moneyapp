import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
}

// Blog Posts API
export const blogAPI = {
  // Get all posts
  getPosts: (page = 1, limit = 10) => 
    api.get(`/posts?page=${page}&limit=${limit}`),
  
  // Get single post
  getPost: (id) => api.get(`/posts/${id}`),
  
  // Create new post
  createPost: (postData) => api.post('/posts', postData),
  
  // Update post
  updatePost: (id, postData) => api.put(`/posts/${id}`, postData),
  
  // Delete post
  deletePost: (id) => api.delete(`/posts/${id}`),
  
  // Upload image
  uploadImage: (formData) => 
    api.post('/posts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
}

// WordPress Sites API
export const sitesAPI = {
  getSites: () => api.get('/sites'),
}

export default api

