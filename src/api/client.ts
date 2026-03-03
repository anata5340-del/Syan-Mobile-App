import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import appConfig from '../config/appConfig';
import { getToken, removeToken } from '../utils/token';
import { useAuthStore } from '../stores/auth.store';
import { isTokenExpired } from '../utils/tokenUtils';

const api = axios.create({
  baseURL: appConfig.apiBaseUrl, 
  timeout: appConfig.requestTimeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const method = (config.method ?? 'get').toUpperCase();
    const baseURL = config.baseURL ?? '';
    const url = config.url ?? '';
    const fullUrl = url.startsWith('http') ? url : `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
    console.log(`[API] ${method} ${fullUrl}`);

    try {
      let token = await getToken();
      console.log("Token:", token);

      // Skip token check for auth endpoints
      if (config.url?.includes('/login') || config.url?.includes('/register')) {
        return config;
      }

      if (!token) {
        console.log('No token available for request');
        return config;
      }

      if (isTokenExpired(token, 5)) {
        console.log('Token expired before request, refreshing...');
        const refreshed = await useAuthStore.getState().checkAndRefreshToken();
        
        if (refreshed) {
          token = await getToken();
          console.log('Using refreshed token');
        } else {
          console.log('Token refresh failed, request will fail');
          token = null;
        }
      }

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.log('Request interceptor error:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log(' 401 Unauthorized, attempting token refresh');
      
      try {
        const refreshed = await useAuthStore.getState().checkAndRefreshToken();

        if (refreshed) {
          const newToken = await getToken();
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            console.log(' Retrying request with new token');
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.log(' Token refresh error on 401:', refreshError);
      }

      console.log(' Authentication failed, logging out');
      await removeToken();
      await useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default api;