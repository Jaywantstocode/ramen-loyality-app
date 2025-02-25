import axios from 'axios';
import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the session
        const { data, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          // If refresh fails, sign out
          await supabase.auth.signOut();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // If refresh succeeds, retry the original request
        if (data.session) {
          originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
); 