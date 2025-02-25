import { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { supabase } from '../../supabase';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Supabase session token to headers
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  if (session) {
    config.headers['Authorization'] = `Bearer ${session.access_token}`;
    config.headers['supabase-user-id'] = session.user.id;
  }
  
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401エラーの場合はログアウト処理
    if (error.response && error.response.status === 401) {
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = api({ ...config, cancelToken: source.token })
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      throw err;
    });

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};

// Error type definition
export type ErrorType<Error> = AxiosError<Error>;

export default customInstance; 